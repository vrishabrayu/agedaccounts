import { NextResponse } from "next/server";
import {
  attachPaymentToOrder,
  calculateCartTotal,
  createPendingOrder,
} from "../../../lib/orders";
import { createNowPaymentsInvoice, getAppBaseUrl } from "../../../lib/nowpayments";
import { dbConnect } from "../../../lib/mongoose";
import Account from "../../../models/Account";

export const dynamic = "force-dynamic";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const items = Array.isArray(body.items) ? body.items : [];
    const coin = String(body.coin || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const allowedCoins = ["usdtbsc", "usdttrc20", "btc", "eth", "ltc"];
    if (!coin) {
      return NextResponse.json({ error: "Cryptocurrency selection is required." }, { status: 400 });
    }
    if (!allowedCoins.includes(coin)) {
      return NextResponse.json({ error: "Invalid cryptocurrency selected." }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const normalizedItems = items.map((item) => ({
      id: String(item.id || "").trim(),
      name: String(item.name || item.niche || "").trim(),
      niche: String(item.niche || item.name || "").trim(),
      platform: String(item.platform || "").trim(),
      price: Number(item.price),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    if (normalizedItems.some((item) => !item.id || !Number.isFinite(item.price) || item.price <= 0)) {
      return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    }

    // Checkout stock validation
    await dbConnect();
    for (const item of normalizedItems) {
      const available = await Account.countDocuments({
        productId: item.id,
        status: "AVAILABLE",
      });
      if (available < item.quantity) {
        return NextResponse.json(
          { error: "Insufficient stock", available },
          { status: 400 }
        );
      }
    }

    const totalAmount = calculateCartTotal(normalizedItems);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: "Order total must be greater than zero." }, { status: 400 });
    }

    const order = await createPendingOrder({
      email,
      items: normalizedItems,
      totalAmount,
    });

    const appBaseUrl = getAppBaseUrl(request);
    const invoice = await createNowPaymentsInvoice({
      priceAmount: totalAmount,
      payCurrency: coin.toUpperCase(),
      orderId: order.id,
      orderDescription: order.orderDescription,
      customerEmail: email,
      ipnCallbackUrl: `${appBaseUrl}/api/payment/webhook`,
      successUrl: `${appBaseUrl}/order/success?orderId=${order.id}`,
      cancelUrl: `${appBaseUrl}/cart`,
    });

    await attachPaymentToOrder(order.id, {
      paymentId: invoice.paymentId,
      invoiceUrl: invoice.invoiceUrl,
    });

    return NextResponse.json({
      orderId: order.id,
      invoiceUrl: invoice.invoiceUrl,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("[create-payment]", error);
    return NextResponse.json(
      { error: error.message || "Could not start crypto checkout. Please try again." },
      { status: 500 }
    );
  }
}

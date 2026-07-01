import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  mapNowPaymentsStatus,
  verifyNowPaymentsSignature,
} from "../../../../lib/nowpayments";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    let payload;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error("[payment/webhook] Invalid JSON payload");
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const signature = request.headers.get("x-nowpayments-sig");
    if (!verifyNowPaymentsSignature(payload, signature)) {
      console.error("[payment/webhook] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const orderId = payload.order_id ? String(payload.order_id) : null;
    const paymentId = payload.payment_id ? String(payload.payment_id) : payload.invoice_id ? String(payload.invoice_id) : null;
    const mappedStatus = mapNowPaymentsStatus(payload.payment_status);

    if (!orderId) {
      console.error("[payment/webhook] Missing order_id in payload", payload);
      return NextResponse.json({ error: "Missing order_id." }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
      console.error("[payment/webhook] Order not found:", orderId);
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const updateData = {
      status: mappedStatus,
      paymentId: paymentId || existingOrder.paymentId,
    };

    if (mappedStatus === "PAID") {
      updateData.fulfilledAt = existingOrder.fulfilledAt || new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[payment/webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

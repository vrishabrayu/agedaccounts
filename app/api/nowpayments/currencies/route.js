import { NextResponse } from "next/server";
import { createNowPaymentsInvoice } from "../../../../lib/nowpayments";

const NOWPAYMENTS_API_BASE = process.env.NOWPAYMENTS_API_BASE || "https://api.nowpayments.io/v1";

export async function GET() {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NOWPAYMENTS_API_KEY is missing" }, { status: 500 });
  }

  try {
    // 1. Get full-currencies
    const fullRes = await fetch(`${NOWPAYMENTS_API_BASE}/full-currencies`, {
      headers: { "x-api-key": apiKey }
    });
    const fullData = await fullRes.json();

    // 2. Get available-currencies
    const availRes = await fetch(`${NOWPAYMENTS_API_BASE}/currencies`, {
      headers: { "x-api-key": apiKey }
    });
    const availData = await availRes.json();

    const currencies = fullData.currencies || [];
    const available = availData.currencies || [];

    // Filter for USDT, TRON, TRX
    const matchFull = currencies.filter(c => {
      const code = (c.code || "").toLowerCase();
      const name = (c.name || "").toLowerCase();
      const network = (c.network || "").toLowerCase();
      return code.includes("usdt") || name.includes("usdt") || network.includes("usdt") ||
        code.includes("tron") || name.includes("tron") || network.includes("tron") ||
        code.includes("trx") || name.includes("trx") || network.includes("trx");
    });

    const matchAvail = available.filter(c => {
      const code = String(c).toLowerCase();
      return code.includes("usdt") || code.includes("tron") || code.includes("trx");
    });

    const results = {
      matchedFullCurrencies: matchFull,
      matchedAvailableCurrencies: matchAvail,
      tests: []
    };

    // 3. Test invoice-payment
    const testCodes = ["USDTTRC20", "usdttrc20", "trx", "TRX"];

    // Add any returned TRC20 USDT code
    const trc20usdt = matchFull.find(c => c.network === "trx" && c.code.toLowerCase().includes("usdt"));
    if (trc20usdt && !testCodes.includes(trc20usdt.code)) {
      testCodes.push(trc20usdt.code);
    }
    const uniqueTestCodes = [...new Set(testCodes.map(c => c.toLowerCase()))];

    for (const code of uniqueTestCodes) {
      try {
        const orderId = "test_curr_" + Date.now() + "_" + code;

        // Use our library function which creates invoice then invoice-payment
        const invoicePayload = {
          price_amount: 10,
          price_currency: "usd",
          order_id: orderId,
          order_description: "Currency Test",
        };
        const invoiceResponse = await fetch(`${NOWPAYMENTS_API_BASE}/invoice`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoicePayload),
        });
        const invoiceData = await invoiceResponse.json();
        const invoiceId = invoiceData.id;

        if (!invoiceId) {
          results.tests.push({ code, status: "error", message: "Failed to create invoice", response: invoiceData });
          continue;
        }

        const paymentPayload = {
          iid: invoiceId,
          pay_currency: code,
        };
        const paymentResponse = await fetch(`${NOWPAYMENTS_API_BASE}/invoice-payment`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        });
        const paymentData = await paymentResponse.json();

        results.tests.push({ code, status: paymentResponse.ok ? "success" : "failed", response: paymentData });
      } catch (err) {
        results.tests.push({ code, status: "error", error: err.message });
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

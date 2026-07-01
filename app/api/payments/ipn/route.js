import { NextResponse } from "next/server";
import { handlePaymentWebhook } from "../../../../routes/paymentWebhook";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-nowpayments-sig") || "";

    const { status, body } = await handlePaymentWebhook({
      rawBody,
      signature,
    });

    return NextResponse.json(body, { status });
  } catch (error) {
    console.error("[api/payments/ipn] Unhandled error:", error);
    return NextResponse.json(
      { error: "Webhook processing encountered an internal error." },
      { status: 500 }
    );
  }
}

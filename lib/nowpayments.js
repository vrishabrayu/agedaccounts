import crypto from "crypto";

const NOWPAYMENTS_API_BASE =
  process.env.NOWPAYMENTS_API_BASE || "https://api.nowpayments.io/v1";

export function getAppBaseUrl(request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }
  if (request) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function verifyNowPaymentsSignature(payload, signature) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) {
    console.warn("[NOWPayments] NOWPAYMENTS_IPN_SECRET is not set; skipping webhook signature verification.");
    return true;
  }

  if (!signature) return false;

  const sorted = sortObject(payload);
  const expected = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(sorted))
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

export function mapNowPaymentsStatus(paymentStatus) {
  const normalized = String(paymentStatus || "").toLowerCase();
  switch (normalized) {
    case "finished":
      return "PAID";
    case "failed":
    case "expired":
    case "refunded":
      return "FAILED";
    case "waiting":
    case "confirming":
    case "confirmed":
    case "sending":
    case "partially_paid":
    default:
      return "PENDING";
  }
}

export async function createNowPaymentsInvoice({
  priceAmount,
  payCurrency,
  orderId,
  orderDescription,
  customerEmail,
  ipnCallbackUrl,
  successUrl,
  cancelUrl,
}) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("NOWPAYMENTS_API_KEY is not configured.");
  }

  // 1. Create Invoice
  const invoicePayload = {
    price_amount: Number(priceAmount),
    price_currency: "usd",
    pay_currency: payCurrency || undefined,
    is_fee_paid_by_user: true,
    order_id: orderId,
    order_description: orderDescription,
    customer_email: customerEmail || undefined,
    ipn_callback_url: ipnCallbackUrl,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  const invoiceResponse = await fetch(`${NOWPAYMENTS_API_BASE}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoicePayload),
  });

  const invoiceData = await invoiceResponse.json().catch(() => ({}));
  
  console.log("[NOWPayments] POST /invoice Request:", JSON.stringify(invoicePayload, null, 2));
  console.log("[NOWPayments] POST /invoice Response:", JSON.stringify(invoiceData, null, 2));

  if (!invoiceResponse.ok) {
    const message =
      invoiceData?.message ||
      invoiceData?.error ||
      `NOWPayments invoice request failed (${invoiceResponse.status}).`;
    throw new Error(message);
  }

  const invoiceId = invoiceData.id;
  if (!invoiceId) {
    throw new Error("NOWPayments did not return an invoice ID.");
  }

  if (!invoiceData.invoice_url) {
    console.error("[NOWPayments] CRITICAL: invoice_url is missing from response:", invoiceData);
    throw new Error("NOWPayments did not return an invoice URL.");
  }

  return {
    invoiceUrl: invoiceData.invoice_url,
    paymentId: String(invoiceId),
    raw: invoiceData,
  };
}

import { dbConnect } from "../lib/mongoose";
import WebhookLog from "../models/WebhookLog";
import Order from "../models/Order";
import Product from "../models/Product";
import { verifyNowPaymentsSignature } from "../lib/nowpayments";
import { processSuccessfulPayment } from "../services/paymentService";
import { processEmailQueue } from "../services/emailService";

/**
 * Handles NOWPayments Webhook IPN requests.
 * Expects raw body text and signature header.
 */
export async function handlePaymentWebhook({ rawBody, signature }) {
  await dbConnect();

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error("[WebhookHandler] Failed to parse JSON body:", error);
    return { status: 400, body: { error: "Invalid JSON payload" } };
  }

  const paymentId = payload.payment_id ? String(payload.payment_id) : payload.invoice_id ? String(payload.invoice_id) : null;
  const orderId = payload.order_id ? String(payload.order_id) : null;
  const paymentStatus = payload.payment_status ? String(payload.payment_status).toLowerCase() : null;

  console.log(`[WebhookHandler] Received payload: paymentId=${paymentId}, orderId=${orderId}, status=${paymentStatus}`);

  // 1. Signature Verification
  if (!verifyNowPaymentsSignature(payload, signature)) {
    console.error("[WebhookHandler] Signature verification failed.");
    return { status: 401, body: { error: "Invalid signature" } };
  }
  console.log("[WebhookHandler] Signature verification passed.");

  if (!paymentId || !orderId) {
    console.error("[WebhookHandler] Missing payment_id or order_id in payload.");
    return { status: 400, body: { error: "Missing required identifiers" } };
  }

  // 2. Webhook Deduplication Check using unique key (paymentId + "_" + paymentStatus)
  const uniqueKey = `${paymentId}_${paymentStatus}`;
  try {
    const existingLog = await WebhookLog.findOne({ uniqueKey });
    if (existingLog) {
      console.log(`[WebhookHandler] Duplicate webhook received for ${uniqueKey}. Skipping processing.`);
      return { status: 200, body: { message: "Duplicate payload skipped" } };
    }
  } catch (err) {
    console.error("[WebhookHandler] Error checking WebhookLog:", err);
  }

  // 3. Process ONLY when payment_status is "finished"
  if (paymentStatus !== "finished") {
    console.log(`[WebhookHandler] Payment status is '${paymentStatus}', not finished. Logging and skipping action.`);
    
    // Save to WebhookLog
    await WebhookLog.create({
      paymentId,
      orderId,
      uniqueKey,
      payload,
      status: paymentStatus || "unknown",
    });

    return { status: 200, body: { message: `Logged status: ${paymentStatus}` } };
  }

  // 4. Validate Order and Product existence
  // Retrieve the Order using Prisma or Mongoose. Note that prior checkout created the order.
  // We can query the database.
  const orderRecord = await Order.findById(orderId);
  if (!orderRecord) {
    console.error(`[WebhookHandler] Order not found in database: ${orderId}`);
    return { status: 404, body: { error: "Order not found" } };
  }

  const productRecord = await Product.findById(orderRecord.productId);
  if (!productRecord) {
    console.error(`[WebhookHandler] Product not found in database: ${orderRecord.productId}`);
    return { status: 404, body: { error: "Product not found" } };
  }

  // 5. Verify payment amount matches expected amount
  // NOWPayments payload includes price_amount (USD invoice value)
  const payloadAmount = Number(payload.price_amount);
  const expectedAmount = Number(orderRecord.pricePaid || orderRecord.totalCents / 100);
  
  if (Math.abs(payloadAmount - expectedAmount) > 0.01) {
    console.error(`[WebhookHandler] Amount mismatch: Received ${payloadAmount}, Expected ${expectedAmount}`);
    
    await WebhookLog.create({
      paymentId,
      orderId,
      uniqueKey,
      payload,
      status: "amount_mismatch",
    });

    return { status: 400, body: { error: "Payment amount mismatch" } };
  }

  // 6. Run payment success onboarding workflow
  let result;
  try {
    result = await processSuccessfulPayment({
      paymentId,
      orderId,
      productId: orderRecord.productId.toString(),
      customerEmail: orderRecord.customerEmail,
      pricePaid: payloadAmount,
      payCurrency: payload.pay_currency || "unknown",
    });

    // Save success WebhookLog
    await WebhookLog.create({
      paymentId,
      orderId,
      uniqueKey,
      payload,
      status: "processed",
    });
  } catch (error) {
    console.error("[WebhookHandler] Error processing successful payment logic:", error);
    
    await WebhookLog.create({
      paymentId,
      orderId,
      uniqueKey,
      payload,
      status: "failed_processing",
    });

    return { status: 500, body: { error: "Internal processing error" } };
  }

  // 7. Fire off background worker to send queued emails asynchronously
  processEmailQueue().catch((err) => {
    console.error("[WebhookHandler] Error in background email processing trigger:", err);
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Payment processed and onboarding initialized.",
      details: result,
    },
  };
}

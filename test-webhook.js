require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");

const Product = require("./models/Product").default;
const Account = require("./models/Account").default;
const Order = require("./models/Order").default;
const WebhookLog = require("./models/WebhookLog").default;
const EmailQueue = require("./models/EmailQueue").default;

const { handlePaymentWebhook } = require("./routes/paymentWebhook");
const { processEmailQueue } = require("./services/emailService");

function signPayload(payload, secret) {
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
  const sorted = sortObject(payload);
  return crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(sorted))
    .digest("hex");
}

async function runTests() {
  console.log("-----------------------------------------");
  console.log("Starting Webhook & Onboarding Flow Tests...");
  console.log("-----------------------------------------");

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Error: DATABASE_URL not set in environment.");
    process.exit(1);
  }

  await mongoose.connect(DATABASE_URL);
  console.log("Connected to MongoDB.");

  // Define unique test identifiers
  const testOrderId = new mongoose.Types.ObjectId().toString();
  const testOrderId2 = new mongoose.Types.ObjectId().toString();
  const testPaymentId = `test_pay_${Date.now()}`;
  const testEmail = "testcustomer@example.com";
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "1w2xGyN3e1/92P45y0ePqWR85qgYFY94";

  let product = null;

  try {
    // 1. Create Test Product
    product = new Product({
      name: "Test Premium Subscription",
      category: "Streaming",
      platform: "Netflix", // Added platform to prevent Prisma cast errors
      price: 15.00,
      loginUrl: "https://example.com/login",
      active: true,
      lowStockThreshold: 2,
    });
    await product.save();
    console.log(`[Test Setup] Created Test Product: ${product.name} (ID: ${product._id})`);

    // Create Test Accounts
    const account1 = new Account({
      productId: product._id,
      username: "testuser001",
      password: "securepassword001",
      status: "AVAILABLE",
    });
    const account2 = new Account({
      productId: product._id,
      username: "testuser002",
      password: "securepassword002",
      status: "AVAILABLE",
    });
    await account1.save();
    await account2.save();
    console.log("[Test Setup] Created 2 Test Accounts (AVAILABLE).");

    // Create initial pending order
    const initialOrder = new Order({
      _id: testOrderId,
      orderId: testOrderId,
      paymentId: testPaymentId,
      productId: product._id,
      customerEmail: testEmail,
      status: "PENDING",
      state: "pending",
      pricePaid: 15.00,
      payCurrency: "USDTBSC",
      productSnapshot: {
        name: product.name,
        price: product.price,
        loginUrl: product.loginUrl,
      },
    });
    await initialOrder.save();
    console.log(`[Test Setup] Created initial pending Order ID: ${testOrderId}`);

    // Base Webhook Payload
    const basePayload = {
      payment_id: testPaymentId,
      invoice_id: testPaymentId,
      order_id: testOrderId,
      payment_status: "finished",
      price_amount: 15.00,
      pay_currency: "USDTBSC",
    };

    // --- TEST 1: Reject Invalid Signature ---
    console.log("\n--- TEST 1: Verifying Invalid Signature Rejection ---");
    const badSigResult = await handlePaymentWebhook({
      rawBody: JSON.stringify(basePayload),
      signature: "invalidsignaturehash",
    });
    console.log(`Result Status: ${badSigResult.status}`);
    if (badSigResult.status === 401) {
      console.log("✅ Passed: Invalid signature was rejected with 401.");
    } else {
      console.error("❌ Failed: Webhook accepted invalid signature.");
    }

    // --- TEST 2: Valid Webhook Signature Processing & Onboarding ---
    console.log("\n--- TEST 2: Processing Valid Payment Webhook ---");
    const validSignature = signPayload(basePayload, ipnSecret);
    const goodSigResult = await handlePaymentWebhook({
      rawBody: JSON.stringify(basePayload),
      signature: validSignature,
    });
    console.log(`Result Status: ${goodSigResult.status}`, goodSigResult.body);
    if (goodSigResult.status === 200 && goodSigResult.body.success) {
      console.log("✅ Passed: Valid webhook signature processed successfully.");
    } else {
      console.error("❌ Failed: Valid webhook signature processing failed.");
    }

    // Verify DB state
    const updatedOrder = await Order.findById(testOrderId);
    console.log(`Updated Order Status: ${updatedOrder.status}, State: ${updatedOrder.state}, Assigned Username: ${updatedOrder.assignedUsername}`);
    if (updatedOrder.status === "PAID" && updatedOrder.state === "ready" && updatedOrder.assignedUsername === "testuser001") {
      console.log("✅ Passed: Order marked PAID and account 'testuser001' assigned.");
    } else {
      console.error("❌ Failed: Order DB states did not transition correctly.");
    }

    const assignedAccount = await Account.findOne({ username: "testuser001" });
    console.log(`Account status for testuser001: ${assignedAccount.status}, SoldTo: ${assignedAccount.soldTo}`);
    if (assignedAccount.status === "SOLD" && assignedAccount.soldTo === testEmail) {
      console.log("✅ Passed: Account marked 'SOLD' and assigned to user email.");
    } else {
      console.error("❌ Failed: Account status did not update to 'SOLD'.");
    }

    // --- TEST 3: Duplicate Webhook Prevention ---
    console.log("\n--- TEST 3: Verifying Duplicate Webhook Prevention ---");
    const duplicateResult = await handlePaymentWebhook({
      rawBody: JSON.stringify(basePayload),
      signature: validSignature,
    });
    console.log(`Duplicate Result Status: ${duplicateResult.status}, Message:`, duplicateResult.body?.message);
    if (duplicateResult.status === 200 && duplicateResult.body.message === "Duplicate payload skipped") {
      console.log("✅ Passed: Duplicate webhook processing was prevented.");
    } else {
      console.error("❌ Failed: Duplicate webhook did not return expected duplicate skip status.");
    }

    // --- TEST 4: Email Queue Worker processing ---
    console.log("\n--- TEST 4: Processing Email Queue Worker ---");
    const queuedEmail = await EmailQueue.findOne({ orderId: testOrderId });
    console.log(`Found queued email: To=${queuedEmail.customerEmail}, Status=${queuedEmail.status}`);
    
    const workerResult = await processEmailQueue();
    console.log("Worker Result:", workerResult);

    const finalOrder = await Order.findById(testOrderId);
    console.log(`Final Order EmailSent: ${finalOrder.emailSent}, EmailSentAt: ${finalOrder.emailSentAt}`);
    const processedEmail = await EmailQueue.findOne({ orderId: testOrderId });
    console.log(`Email Queue Status after worker: ${processedEmail.status}`);
    if (processedEmail.status === "sent" || processedEmail.status === "failed") {
      console.log("✅ Passed: Email queue worker attempted sending the email job.");
    } else {
      console.error("❌ Failed: Email queue job remains unattempted.");
    }

    // --- TEST 5: Inventory Exhaustion ---
    console.log("\n--- TEST 5: Simulating Inventory Exhaustion ---");
    await Account.findOneAndUpdate({ username: "testuser002" }, { $set: { status: "SOLD" } });

    // Create another order to trigger stock out
    const testPaymentId2 = `test_pay_out_${Date.now()}`;
    const outOrder = new Order({
      _id: testOrderId2,
      orderId: testOrderId2,
      paymentId: testPaymentId2,
      productId: product._id,
      customerEmail: testEmail,
      status: "PENDING",
      state: "pending",
      pricePaid: 15.00,
      payCurrency: "USDTBSC",
      productSnapshot: {
        name: product.name,
        price: product.price,
        loginUrl: product.loginUrl,
      },
    });
    await outOrder.save();

    const outPayload = {
      payment_id: testPaymentId2,
      invoice_id: testPaymentId2,
      order_id: testOrderId2,
      payment_status: "finished",
      price_amount: 15.00,
      pay_currency: "USDTBSC",
    };
    const outSignature = signPayload(outPayload, ipnSecret);
    const outResult = await handlePaymentWebhook({
      rawBody: JSON.stringify(outPayload),
      signature: outSignature,
    });

    console.log(`Exhaustion Webhook Result Status: ${outResult.status}`, outResult.body);
    const checkedOutOrder = await Order.findById(testOrderId2);
    console.log(`Exhausted Order Status: ${checkedOutOrder.status}, State: ${checkedOutOrder.state}`);
    if (checkedOutOrder.status === "PENDING" && checkedOutOrder.state === "failed") {
      console.log("✅ Passed: Order updated to status=PENDING and state=failed due to empty stock.");
    } else {
      console.error("❌ Failed: Stock out order state transitions failed.");
    }

  } finally {
    // --- CLEANUP ---
    console.log("\nCleaning up test database records...");
    if (product) {
      await Product.deleteOne({ _id: product._id });
      await Account.deleteMany({ productId: product._id });
    }
    await Order.deleteMany({ _id: { $in: [testOrderId, testOrderId2] } });
    await WebhookLog.deleteMany({ orderId: { $in: [testOrderId, testOrderId2] } });
    await EmailQueue.deleteMany({ orderId: { $in: [testOrderId, testOrderId2] } });
    console.log("Cleanup complete.");

    await mongoose.disconnect();
    console.log("Disconnected from database.");
    console.log("\n-----------------------------------------");
    console.log("Tests Completed Successfully!");
    console.log("-----------------------------------------");
  }
}

runTests().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  mongoose.disconnect();
});

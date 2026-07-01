import { dbConnect } from "../lib/mongoose";
import Product from "../models/Product";
import Account from "../models/Account";
import Order from "../models/Order";
import EmailQueue from "../models/EmailQueue";
import { getCredentialsEmailHtml, sendAdminLowStockNotification } from "./emailService";

/**
 * Handles completed payment onboarding workflow.
 */
export async function processSuccessfulPayment({
  paymentId,
  orderId,
  productId,
  customerEmail,
  pricePaid,
  payCurrency,
}) {
  await dbConnect();

  console.log(`[PaymentService] Processing payment ${paymentId} for Order ${orderId}`);

  // 1. Check for already processed orders
  const existingOrder = await Order.findById(orderId);
  if (existingOrder && existingOrder.processed) {
    console.log(`[PaymentService] Order ${orderId} has already been processed. Skipping user/account allocation.`);
    return { success: true, alreadyProcessed: true, order: existingOrder };
  }

  // 2. Fetch the product details to store snapshot
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  // 3. Create or update Order in database starting with PENDING state (source of truth)
  let order = await Order.findById(orderId);
  if (!order) {
    order = new Order({
      paymentId,
      orderId,
      productId,
      customerEmail,
      status: "PENDING",
      state: "pending",
      pricePaid,
      payCurrency,
      productSnapshot: {
        name: product.name,
        price: product.price,
        loginUrl: product.loginUrl,
      },
    });
    await order.save();
  } else {
    order.paymentId = paymentId;
    order.pricePaid = pricePaid;
    order.payCurrency = payCurrency;
    order.status = "PENDING";
    order.state = "pending";
    order.productSnapshot = {
      name: product.name,
      price: product.price,
      loginUrl: product.loginUrl,
    };
    await order.save();
  }

  // 4. Atomically find one available account and transition status to 'sold'
  // Also checks if there's any reserved account whose reservation expired (query-level protection)
  const now = new Date();
  
  // First attempt atomic lease matching status === 'available'
  let account = await Account.findOneAndUpdate(
    {
      productId,
      $or: [
        { status: "AVAILABLE" },
        { status: "RESERVED", reservationExpiresAt: { $lt: now } }
      ]
    },
    {
      $set: {
        status: "SOLD",
        soldTo: customerEmail,
        soldAt: now,
        orderId,
      },
    },
    { returnDocument: "after" }
  );

  // If no account found, handle inventory exhaustion
  if (!account) {
    console.error(`[PaymentService] INVENTORY EXHAUSTED for product ${product.name} (ID: ${productId})`);
    
    order.status = "PENDING";
    order.state = "failed";
    await order.save();

    // Trigger admin alert email
    const adminEmail = process.env.ADMIN_EMAIL || "admin@agedaccount.store";
    try {
      await sendAdminLowStockNotification(adminEmail, {
        productName: product.name,
        availableCount: 0,
      });
    } catch (err) {
      console.error("[PaymentService] Failed to send admin low stock email notification:", err);
    }

    return {
      success: false,
      error: "INVENTORY_EXHAUSTED",
      message: "No accounts available in inventory.",
    };
  }

  // 5. Queue Email delivery
  const loginUrl = product.loginUrl || "https://agedaccount.store/login";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@agedaccount.store";
  const emailHtml = getCredentialsEmailHtml({
    customerName: customerEmail.split("@")[0],
    productName: product.name,
    username: account.username,
    password: account.password,
    loginUrl,
    supportEmail,
  });

  const emailQueueItem = new EmailQueue({
    orderId,
    customerEmail,
    subject: `Your Account Credentials for ${product.name}`,
    html: emailHtml,
    status: "pending",
  });
  await emailQueueItem.save();

  // 6. Complete Order details and mark order READY
  order.status = "PAID";
  order.state = "ready";
  order.processed = true;
  order.assignedAccountId = account._id;
  order.assignedUsername = account.username;
  await order.save();

  console.log(`[PaymentService] Successfully assigned account ${account.username} to Order ${orderId}`);

  // 7. Check low stock threshold
  const availableCount = await Account.countDocuments({
    productId,
    status: "AVAILABLE",
  });

  if (availableCount <= product.lowStockThreshold) {
    console.warn(`[PaymentService] LOW STOCK WARNING: Product ${product.name} has only ${availableCount} accounts left.`);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@agedaccount.store";
    try {
      await sendAdminLowStockNotification(adminEmail, {
        productName: product.name,
        availableCount,
      });
    } catch (err) {
      console.error("[PaymentService] Failed to send low stock notification to admin:", err);
    }
  }

  return {
    success: true,
    order,
    account,
  };
}

/**
 * Cleanup job: Find reserved accounts older than 1 hour and release them back to 'available'.
 */
export async function releaseStaleReservations() {
  await dbConnect();
  const now = new Date();

  console.log("[PaymentService] Checking for stale reservations...");

  const staleAccounts = await Account.find({
    status: "RESERVED",
    reservationExpiresAt: { $lt: now },
  });

  if (staleAccounts.length === 0) {
    return { releasedCount: 0 };
  }

  let releasedCount = 0;
  for (const account of staleAccounts) {
    // Verify if order is actually processed or paid
    const correspondingOrder = await Order.findById(account.orderId);
    if (!correspondingOrder || correspondingOrder.status !== "PAID") {
      account.status = "AVAILABLE";
      account.soldTo = undefined;
      account.soldAt = undefined;
      account.reservedAt = undefined;
      account.reservationExpiresAt = undefined;
      account.orderId = undefined;
      await account.save();
      
      console.log(`[PaymentService] Released stale reservation for account: ${account.username}`);
      releasedCount++;
    }
  }

  return { releasedCount };
}

import nodemailer from "nodemailer";
import EmailQueue from "../models/EmailQueue";
import Order from "../models/Order";
import { dbConnect } from "../lib/mongoose";

// Setup transport using environment variables
const createTransport = () => {
  const host = process.env.EMAIL_HOST || "smtp.titan.email";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn("[EmailService] SMTP credentials are not fully configured in environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
  });
};

const transporter = createTransport();

/**
 * Returns a beautiful, modern, mobile-friendly responsive SaaS-style HTML template.
 */
export function getCredentialsEmailHtml({ customerName, productName, username, password, loginUrl, supportEmail }) {
  const support = supportEmail || "support@agedaccount.store";
  const displayLoginUrl = loginUrl || "https://agedaccount.store/login";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Account Credentials</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #f3f4f6;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #0b0f19;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #111827;
          border-radius: 12px;
          border: 1px solid #1f2937;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 30px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #d1d5db;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .credentials-box {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .credentials-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #374151;
        }
        .credentials-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #9ca3af;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .value {
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          color: #10b981;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin-top: 30px;
        }
        .btn {
          display: inline-block;
          background-color: #3b82f6;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
          transition: background-color 0.2s ease;
        }
        .btn:hover {
          background-color: #2563eb;
        }
        .footer {
          background-color: #030712;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #1f2937;
        }
        .footer p {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
          .credentials-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .value {
            margin-top: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>FastAccounts Store</h1>
          </div>
          <div class="content">
            <p>Hello ${customerName || "Customer"},</p>
            <p>Thank you for your purchase! Your payment has been successfully processed and confirmed. Here are the credentials for your pre-created account:</p>
            
            <div class="credentials-box">
              <div class="credentials-row">
                <span class="label">Product</span>
                <span class="value" style="font-family: inherit; color: #f3f4f6;">${productName}</span>
              </div>
              <div class="credentials-row">
                <span class="label">Username</span>
                <span class="value">${username}</span>
              </div>
              <div class="credentials-row">
                <span class="label">Password</span>
                <span class="value">${password}</span>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; font-style: italic;">
              Important: We recommend logging in and changing the password immediately to ensure your account remains secure.
            </p>
            
            <div class="btn-container">
              <a href="${displayLoginUrl}" class="btn" target="_blank">Login to Account</a>
            </div>
          </div>
          <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:${support}">${support}</a>.</p>
            <p style="margin-top: 10px;">&copy; 2026 FastAccounts. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Returns HTML template for low stock notifications sent to administrator.
 */
export function getLowStockEmailHtml({ productName, availableCount }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Low Stock Alert</title>
      <style>
        body { font-family: sans-serif; background-color: #f4f4f5; color: #27272a; padding: 20px; }
        .card { max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e4e4e7; }
        h2 { color: #dc2626; margin-top: 0; }
        .details { margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626; }
        p { line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>⚠️ Inventory Alert: Low Stock</h2>
        <p>This is an automated notification to inform you that stock is running low for the following product:</p>
        <div class="details">
          <strong>Product:</strong> ${productName}<br/>
          <strong>Available Inventory:</strong> ${availableCount} account(s) left
        </div>
        <p>Please upload new account credentials to the inventory database as soon as possible to prevent order disruption.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends credentials email.
 */
export async function sendCredentialsEmail(email, { customerName, productName, username, password, loginUrl, supportEmail }) {
  const fromEmail = process.env.DELIVERY_FROM_EMAIL || `"FastAccounts Orders" <orders@yourdomain.com>`;
  const html = getCredentialsEmailHtml({ customerName, productName, username, password, loginUrl, supportEmail });

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: `Your Account Credentials for ${productName}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EmailService] Credentials email sent: ${info.messageId}`);
  return info;
}

/**
 * Sends admin low stock notification.
 */
export async function sendAdminLowStockNotification(adminEmail, { productName, availableCount }) {
  const fromEmail = process.env.DELIVERY_FROM_EMAIL || `"FastAccounts System" <system@yourdomain.com>`;
  const html = getLowStockEmailHtml({ productName, availableCount });

  const mailOptions = {
    from: fromEmail,
    to: adminEmail,
    subject: `⚠️ Low Stock Alert: ${productName}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EmailService] Admin low stock notification sent: ${info.messageId}`);
  return info;
}

/**
 * Background Queue Worker: polls EmailQueue, sends emails, updates emailSent on Order.
 */
export async function processEmailQueue() {
  await dbConnect();

  // Find emails that are pending/failed and not currently locked (processing)
  // Or locked but processing has timed out (older than 10 minutes)
  const timeoutLimit = new Date(Date.now() - 10 * 60 * 1000);
  const emails = await EmailQueue.find({
    status: { $in: ["pending", "failed"] },
    $or: [
      { processing: false },
      { processing: true, processingAt: { $lt: timeoutLimit } },
    ],
  }).limit(10); // Process in batches of 10

  if (emails.length === 0) {
    return { processedCount: 0 };
  }

  console.log(`[EmailWorker] Found ${emails.length} email(s) to process.`);
  let successCount = 0;

  for (const emailJob of emails) {
    // 1. Lock the email job atomically
    const lockedJob = await EmailQueue.findOneAndUpdate(
      {
        _id: emailJob._id,
        $or: [
          { processing: false },
          { processing: true, processingAt: emailJob.processingAt },
        ],
      },
      {
        $set: {
          processing: true,
          processingAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!lockedJob) {
      // Already picked up by another worker thread
      continue;
    }

    try {
      // 2. Increment attempts count
      lockedJob.attempts += 1;

      // 3. Send email via transport directly
      const fromEmail = process.env.DELIVERY_FROM_EMAIL || `"FastAccounts Orders" <orders@yourdomain.com>`;
      await transporter.sendMail({
        from: fromEmail,
        to: lockedJob.customerEmail,
        subject: lockedJob.subject,
        html: lockedJob.html,
      });

      // 4. On success, update EmailQueue and Order (Decoupled update: email system only updates emailSent/emailSentAt)
      lockedJob.status = "sent";
      lockedJob.processing = false;
      lockedJob.lastError = null;
      await lockedJob.save();

      await Order.findOneAndUpdate(
        { orderId: lockedJob.orderId },
        {
          $set: {
            emailSent: true,
            emailSentAt: new Date(),
          },
        }
      );

      console.log(`[EmailWorker] Successfully processed email for order: ${lockedJob.orderId}`);
      successCount++;
    } catch (error) {
      console.error(`[EmailWorker] Error processing email for order ${lockedJob.orderId}:`, error);

      lockedJob.status = "failed";
      lockedJob.processing = false;
      lockedJob.lastError = error.message || String(error);
      await lockedJob.save();
    }
  }

  return {
    foundCount: emails.length,
    successCount,
  };
}

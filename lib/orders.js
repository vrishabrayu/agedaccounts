import { prisma } from "./prisma";

export function buildOrderDescription(items) {
  return items
    .map((item) => {
      const label = item.niche || item.name || item.platform || "Product";
      return `${label} x${item.quantity} ($${item.price * item.quantity})`;
    })
    .join("; ");
}

export function calculateCartTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export async function createPendingOrder({ email, items, totalAmount }) {
  const primaryItem = items[0];
  if (!primaryItem?.id) {
    throw new Error("At least one valid cart item is required.");
  }

  const totalCents = Math.round(totalAmount * 100);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return prisma.order.create({
    data: {
      customerEmail: email,
      productId: primaryItem.id,
      quantity,
      totalCents,
      status: "PENDING",
      paymentProvider: "nowpayments",
      orderDescription: buildOrderDescription(items),
    },
  });
}

export async function attachPaymentToOrder(orderId, { paymentId, invoiceUrl }) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentId: paymentId || undefined,
      checkoutSession: invoiceUrl,
    },
  });
}

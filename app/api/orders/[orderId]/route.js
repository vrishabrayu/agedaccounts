import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const orderId = String(params.orderId || "").trim();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        totalCents: true,
        customerEmail: true,
        orderDescription: true,
        paymentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        ...order,
        amount: order.totalCents / 100,
      },
    });
  } catch (error) {
    console.error("[orders/status]", error);
    return NextResponse.json({ error: "Could not load order status." }, { status: 500 });
  }
}

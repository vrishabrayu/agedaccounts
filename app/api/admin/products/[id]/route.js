import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { verifyAdminRequest } from "../../../../../lib/adminAuth";

export async function PATCH(request, { params }) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  }

  try {
    // Cascade delete orders associated with this product
    await prisma.order.deleteMany({
      where: { productId: id },
    });

    // Cascade delete credentials associated with this product
    await prisma.credential.deleteMany({
      where: { productId: id },
    });

    // Delete the product itself
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product and associated credentials deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyAdminRequest } from "../../../../lib/adminAuth";

export async function GET(request) {
  const auth = verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const productsWithStock = await Promise.all(
    products.map(async (product) => {
      const availableStock = await prisma.credential.count({
        where: { productId: product.id, status: "AVAILABLE" },
      });
      return { ...product, availableStock };
    })
  );

  return NextResponse.json({ products: productsWithStock });
}

export async function POST(request) {
  const body = await request.json();
  const auth = verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const name = String(body.name || "").trim();
  const platform = String(body.platform || "").trim();
  const price = Number(body.price || 0);

  if (!name || !platform || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Product name, platform, and positive price are required." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      platform,
      niche: String(body.niche || "").trim() || null,
      followers: String(body.followers || "").trim() || null,
      engagement: String(body.engagement || "").trim() || null,
      description: String(body.description || "").trim() || null,
      priceCents: Math.round(price * 100),
      imageUrl: String(body.imageUrl || "").trim() || null,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyAdminRequest } from "../../../../lib/adminAuth";

function parseCredentialLines(text) {
  const valid = [];
  const invalid = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0 || separatorIndex === line.length - 1) {
      invalid.push({ line: index + 1, value: rawLine });
      return;
    }

    const username = line.slice(0, separatorIndex).trim();
    const password = line.slice(separatorIndex + 1).trim();

    if (!username || !password) {
      invalid.push({ line: index + 1, value: rawLine });
      return;
    }

    valid.push({ username, password });
  });

  return { valid, invalid };
}

export async function POST(request) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const file = formData.get("stockFile");
  if (!file || typeof file.text !== "function") {
    return NextResponse.json({ error: "A .txt stock file is required." }, { status: 400 });
  }

  const text = await file.text();
  const { valid, invalid } = parseCredentialLines(text);

  if (valid.length === 0) {
    return NextResponse.json(
      { error: "No valid username:password lines were found.", invalid },
      { status: 400 }
    );
  }

  let productId = String(formData.get("productId") || "").trim();

  if (!productId) {
    const name = String(formData.get("name") || "").trim();
    const platform = String(formData.get("platform") || "").trim();
    const price = Number(formData.get("price") || 0);

    if (!name || !platform || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Select a product or provide product name, platform, and positive price." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        platform,
        niche: String(formData.get("niche") || "").trim() || null,
        followers: String(formData.get("followers") || "").trim() || null,
        engagement: String(formData.get("engagement") || "").trim() || null,
        description: String(formData.get("description") || "").trim() || null,
        priceCents: Math.round(price * 100),
        imageUrl: String(formData.get("imageUrl") || "").trim() || null,
      },
    });

    productId = product.id;
  } else {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Selected product was not found." }, { status: 404 });
    }
  }

  await prisma.credential.createMany({
    data: valid.map((credential) => ({
      productId,
      username: credential.username,
      password: credential.password,
      status: "AVAILABLE",
    })),
  });

  const availableStock = await prisma.credential.count({
    where: { productId, status: "AVAILABLE" },
  });

  return NextResponse.json({
    productId,
    added: valid.length,
    invalidCount: invalid.length,
    invalid,
    availableStock,
  });
}

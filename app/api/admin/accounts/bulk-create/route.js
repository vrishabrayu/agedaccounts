import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongoose";
import Account from "../../../../../models/Account";
import Product from "../../../../../models/Product";
import { verifyAdminRequest } from "../../../../../lib/adminAuth";

export async function POST(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const body = await request.json();
    const productId = String(body.productId || "").trim();
    const accounts = Array.isArray(body.accounts) ? body.accounts : [];

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    if (accounts.length === 0) {
      return NextResponse.json({ error: "No accounts provided for creation." }, { status: 400 });
    }

    await dbConnect();

    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json({ error: "Selected product was not found." }, { status: 404 });
    }

    // Format account documents
    const accountDocs = accounts
      .map((acc) => {
        const username = String(acc.username || "").trim();
        const password = String(acc.password || "").trim();
        if (!username || !password) return null;
        return {
          productId,
          username,
          password,
          status: "AVAILABLE",
        };
      })
      .filter(Boolean);

    if (accountDocs.length === 0) {
      return NextResponse.json({ error: "No valid credentials found (username:password)." }, { status: 400 });
    }

    // Bulk insert into collection
    const result = await Account.insertMany(accountDocs);

    return NextResponse.json({
      success: true,
      count: result.length,
      productId,
    });
  } catch (error) {
    console.error("[api/admin/accounts/bulk-create] Error bulk-creating accounts:", error);
    return NextResponse.json({ error: "Internal bulk creation error." }, { status: 500 });
  }
}

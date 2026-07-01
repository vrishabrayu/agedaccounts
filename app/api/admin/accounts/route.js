import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongoose";
import Account from "../../../../models/Account";
import { verifyAdminRequest } from "../../../../lib/adminAuth";

export async function GET(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await dbConnect();

    // Fetch accounts matching product, excluding passwords for safety if preferred,
    // but admin page needs to display them so we return username, password, status, and createdAt.
    const accounts = await Account.find({ productId })
      .sort({ createdAt: -1 })
      .select("username password status createdAt");

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("[api/admin/accounts] Error listing accounts:", error);
    return NextResponse.json({ error: "Internal accounts listing error." }, { status: 500 });
  }
}

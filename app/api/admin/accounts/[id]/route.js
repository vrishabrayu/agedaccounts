import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongoose";
import Account from "../../../../../models/Account";
import { verifyAdminRequest } from "../../../../../lib/adminAuth";

export async function DELETE(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Account ID is required." }, { status: 400 });
    }

    await dbConnect();

    // Find the account
    const account = await Account.findById(id);
    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    // Block deleting sold accounts
    if (account.status === "SOLD") {
      return NextResponse.json(
        { error: "Cannot delete a sold account. Access details must be retained for user delivery history." },
        { status: 400 }
      );
    }

    // Soft delete by setting status to DISABLED
    account.status = "DISABLED";
    await account.save();

    console.log(`[AdminDelete] Soft deleted account: ID=${id}, Username=${account.username}`);

    return NextResponse.json({ success: true, status: "DISABLED" });
  } catch (error) {
    console.error("[api/admin/accounts/delete] Error during deletion:", error);
    return NextResponse.json({ error: "Internal deletion error." }, { status: 500 });
  }
}

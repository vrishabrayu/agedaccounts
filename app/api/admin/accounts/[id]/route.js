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

    // Find and delete the account permanently from the database
    const deletedAccount = await Account.findByIdAndDelete(id);
    if (!deletedAccount) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    console.log(`[AdminDelete] Hard deleted account: ID=${id}, Username=${deletedAccount.username}`);

    return NextResponse.json({ success: true, message: "Account deleted successfully from database." });
  } catch (error) {
    console.error("[api/admin/accounts/delete] Error during deletion:", error);
    return NextResponse.json({ error: "Internal deletion error." }, { status: 500 });
  }
}

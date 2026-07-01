import { NextResponse } from "next/server";
import { generateSessionToken } from "../../../../lib/adminAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = String(body.password || "").trim();
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured in environment variables." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const token = generateSessionToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("[api/admin/verify] Error verifying password:", error);
    return NextResponse.json({ error: "Internal verification error" }, { status: 500 });
  }
}

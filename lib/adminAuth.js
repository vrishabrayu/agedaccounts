import crypto from "crypto";

/**
 * Generates a cryptographically signed token valid for 24 hours.
 */
export function generateSessionToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD is not configured in .env.");
  }
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const signature = crypto
    .createHmac("sha256", secret)
    .update(expiresAt.toString())
    .digest("hex");
  
  const tokenData = { expiresAt, signature };
  return Buffer.from(JSON.stringify(tokenData)).toString("base64");
}

/**
 * Validates a signed session token.
 */
export function verifySessionToken(token) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return { ok: false, status: 500, message: "ADMIN_PASSWORD is not configured in .env." };
  }
  if (!token) {
    return { ok: false, status: 401, message: "No session token provided." };
  }
  try {
    const jsonStr = Buffer.from(token, "base64").toString("utf8");
    const parsed = JSON.parse(jsonStr);

    if (!parsed.expiresAt || !parsed.signature) {
      return { ok: false, status: 401, message: "Invalid session token structure." };
    }

    if (Number(parsed.expiresAt) < Date.now()) {
      return { ok: false, status: 401, message: "Session token has expired." };
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(parsed.expiresAt.toString())
      .digest("hex");

    if (parsed.signature !== expectedSignature) {
      return { ok: false, status: 401, message: "Invalid session token signature." };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, status: 401, message: "Authentication failed. Invalid token." };
  }
}

/**
 * Authenticates admin requests via Bearer token, x-admin-token header, or legacy admin-password fallback.
 */
export function verifyAdminRequest(request, formData) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return {
      ok: false,
      status: 500,
      message: "ADMIN_PASSWORD is not configured in .env.",
    };
  }

  // 1. Try checking for Authorization header / custom x-admin-token
  const authHeader = 
    request.headers.get("x-admin-token") || 
    request.headers.get("Authorization")?.replace("Bearer ", "") || "";
  
  if (authHeader) {
    const verified = verifySessionToken(authHeader);
    if (verified.ok) return { ok: true };
  }

  // 2. Fallback to legacy password authentication for existing dashboard functions
  const suppliedPassword =
    request.headers.get("x-admin-password") || formData?.get("adminPassword") || "";

  if (suppliedPassword && suppliedPassword === expectedPassword) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 401,
    message: "Unauthorized admin access.",
  };
}

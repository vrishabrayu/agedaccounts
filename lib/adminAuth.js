export function verifyAdminRequest(request, formData) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return {
      ok: false,
      status: 500,
      message: "ADMIN_PASSWORD is not configured in .env.",
    };
  }

  const suppliedPassword =
    request.headers.get("x-admin-password") || formData?.get("adminPassword") || "";

  if (suppliedPassword !== expectedPassword) {
    return {
      ok: false,
      status: 401,
      message: "Invalid admin password.",
    };
  }

  return { ok: true };
}

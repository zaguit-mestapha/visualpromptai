const ALLOWED_ORIGINS = [
  "https://visualpromptai.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Allow requests with no origin (server-to-server, same-origin navigations)
  if (!origin && !referer) return true;

  if (origin) {
    return ALLOWED_ORIGINS.some((allowed) => origin === allowed);
  }

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return ALLOWED_ORIGINS.some((allowed) => refOrigin === allowed);
    } catch {
      return false;
    }
  }

  return false;
}

export function csrfCheck(request: Request): { valid: boolean; error?: string } {
  if (request.method === "GET" || request.method === "HEAD") {
    return { valid: true };
  }

  if (!validateOrigin(request)) {
    return { valid: false, error: "Invalid request origin" };
  }

  return { valid: true };
}

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "./rate-limit";
import { csrfCheck } from "./csrf";

const MAX_BODY_SIZE = 1_048_576; // 1MB

/**
 * Standard error response — never leaks internal details.
 */
export function errorResponse(
  message: string,
  status: number,
  internalError?: unknown
): NextResponse {
  if (internalError) {
    console.error(`[API Error ${status}]`, internalError);
  }
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validate Content-Type header for POST/PUT/PATCH requests.
 * Skips validation for Stripe webhooks (which send application/json but we read as text).
 */
export function validateContentType(
  request: NextRequest,
  expected = "application/json"
): string | null {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes(expected)) {
    return `Content-Type must be ${expected}`;
  }
  return null;
}

/**
 * Check request body size.
 */
export function validateBodySize(request: NextRequest): string | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return "Request body too large (max 1MB)";
  }
  return null;
}

/**
 * Common guards for API routes: rate limit, CSRF, content-type, body size.
 * Returns an error response if any check fails, or null if all pass.
 */
export function apiGuard(
  request: NextRequest,
  rateLimitKey: keyof typeof RATE_LIMITS = "api"
): NextResponse | null {
  // Rate limiting
  const ip = getClientIp(request);
  const limit = checkRateLimit(
    `${rateLimitKey}:${ip}`,
    RATE_LIMITS[rateLimitKey]
  );
  if (!limit.allowed) {
    const res = errorResponse("Too many requests. Please try again later.", 429);
    res.headers.set("Retry-After", String(Math.ceil((limit.resetAt - Date.now()) / 1000)));
    return res;
  }

  // CSRF origin check
  const csrf = csrfCheck(request);
  if (!csrf.valid) {
    return errorResponse(csrf.error || "Forbidden", 403);
  }

  // Content-Type validation for POST
  if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
    const ctError = validateContentType(request);
    if (ctError) {
      return errorResponse(ctError, 415);
    }
  }

  // Body size check
  const sizeError = validateBodySize(request);
  if (sizeError) {
    return errorResponse(sizeError, 413);
  }

  return null;
}

/**
 * Webhook guard — skips content-type check and CSRF (uses signature verification instead).
 */
export function webhookGuard(
  request: NextRequest,
  rateLimitKey: keyof typeof RATE_LIMITS = "stripe"
): NextResponse | null {
  const ip = getClientIp(request);
  const limit = checkRateLimit(
    `${rateLimitKey}:${ip}`,
    RATE_LIMITS[rateLimitKey]
  );
  if (!limit.allowed) {
    const res = errorResponse("Too many requests.", 429);
    res.headers.set("Retry-After", String(Math.ceil((limit.resetAt - Date.now()) / 1000)));
    return res;
  }

  const sizeError = validateBodySize(request);
  if (sizeError) {
    return errorResponse(sizeError, 413);
  }

  return null;
}

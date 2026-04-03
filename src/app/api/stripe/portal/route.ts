import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { apiGuard, errorResponse } from "@/lib/api-utils";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const guard = apiGuard(request, "stripe");
  if (guard) return guard;

  try {
    if (!stripe) {
      return errorResponse("Payment service is not configured", 503);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const customerId = sanitizeString((body as Record<string, unknown>).customerId, 200);
    if (!customerId) {
      return errorResponse("Customer ID is required", 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return errorResponse("Failed to create portal session", 500, err);
  }
}

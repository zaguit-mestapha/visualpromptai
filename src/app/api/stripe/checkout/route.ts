import { NextRequest } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { apiGuard, errorResponse } from "@/lib/api-utils";
import { sanitizeString, validateEnum, isValidEmail } from "@/lib/sanitize";

const VALID_PLANS = ["pro", "team"] as const;
const VALID_BILLING = ["monthly", "annual"] as const;

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

    const { plan: rawPlan, billing: rawBilling, userId: rawUserId, email: rawEmail } =
      body as Record<string, unknown>;

    const plan = validateEnum(rawPlan, VALID_PLANS);
    if (!plan) {
      return errorResponse("Invalid plan", 400);
    }

    const billing = validateEnum(rawBilling, VALID_BILLING);
    if (!billing) {
      return errorResponse("Invalid billing period", 400);
    }

    const userId = sanitizeString(rawUserId, 200) || "";
    const email = typeof rawEmail === "string" && isValidEmail(rawEmail) ? rawEmail : undefined;

    const planConfig = PLANS[plan];
    const priceId = billing === "annual" ? planConfig.annualPriceId : planConfig.monthlyPriceId;

    if (!priceId) {
      return errorResponse("Stripe pricing not configured", 503);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing`,
      customer_email: email,
      metadata: { userId, plan, billing },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return errorResponse("Failed to create checkout session", 500, err);
  }
}

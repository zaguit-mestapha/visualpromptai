import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { webhookGuard, errorResponse } from "@/lib/api-utils";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  // Webhook uses signature verification instead of CSRF/content-type checks
  const guard = webhookGuard(request);
  if (guard) return guard;

  try {
    if (!stripe) {
      return errorResponse("Payment service is not configured", 503);
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return errorResponse("Missing webhook signature", 400);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return errorResponse("Webhook not configured", 503);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return errorResponse("Invalid webhook signature", 400);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Stripe] Checkout completed:", session.id);
        // TODO: Update user subscription in database
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Stripe] Subscription updated:", subscription.id, subscription.status);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Stripe] Subscription cancelled:", subscription.id);
        break;
      }
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    return errorResponse("Webhook processing failed", 500, err);
  }
}

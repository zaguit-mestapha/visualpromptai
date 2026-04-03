import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    })
  : (null as unknown as Stripe);

export const PLANS = {
  pro: {
    name: "Pro",
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "",
    monthlyPrice: 12,
    annualPrice: 115,
  },
  team: {
    name: "Team",
    monthlyPriceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_TEAM_ANNUAL_PRICE_ID || "",
    monthlyPrice: 29,
    annualPrice: 278,
  },
} as const;

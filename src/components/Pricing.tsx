"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const tiers = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For hobbyists exploring AI art",
    features: [
      "5 prompts per day",
      "Visual Composer (basic)",
      "Single model export",
      "Community templates",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For creators who want the full toolkit",
    features: [
      "Unlimited prompts",
      "Visual Composer (full)",
      "Prompt Scoring & A/B Testing",
      "Multi-model export",
      "3 Brand Kits",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    key: "team",
    name: "Team",
    price: "$29",
    period: "/mo per seat",
    description: "For agencies and creative teams",
    features: [
      "Everything in Pro",
      "Unlimited Brand Kits",
      "Team workspace & sharing",
      "Prompt Marketplace access",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = (tierKey: string) => {
    if (tierKey === "free") {
      router.push("/signup");
    } else if (tierKey === "pro") {
      if (!user) {
        router.push("/login?redirect=pricing");
      } else {
        alert("Stripe payment coming soon! For now, enjoy all features for free during beta.");
      }
    } else if (tierKey === "team") {
      window.location.href = "mailto:contact@visualpromptai.com";
    }
  };

  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="section-divider mx-auto max-w-4xl mb-20" />
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/3 dark:bg-primary/5 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
            Start free and upgrade as your creative workflow grows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                tier.highlighted
                  ? "bg-surface card-shadow md:scale-[1.02] border-2 border-primary/40 dark:border-primary/50 shadow-lg shadow-primary/10"
                  : "bg-surface card-shadow border border-border dark:border-white/[0.06] hover:scale-[1.02] hover:border-primary/30"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold text-black">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">{tier.price}</span>
                <span className="text-sm text-muted">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{tier.description}</p>

              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleClick(tier.key)}
                className={`mt-8 w-full cursor-pointer rounded-xl py-3 text-sm font-bold transition-all active:scale-95 ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-primary to-accent text-black shadow-lg shadow-primary/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25"
                    : "border border-border dark:border-white/[0.06] bg-surface text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

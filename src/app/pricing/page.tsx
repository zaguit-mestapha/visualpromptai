"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";

const tiers = [
  {
    key: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "forever",
    description: "For hobbyists exploring AI art",
    features: [
      "10 prompts per day",
      "Basic prompt scoring",
      "1 model export",
      "Community templates",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 115,
    period: "/mo",
    description: "For creators who want the full toolkit",
    features: [
      "Unlimited prompts",
      "Advanced scoring & analytics",
      "All model exports",
      "Prompt A/B Testing",
      "Prompt history & saved prompts",
      "3 Brand Kits",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    key: "team",
    name: "Team",
    monthlyPrice: 29,
    annualPrice: 278,
    period: "/mo per seat",
    description: "For agencies and creative teams",
    features: [
      "Everything in Pro",
      "Unlimited Brand Kits",
      "Team workspace & sharing",
      "Prompt Marketplace access",
      "API access",
      "Dedicated support",
      "Custom model integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = (planKey: string) => {
    if (planKey === "free") {
      router.push("/signup");
    } else if (planKey === "pro") {
      if (!user) {
        router.push("/login?redirect=pricing");
      } else {
        alert("Stripe payment coming soon! For now, enjoy all features for free during beta.");
      }
    } else if (planKey === "team") {
      window.location.href = "mailto:contact@visualpromptai.com";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/composer" className="hidden sm:inline text-sm font-medium text-muted hover:text-foreground transition-colors">
              Composer
            </Link>
            <Link href="/fixer" className="hidden sm:inline text-sm font-medium text-muted hover:text-foreground transition-colors">
              Fixer
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-20 sm:pb-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight font-display sm:text-5xl text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-muted leading-relaxed text-lg">
            Start free and upgrade as your creative workflow grows.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold transition-colors ${!annual ? "text-foreground" : "text-muted"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-7 w-12 rounded-full transition-colors ${annual ? "bg-primary" : "bg-border"}`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                annual ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? "text-foreground" : "text-muted"}`}>
            Annual
          </span>
          {annual && (
            <span className="rounded-md bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
              Save 20%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {tiers.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const displayPrice = annual && tier.annualPrice > 0
              ? `$${Math.round(tier.annualPrice / 12)}`
              : `$${tier.monthlyPrice}`;

            return (
              <div
                key={tier.key}
                className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-background card-shadow md:scale-[1.02] border-2 border-primary/30"
                    : "bg-background card-shadow border border-transparent dark:border-white/[0.06] hover:scale-[1.02]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {displayPrice}
                  </span>
                  <span className="text-sm text-muted">
                    {price === 0
                      ? "forever"
                      : annual
                        ? "/mo billed annually"
                        : tier.period}
                  </span>
                </div>
                {annual && tier.annualPrice > 0 && (
                  <p className="mt-1 text-xs text-accent font-semibold">
                    ${price}/year (save ${tier.monthlyPrice * 12 - tier.annualPrice})
                  </p>
                )}
                <p className="mt-2 text-sm text-muted">{tier.description}</p>

                <ul className="mt-8 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleClick(tier.key)}
                  className={`mt-8 w-full cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-primary to-accent text-black shadow-lg shadow-primary/20 hover:opacity-90"
                      : "border border-border bg-surface text-foreground hover:bg-surface-light"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ hint */}
        <p className="mt-12 text-center text-sm text-muted">
          All plans include a 14-day free trial. Cancel anytime.{" "}
          <Link href="/#features" className="text-primary font-semibold hover:underline">
            See all features
          </Link>
        </p>
      </main>
    </div>
  );
}

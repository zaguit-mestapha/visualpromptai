const tiers = [
  {
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
  return (
    <section id="pricing" className="relative py-24">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Start free and upgrade as your creative workflow grows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                tier.highlighted
                  ? "border-primary/50 bg-surface-light shadow-lg shadow-primary/10 scale-[1.02]"
                  : "border-white/5 bg-surface hover:border-white/10"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className="text-sm text-muted">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{tier.description}</p>

              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
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
                className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all active:scale-95 ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110"
                    : "border border-white/10 bg-surface-light text-foreground hover:border-primary/30 hover:bg-primary/10"
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

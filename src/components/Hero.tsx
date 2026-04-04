import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-32">
      {/* Background glow - subtle in light, more visible in dark */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 dark:bg-primary/20 blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[300px] w-[400px] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Now in early access
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
          The Visual{" "}
          <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
            AI Prompt Builder
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl leading-relaxed">
          Stop guessing. Drag, drop, and optimize prompts for Midjourney,
          DALL-E, Flux, and Stable Diffusion.
        </p>

        {/* CTA buttons */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/fixer"
              className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 active:scale-95 text-center"
            >
              Try Prompt Fixer &mdash; Free
            </Link>
            <Link
              href="/image-to-prompt"
              className="rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95 text-center"
            >
              Image to Prompt &rarr;
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted">
            Free forever &middot; No login required
          </p>
        </div>

        {/* Model logos row */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-muted">
          <span className="opacity-60 w-full sm:w-auto text-center mb-1 sm:mb-0">Works with:</span>
          {["Midjourney", "DALL-E 3", "Stable Diffusion", "Flux"].map((m) => (
            <span key={m} className="rounded-lg border border-border bg-surface px-3 sm:px-4 py-1.5 text-xs font-medium text-foreground/70">
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

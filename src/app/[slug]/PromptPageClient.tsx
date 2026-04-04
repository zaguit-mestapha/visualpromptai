"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface ModelPrompt {
  text: string;
  category: string;
}

interface Props {
  modelName: string;
  slug: string;
  intro: string;
  features: string[];
  prompts: ModelPrompt[];
  categoriesOrder: readonly string[];
  categoriesLabel: Record<string, string>;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-all active:scale-95"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function PromptPageClient({
  modelName,
  slug,
  intro,
  features,
  prompts,
  categoriesOrder,
  categoriesLabel,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPrompts =
    activeCategory === "all"
      ? prompts
      : prompts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Composer</Link>
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Fixer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">A/B Test</Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
        <div className={`border-t border-border dark:border-white/[0.06] bg-background/95 backdrop-blur-xl sm:hidden mobile-menu-enter ${mobileMenuOpen ? "open" : ""}`}>
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Composer</Link>
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Fixer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>A/B Test</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
            {modelName} Prompts
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display sm:text-4xl md:text-5xl text-foreground">
            Best {modelName} Prompts{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              2026
            </span>
          </h1>
          <p className="mt-4 text-muted leading-relaxed text-base sm:text-lg">
            {intro}
          </p>
        </div>

        {/* Model Features */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f} className="rounded-2xl bg-background p-5 card-shadow border border-transparent dark:border-white/[0.06] text-center">
              <svg className="mx-auto h-5 w-5 text-accent mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-sm font-medium text-foreground">{f}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-primary to-accent text-black shadow-md shadow-primary/20"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            All ({prompts.length})
          </button>
          {categoriesOrder.map((cat) => {
            const count = prompts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary to-accent text-black shadow-md shadow-primary/20"
                    : "border border-border bg-surface text-muted hover:text-foreground"
                }`}
              >
                {categoriesLabel[cat]} ({count})
              </button>
            );
          })}
        </div>

        {/* Prompt Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {filteredPrompts.map((prompt, i) => (
            <article
              key={i}
              className="rounded-2xl bg-background p-5 sm:p-6 card-shadow card-shadow-hover border border-transparent dark:border-white/[0.06] transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {categoriesLabel[prompt.category] || prompt.category}
                </span>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  #{i + 1}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
                {prompt.text}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <CopyBtn text={prompt.text} />
                <Link
                  href={`/fixer?prompt=${encodeURIComponent(prompt.text)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all active:scale-95"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  Optimize
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">
            Build Your Own {modelName} Prompts
          </h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto leading-relaxed">
            Use our Visual Composer to build {modelName} prompts from scratch with drag-and-drop blocks for style, lighting, camera angles, and more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/composer"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              Open Visual Composer
            </Link>
            <Link
              href="/fixer"
              className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
            >
              Try Prompt Fixer
            </Link>
          </div>
        </div>

        {/* Cross-links to other model pages */}
        <div className="mt-12 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            Explore More Prompts
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["midjourney-prompts", "stable-diffusion-prompts", "dall-e-prompts", "flux-prompts", "leonardo-ai-prompts"]
              .filter((s) => s !== slug)
              .map((s) => {
                const label = s.replace("-prompts", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <Link
                    key={s}
                    href={`/${s}`}
                    className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-all"
                  >
                    {label} Prompts
                  </Link>
                );
              })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-white/[0.06] bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center">
          <Link href="/" className="text-sm font-bold text-foreground">
            Visual<span className="text-primary">Prompt</span>AI
          </Link>
          <p className="mt-2 text-xs text-muted">
            &copy; {new Date().getFullYear()} VisualPromptAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AuthBanner from "@/components/AuthBanner";
import UserMenu from "@/components/UserMenu";

const MODELS = ["Midjourney", "DALL-E", "Flux", "Stable Diffusion"] as const;

interface FixResult {
  original: string;
  fixed: string;
  originalScore: number;
  fixedScore: number;
  model: string;
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#00C9A7" : score >= 50 ? "#F59E0B" : "#EF4444";
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth="5"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className={`absolute font-bold ${size <= 56 ? "text-sm" : "text-lg"}`} style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-all hover:text-foreground active:scale-95"
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

export default function FixerPage() {
  return (
    <Suspense>
      <FixerPageInner />
    </Suspense>
  );
}

function FixerPageInner() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<(typeof MODELS)[number]>("Midjourney");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const prefill = searchParams.get("prompt");
    if (prefill) setPrompt(prefill);
  }, [searchParams]);

  const handleFix = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fix-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data: FixResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold tracking-[-0.02em]">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Composer
            </Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              A/B Test
            </Link>
            <span className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Fixer
            </span>
            <Link href="/prompt-scoring" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Scoring
            </Link>
            <Link href="/image-to-prompt" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Image to Prompt
            </Link>
            <ThemeToggle />
            <UserMenu />
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
        <div className={`border-t border-border bg-background/95 backdrop-blur-xl sm:hidden mobile-menu-enter ${mobileMenuOpen ? "open" : ""}`}>
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Composer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>A/B Test</Link>
            <span className="text-sm text-accent font-semibold">Fixer (current)</span>
            <Link href="/prompt-scoring" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Scoring</Link>
            <Link href="/image-to-prompt" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Image to Prompt</Link>
          </div>
        </div>
      </nav>
      <AuthBanner />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl text-foreground">
            Prompt{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fixer
            </span>
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Paste your rough prompt, pick a model, and get an optimized version
            instantly.
          </p>
        </div>

        {/* Input section */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-background p-4 sm:p-8 card-shadow border border-transparent dark:border-border">
          <label htmlFor="prompt" className="mb-2 block text-sm font-semibold text-foreground">
            Your prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. a cat sitting on a windowsill at sunset..."
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 sm:max-w-[220px]">
              <label htmlFor="model" className="mb-2 block text-sm font-semibold text-foreground">
                Target model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) =>
                  setModel(e.target.value as (typeof MODELS)[number])
                }
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFix}
              disabled={loading || !prompt.trim()}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Fixing...
                </span>
              ) : (
                "Fix My Prompt"
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="rounded-2xl bg-background p-4 sm:p-6 card-shadow border border-transparent dark:border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Original
                </h2>
                <CopyButton text={result.original} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {result.original}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <ScoreRing score={result.originalScore} size={56} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Quality Score</p>
                  <p className="text-xs text-muted">
                    {result.originalScore < 50
                      ? "Needs improvement"
                      : result.originalScore < 75
                        ? "Decent but could be better"
                        : "Pretty good already"}
                  </p>
                </div>
              </div>
            </div>

            {/* Fixed */}
            <div className="rounded-2xl bg-background p-4 sm:p-6 border-2 border-primary/20 card-shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Optimized for {result.model}
                </h2>
                <CopyButton text={result.fixed} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result.fixed}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <ScoreRing score={result.fixedScore} size={56} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Quality Score</p>
                  <p className="text-xs text-muted">
                    {result.fixedScore >= 75
                      ? "Ready to generate"
                      : "Improved but try tweaking further"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!result && !loading && !error && (
          <div className="mt-16 text-center text-sm text-muted space-y-3">
            <p>
              Try something like:{" "}
              <button
                onClick={() =>
                  setPrompt(
                    "a futuristic city with flying cars and neon lights at night"
                  )
                }
                className="text-primary hover:underline font-medium"
              >
                &quot;a futuristic city with flying cars and neon lights at night&quot;
              </button>
            </p>
            <p>
              Have an image instead?{" "}
              <Link href="/image-to-prompt" className="text-primary hover:underline font-medium">
                Try Image to Prompt &rarr;
              </Link>
            </p>
          </div>
        )}

        {/* Cross-link banners */}
        <div className="mt-12 space-y-3">
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-6 py-4 text-center text-sm text-muted">
            Want to check your prompt&apos;s score first?{" "}
            <Link href="/prompt-scoring" className="text-accent font-semibold hover:underline">
              Try Prompt Scoring &rarr;
            </Link>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 text-center text-sm text-muted">
            Have an image?{" "}
            <Link href="/image-to-prompt" className="text-primary font-semibold hover:underline">
              Try our Image to Prompt Generator
            </Link>{" "}
            — Upload any image and get an optimized prompt.
          </div>
        </div>

        {/* SEO Content: How the AI Prompt Fixer Works */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            How the AI Prompt Fixer Works
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
            <p>
              Our AI prompt fixer analyzes your raw text and transforms it into an optimized AI image prompt
              tailored for your chosen model. Whether you need a quick &ldquo;fix my prompt&rdquo; cleanup or a
              full prompt rewrite, the tool evaluates clarity, specificity, and structure — then rewrites your
              prompt to maximize output quality. Think of it as a prompt optimizer and prompt generator in one.
            </p>
            <p>
              Each AI model interprets prompts differently. A great Midjourney prompt uses weighted parameters
              and stylistic keywords, while DALL-E responds best to natural language descriptions. Our fixer
              automatically adapts syntax, keyword placement, and formatting for whatever platform you choose —
              so you get the best results without memorizing each model&apos;s quirks.
            </p>
          </div>
        </section>

        {/* SEO Content: Supported AI Models */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Supported AI Models
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Midjourney",
                desc: "Optimizes for Midjourney's v6 syntax with weighted parameters (::), aspect ratios, and stylistic keywords that MJ interprets best.",
              },
              {
                name: "DALL-E",
                desc: "Converts prompts to DALL-E 3's preferred natural language style with detailed scene descriptions, lighting cues, and composition guidance.",
              },
              {
                name: "Stable Diffusion",
                desc: "Formats prompts with comma-separated tags, emphasis weighting, and optional negative prompts for SDXL and SD 1.5 checkpoints.",
              },
              {
                name: "Flux",
                desc: "Adapts prompts for Flux's photorealistic strengths — detailed lighting, texture, and scene composition for maximum realism.",
              },
            ].map((m) => (
              <div
                key={m.name}
                className="rounded-xl border border-border bg-background p-5 card-shadow"
              >
                <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Have an image instead of text?{" "}
            <Link href="/image-to-prompt" className="text-primary font-medium hover:underline">
              Try our Image to Prompt Generator &rarr;
            </Link>
          </p>
        </section>
      </main>

      {/* WebApplication Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "VisualPromptAI Prompt Fixer",
            url: "https://visualpromptai.com/fixer",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            description:
              "Free AI prompt fixer and optimizer. Paste any AI image prompt and get an optimized version for Midjourney, DALL-E, Stable Diffusion, or Flux.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Prompt optimization for Midjourney, DALL-E, Stable Diffusion, Flux",
              "AI-powered prompt scoring",
              "Before and after comparison",
              "One-click copy to clipboard",
            ],
          }),
        }}
      />
    </div>
  );
}

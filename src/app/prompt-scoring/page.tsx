"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";

/* ───── Constants ───── */
const MODELS = [
  "Midjourney",
  "DALL-E 3",
  "Stable Diffusion",
  "Flux",
  "Leonardo AI",
  "Grok",
  "General",
] as const;
type Model = (typeof MODELS)[number];

const MAX_CHARS = 2000;

const EXAMPLE_PROMPT =
  "A majestic wolf standing on a snow-covered mountain peak at sunset, dramatic golden hour lighting, volumetric fog in the valley below, photorealistic, shot on Canon EOS R5, 85mm lens, shallow depth of field, cinematic composition";

const CRITERIA = [
  {
    key: "clarity" as const,
    label: "Clarity",
    weight: "20%",
    desc: "How clear and unambiguous is your subject? Vague prompts like \u2018cool thing\u2019 score low.",
  },
  {
    key: "specificity" as const,
    label: "Specificity",
    weight: "25%",
    desc: "Detailed style, lighting, and composition instructions score higher. This is the most weighted criteria.",
  },
  {
    key: "technical" as const,
    label: "Technical",
    weight: "15%",
    desc: "Model-specific parameters like --ar, --v for Midjourney or weight syntax for Stable Diffusion.",
  },
  {
    key: "creativity" as const,
    label: "Creativity",
    weight: "15%",
    desc: "Unique concepts and imaginative combinations score higher than generic descriptions.",
  },
  {
    key: "structure" as const,
    label: "Structure",
    weight: "10%",
    desc: "Proper formatting and organization for your target model.",
  },
  {
    key: "effectiveness" as const,
    label: "Effectiveness",
    weight: "15%",
    desc: "Overall likelihood of producing a high-quality, usable result.",
  },
];

const FAQS = [
  {
    q: "What is AI prompt scoring?",
    a: "AI prompt scoring analyzes your image generation prompt across 6 quality dimensions \u2014 clarity, specificity, technical accuracy, creativity, structure, and effectiveness \u2014 and gives you a weighted overall score plus actionable tips to improve.",
  },
  {
    q: "Is this tool free?",
    a: "Yes, completely free with no login required. You can score as many prompts as you like during the beta period.",
  },
  {
    q: "How is the score calculated?",
    a: "We evaluate 6 criteria with different weights: Specificity (25%), Clarity (20%), Technical (15%), Creativity (15%), Effectiveness (15%), and Structure (10%). The overall score is the weighted average.",
  },
  {
    q: "Which AI models are supported?",
    a: "We support scoring for Midjourney, DALL-E 3, Stable Diffusion, Flux, Leonardo AI, Grok, and a General mode that works across models.",
  },
  {
    q: "How can I improve my score?",
    a: "Follow the actionable tips provided after scoring. Common improvements include adding model-specific parameters, including lighting and composition details, and being more specific about your subject. You can also use our Prompt Fixer to automatically optimize your prompt.",
  },
];

/* ───── Types ───── */
interface ScoreResult {
  overallScore: number;
  scores: {
    clarity: number;
    specificity: number;
    technical: number;
    creativity: number;
    structure: number;
    effectiveness: number;
  };
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

/* ───── Sub-components ───── */
function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color =
    animatedScore >= 71
      ? "#639922"
      : animatedScore >= 41
        ? "#EF9F27"
        : "#E24B4A";
  const center = size / 2;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100 ease-out"
        />
      </svg>
      <span
        className="absolute text-3xl font-bold"
        style={{ color }}
      >
        {animatedScore}
      </span>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  const color =
    score >= 71 ? "bg-[#639922]" : score >= 41 ? "bg-[#EF9F27]" : "bg-[#E24B4A]";
  const textColor =
    score >= 71
      ? "text-[#639922]"
      : score >= 41
        ? "text-[#EF9F27]"
        : "text-[#E24B4A]";

  return (
    <div className="rounded-xl bg-background p-4 card-shadow border border-transparent dark:border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}</span>
      </div>
      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-muted">{weight} weight</p>
    </div>
  );
}

/* ───── Structured Data ───── */
function JsonLd() {
  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VisualPromptAI Prompt Scoring",
    url: "https://visualpromptai.com/prompt-scoring",
    description:
      "Free AI prompt scoring tool. Analyze any AI image prompt across 6 quality dimensions and get actionable improvement tips.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "VisualPromptAI" },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

/* ───── Main Page ───── */
export default function PromptScoringPage() {
  return (
    <Suspense>
      <PromptScoringPageInner />
    </Suspense>
  );
}

function PromptScoringPageInner() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<Model>("Midjourney");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const prefill = searchParams.get("prompt");
    if (prefill) setPrompt(prefill.slice(0, MAX_CHARS));
  }, [searchParams]);

  const handleScore = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/score-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Our AI is busy right now. Please try again in a moment."
        );
      }

      const data: ScoreResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Our AI is busy right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-semibold tracking-[-0.02em]"
          >
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">
              Visual<span className="text-primary">Prompt</span>AI
            </span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link
              href="/composer"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Composer
            </Link>
            <Link
              href="/fixer"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Fixer
            </Link>
            <span className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Scoring
            </span>
            <Link
              href="/image-to-prompt"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Image to Prompt
            </Link>
            <Link
              href="/ab-test"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              A/B Test
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
              <span
                className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
        <div
          className={`border-t border-border bg-background/95 backdrop-blur-xl sm:hidden mobile-menu-enter ${mobileMenuOpen ? "open" : ""}`}
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/composer"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Composer
            </Link>
            <Link
              href="/fixer"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fixer
            </Link>
            <span className="text-sm text-accent font-semibold">
              Scoring (current)
            </span>
            <Link
              href="/image-to-prompt"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Image to Prompt
            </Link>
            <Link
              href="/ab-test"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              A/B Test
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* ── Hero ── */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl text-foreground">
            Free AI Prompt{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Scoring Tool
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed">
            Analyze any AI image prompt and get a detailed quality score with
            actionable improvement tips. Works with Midjourney, DALL-E, Stable
            Diffusion, Flux, and more.
          </p>
        </div>

        {/* ── Tool Section ── */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-background p-4 sm:p-8 card-shadow border border-transparent dark:border-border">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-semibold text-foreground"
            >
              Your prompt
            </label>
            <span className="text-xs text-muted">
              {prompt.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            id="prompt"
            rows={6}
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setPrompt(e.target.value);
            }}
            placeholder="Paste your AI image prompt here... e.g., A cyberpunk city at night, neon lights reflecting on wet streets, cinematic lighting, 8k, hyperdetailed"
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="sm:w-[200px]">
                <label
                  htmlFor="model"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Target model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as Model)}
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
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Try example prompt
              </button>
            </div>

            <button
              onClick={handleScore}
              disabled={loading || !prompt.trim()}
              className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 0 1 8-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Analyzing your prompt...
                </span>
              ) : (
                "Score My Prompt"
              )}
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* Overall Score */}
            <div className="text-center">
              <ScoreRing score={result.overallScore} />
              <p className="mt-4 text-sm italic text-muted max-w-lg mx-auto">
                {result.verdict}
              </p>
            </div>

            {/* 6 Score Breakdown */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
              {CRITERIA.map((c) => (
                <ScoreBar
                  key={c.key}
                  label={c.label}
                  score={result.scores[c.key]}
                  weight={c.weight}
                />
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-2xl bg-background p-5 sm:p-6 card-shadow border border-transparent dark:border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#639922] mb-4">
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <svg
                        className="h-5 w-5 shrink-0 text-[#639922] mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-2xl bg-background p-5 sm:p-6 card-shadow border border-transparent dark:border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#EF9F27] mb-4">
                  Weaknesses
                </h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <svg
                        className="h-5 w-5 shrink-0 text-[#EF9F27] mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvement Tips */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Improvement Tips
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {result.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-background p-4 card-shadow border border-transparent dark:border-border"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 text-center text-xs text-muted">
              Get unlimited scoring with{" "}
              <Link
                href="/pricing"
                className="text-primary font-semibold hover:underline"
              >
                Pro — $12/mo
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/fixer?prompt=${encodeURIComponent(prompt)}`}
                className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
              >
                Fix This Prompt &rarr;
              </Link>
              <button
                onClick={handleReset}
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-light active:scale-95 cursor-pointer"
              >
                Score Another Prompt
              </button>
              <Link
                href="/image-to-prompt"
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-light active:scale-95"
              >
                Try Image to Prompt &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!result && !loading && !error && (
          <div className="mt-16 text-center text-sm text-muted space-y-3">
            <p>
              Not sure what to score?{" "}
              <button
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Try our example prompt
              </button>
            </p>
            <p>
              Want to check your prompt&apos;s score first?{" "}
              <Link
                href="/fixer"
                className="text-primary hover:underline font-medium"
              >
                Or fix it with the Prompt Fixer &rarr;
              </Link>
            </p>
          </div>
        )}

        {/* ── How Scoring Works ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            How Scoring Works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Paste your prompt",
                desc: "Enter any AI image generation prompt you want to evaluate",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "AI analyzes 6 dimensions",
                desc: "Clarity, specificity, technical accuracy, creativity, structure, effectiveness",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Get your score + tips",
                desc: "See exactly what to improve with actionable suggestions",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ),
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl bg-background p-6 sm:p-8 card-shadow border border-transparent dark:border-border text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scoring Criteria Explained ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Scoring Criteria Explained
          </h2>
          <p className="mt-3 text-center text-muted">
            Your prompt is evaluated across 6 weighted dimensions
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CRITERIA.map((c) => (
              <div
                key={c.key}
                className="rounded-xl bg-background p-5 card-shadow border border-transparent dark:border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {c.label}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {c.weight}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-20 sm:mt-28 max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-background overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                  {f.q}
                  <svg
                    className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-sm text-muted leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mt-20 sm:mt-28 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Want to go from score to perfect prompt?
          </h2>
          <p className="mt-3 text-muted">
            Use our free tools to fix, build, and optimize your prompts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/fixer"
              className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              Fix My Prompt — Free
            </Link>
            <Link
              href="/composer"
              className="rounded-xl border border-border bg-surface px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-light active:scale-95"
            >
              Build Visually
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

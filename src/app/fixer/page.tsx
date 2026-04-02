"use client";

import { useState } from "react";
import Link from "next/link";

const MODELS = ["Midjourney", "DALL-E", "Flux", "Stable Diffusion"] as const;

interface FixResult {
  original: string;
  fixed: string;
  originalScore: number;
  fixedScore: number;
  model: string;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#00C9A7" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#252542"
          strokeWidth="5"
        />
        <circle
          cx="36"
          cy="36"
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
      <span className="absolute text-lg font-bold" style={{ color }}>
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
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface-light px-3 py-1.5 text-xs font-medium text-muted transition-all hover:border-primary/30 hover:text-foreground active:scale-95"
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
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<(typeof MODELS)[number]>("Midjourney");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [error, setError] = useState("");

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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            Visual<span className="text-primary">Prompt</span>AI
          </Link>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            Free Tool
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Prompt{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fixer
            </span>
          </h1>
          <p className="mt-3 text-muted">
            Paste your rough prompt, pick a model, and get an optimized version
            instantly.
          </p>
        </div>

        {/* Input section */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-surface p-6">
          <label htmlFor="prompt" className="mb-2 block text-sm font-medium">
            Your prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. a cat sitting on a windowsill at sunset..."
            className="w-full resize-none rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 sm:max-w-[220px]">
              <label htmlFor="model" className="mb-2 block text-sm font-medium">
                Target model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) =>
                  setModel(e.target.value as (typeof MODELS)[number])
                }
                className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
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
              className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Fixing…
                </span>
              ) : (
                "Fix My Prompt"
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="rounded-2xl border border-white/5 bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Original
                </h2>
                <CopyButton text={result.original} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {result.original}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <ScoreRing score={result.originalScore} />
                <div>
                  <p className="text-sm font-medium">Quality Score</p>
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
            <div className="rounded-2xl border border-primary/30 bg-surface-light p-6 shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Optimized for {result.model}
                </h2>
                <CopyButton text={result.fixed} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result.fixed}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <ScoreRing score={result.fixedScore} />
                <div>
                  <p className="text-sm font-medium">Quality Score</p>
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
          <div className="mt-16 text-center text-sm text-muted">
            <p>
              Try something like:{" "}
              <button
                onClick={() =>
                  setPrompt(
                    "a futuristic city with flying cars and neon lights at night"
                  )
                }
                className="text-primary hover:underline"
              >
                &quot;a futuristic city with flying cars and neon lights at night&quot;
              </button>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

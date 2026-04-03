"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import AuthBanner from "@/components/AuthBanner";
import UserMenu from "@/components/UserMenu";

const MODELS = ["Midjourney", "DALL-E 3", "Flux", "Stable Diffusion", "Leonardo AI"] as const;

const QUICK_FILLS = [
  {
    a: "a golden sunset over a calm ocean with silhouetted palm trees",
    b: "warm tropical sunset reflecting off still water, coconut palms in foreground, orange and purple sky",
  },
  {
    a: "a futuristic city at night with flying cars and neon signs",
    b: "cyberpunk metropolis, aerial traffic weaving between glass towers, holographic billboards glowing in rain",
  },
  {
    a: "a medieval knight standing in a misty forest",
    b: "lone armored warrior under ancient oaks, dawn fog curling around roots, sword resting on shoulder",
  },
  {
    a: "a cozy coffee shop interior on a rainy day",
    b: "warm cafe with exposed brick, rain streaking down tall windows, steam rising from ceramic mugs",
  },
  {
    a: "an astronaut floating above Earth",
    b: "lone spacewalker drifting over the blue marble, sun cresting the horizon, visor reflecting starlight",
  },
];

interface FixResult {
  original: string;
  fixed: string;
  originalScore: number;
  fixedScore: number;
  model: string;
}

/* ── Score Ring ── */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#00C9A7" : score >= 50 ? "#F59E0B" : "#EF4444";
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--ring-track)" strokeWidth="5" />
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
      <span className="absolute text-lg font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* ── Copy Button ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-all active:scale-95"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ── Use in Composer Button ── */
function UseInComposerBtn({ prompt }: { prompt: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        sessionStorage.setItem("composerSubject", prompt);
        router.push("/composer");
      }}
      className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-all active:scale-95"
    >
      Use in Composer
    </button>
  );
}

/* ── simple quality heuristic ── */
function quickScore(prompt: string): number {
  if (!prompt.trim()) return 0;
  let s = 10;
  const words = prompt.trim().split(/\s+/).length;
  s += Math.min(words * 3, 30);
  if (/,/.test(prompt)) s += 10;
  if (/light|lighting|glow|shadow|sun|moon/i.test(prompt)) s += 10;
  if (/style|render|painting|photo|sketch|anime/i.test(prompt)) s += 10;
  if (/color|colour|warm|cool|vibrant|muted|neon/i.test(prompt)) s += 8;
  if (/composition|angle|close.up|wide|portrait|macro/i.test(prompt)) s += 8;
  if (/detail|resolution|8k|4k|hd|ultra/i.test(prompt)) s += 7;
  if (/atmosphere|mood|cinematic|dramatic/i.test(prompt)) s += 7;
  return Math.min(s, 100);
}

/* ── Crown SVG ── */
function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
    </svg>
  );
}

/* ── Main Page ── */
export default function ABTestPage() {
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");
  const [modelA, setModelA] = useState<string>("Midjourney");
  const [modelB, setModelB] = useState<string>("Midjourney");
  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<FixResult | null>(null);
  const [resultB, setResultB] = useState<FixResult | null>(null);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scoreA = quickScore(promptA);
  const scoreB = quickScore(promptB);

  const handleOptimizeBoth = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setLoading(true);
    setError("");
    setResultA(null);
    setResultB(null);
    setWinner(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/fix-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptA.trim(), model: modelA }),
        }),
        fetch("/api/fix-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptB.trim(), model: modelB }),
        }),
      ]);

      if (!resA.ok || !resB.ok) {
        const errData = !resA.ok ? await resA.json() : await resB.json();
        throw new Error(errData.error || "Optimization failed");
      }

      const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);
      setResultA(dataA);
      setResultB(dataB);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const pick = QUICK_FILLS[Math.floor(Math.random() * QUICK_FILLS.length)];
    setPromptA(pick.a);
    setPromptB(pick.b);
    setResultA(null);
    setResultB(null);
    setWinner(null);
  };

  const declareWinner = (side: "A" | "B") => {
    setWinner(side);
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
          <div className="hidden items-center gap-6 sm:flex">
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Composer</Link>
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Fixer</Link>
            <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">A/B Test</span>
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
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Fixer</Link>
            <span className="text-sm text-primary font-semibold">A/B Test (current)</span>
          </div>
        </div>
      </nav>
      <AuthBanner />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl text-foreground">
            Prompt{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              A/B Testing
            </span>
          </h1>
          <p className="mt-3 text-muted max-w-xl mx-auto leading-relaxed">
            Compare two prompt variations side by side, optimize both with AI, and pick the winner.
          </p>
        </div>

        {/* Quick Fill */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleQuickFill}
            className="rounded-xl border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-all active:scale-95"
          >
            Quick Fill with Example Prompts
          </button>
        </div>

        {/* Two editors side by side */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Variant A */}
          <div className={`rounded-2xl p-4 sm:p-6 transition-all duration-500 card-shadow ${
            winner === "A"
              ? "border-2 border-accent/60 bg-accent/5"
              : "bg-background border border-transparent dark:border-border"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-black text-white">
                  A
                </span>
                Variant A
                {winner === "A" && (
                  <span className="ml-2 animate-bounce text-yellow-400">
                    <Crown />
                  </span>
                )}
              </h2>
              <ScoreRing score={scoreA} size={52} />
            </div>

            <textarea
              rows={4}
              value={promptA}
              onChange={(e) => { setPromptA(e.target.value); setResultA(null); setWinner(null); }}
              placeholder="Enter prompt variant A..."
              className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-semibold text-muted">Target Model</label>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Variant B */}
          <div className={`rounded-2xl p-4 sm:p-6 transition-all duration-500 card-shadow ${
            winner === "B"
              ? "border-2 border-accent/60 bg-accent/5"
              : "bg-background border border-transparent dark:border-border"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-black text-white">
                  B
                </span>
                Variant B
                {winner === "B" && (
                  <span className="ml-2 animate-bounce text-yellow-400">
                    <Crown />
                  </span>
                )}
              </h2>
              <ScoreRing score={scoreB} size={52} />
            </div>

            <textarea
              rows={4}
              value={promptB}
              onChange={(e) => { setPromptB(e.target.value); setResultB(null); setWinner(null); }}
              placeholder="Enter prompt variant B..."
              className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-semibold text-muted">Target Model</label>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Optimize Both button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleOptimizeBoth}
            disabled={!promptA.trim() || !promptB.trim() || loading}
            className="rounded-xl bg-primary px-10 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="inline-flex items-center gap-3">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Optimizing Both...
              </span>
            ) : (
              "Optimize Both"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-3 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Results comparison */}
        {resultA && resultB && (
          <div className="mt-10 animate-in">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-muted mb-6">
              Optimization Results
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Result A */}
              <div className={`rounded-2xl p-4 sm:p-5 space-y-4 transition-all duration-500 card-shadow ${
                winner === "A"
                  ? "border-2 border-accent/60 bg-accent/5"
                  : "bg-background border border-transparent dark:border-border"
              }`}>
                {winner === "A" && (
                  <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold text-sm animate-bounce">
                    <Crown className="h-5 w-5" /> WINNER <Crown className="h-5 w-5" />
                  </div>
                )}

                {/* Original A */}
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Original A</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">Score: {resultA.originalScore}</span>
                      <CopyBtn text={resultA.original} />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{resultA.original}</p>
                </div>

                {/* Optimized A */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Optimized A</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent font-semibold">Score: {resultA.fixedScore}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{resultA.fixed}</p>
                  <div className="mt-3 flex gap-2">
                    <CopyBtn text={resultA.fixed} />
                    <UseInComposerBtn prompt={resultA.fixed} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted">Model: {resultA.model}</span>
                  <span className="text-xs font-semibold text-accent">
                    +{resultA.fixedScore - resultA.originalScore} pts improvement
                  </span>
                </div>
              </div>

              {/* Result B */}
              <div className={`rounded-2xl p-4 sm:p-5 space-y-4 transition-all duration-500 card-shadow ${
                winner === "B"
                  ? "border-2 border-accent/60 bg-accent/5"
                  : "bg-background border border-transparent dark:border-border"
              }`}>
                {winner === "B" && (
                  <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold text-sm animate-bounce">
                    <Crown className="h-5 w-5" /> WINNER <Crown className="h-5 w-5" />
                  </div>
                )}

                {/* Original B */}
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Original B</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">Score: {resultB.originalScore}</span>
                      <CopyBtn text={resultB.original} />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{resultB.original}</p>
                </div>

                {/* Optimized B */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Optimized B</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent font-semibold">Score: {resultB.fixedScore}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{resultB.fixed}</p>
                  <div className="mt-3 flex gap-2">
                    <CopyBtn text={resultB.fixed} />
                    <UseInComposerBtn prompt={resultB.fixed} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted">Model: {resultB.model}</span>
                  <span className="text-xs font-semibold text-accent">
                    +{resultB.fixedScore - resultB.originalScore} pts improvement
                  </span>
                </div>
              </div>
            </div>

            {/* Declare Winner */}
            <div className="mt-8 text-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
                Declare Winner
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => declareWinner("A")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 py-3 text-sm font-bold transition-all active:scale-95 ${
                    winner === "A"
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30 scale-105"
                      : "border border-border bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  <Crown /> A Wins
                </button>
                <button
                  onClick={() => declareWinner("B")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 py-3 text-sm font-bold transition-all active:scale-95 ${
                    winner === "B"
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30 scale-105"
                      : "border border-border bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  <Crown /> B Wins
                </button>
              </div>
              {winner && (
                <p className="mt-4 text-sm text-accent font-medium animate-in">
                  Variant {winner} has been declared the winner!
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

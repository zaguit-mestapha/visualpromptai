"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AuthBanner from "@/components/AuthBanner";
import UserMenu from "@/components/UserMenu";

/* ── category definitions ── */
const CATEGORIES = {
  subject: { label: "Subject", type: "text" as const, placeholder: "A cyberpunk samurai standing in rain..." },
  style: {
    label: "Art Style",
    type: "select" as const,
    options: ["Photorealistic", "Anime", "Oil Painting", "Watercolor", "3D Render", "Pixel Art", "Digital Art", "Pencil Sketch"],
  },
  lighting: {
    label: "Lighting",
    type: "select" as const,
    options: ["Golden Hour", "Dramatic", "Soft", "Neon", "Studio", "Natural", "Cinematic", "Backlit"],
  },
  camera: {
    label: "Camera Angle",
    type: "select" as const,
    options: ["Close-up", "Wide Shot", "Bird's Eye", "Low Angle", "Portrait", "Macro", "Aerial", "Dutch Angle"],
  },
  color: {
    label: "Color Mood",
    type: "select" as const,
    options: ["Warm", "Cool", "Vibrant", "Muted", "Pastel", "Monochrome", "Neon", "Earth Tones"],
  },
  composition: {
    label: "Composition",
    type: "select" as const,
    options: ["Rule of Thirds", "Centered", "Symmetrical", "Leading Lines", "Frame Within Frame", "Minimalist"],
  },
  custom: { label: "Custom Keywords", type: "text" as const, placeholder: "fog, volumetric light, 8k..." },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const EXPORT_MODELS = ["Midjourney", "DALL-E 3", "Flux", "Stable Diffusion", "Leonardo AI"] as const;

/* ── helpers ── */
function buildPrompt(blocks: Record<string, string>): string {
  const parts: string[] = [];
  if (blocks.subject) parts.push(blocks.subject);
  if (blocks.style) parts.push(`${blocks.style} style`);
  if (blocks.lighting) parts.push(`${blocks.lighting} lighting`);
  if (blocks.camera) parts.push(`${blocks.camera} angle`);
  if (blocks.color) parts.push(`${blocks.color} color palette`);
  if (blocks.composition) parts.push(`${blocks.composition} composition`);
  if (blocks.custom) parts.push(blocks.custom);
  return parts.join(", ");
}

function calcScore(blocks: Record<string, string>): number {
  const filled = Object.values(blocks).filter((v) => v.trim().length > 0).length;
  const total = Object.keys(CATEGORIES).length;
  return Math.round((filled / total) * 100);
}

function formatForModel(prompt: string, model: string): string {
  switch (model) {
    case "Midjourney":
      return `${prompt} --ar 16:9 --v 6.1 --style raw`;
    case "DALL-E 3":
      return `Create a highly detailed image of: ${prompt}. Make it photorealistic with rich detail and professional composition.`;
    case "Flux":
      return `${prompt}, ultra detailed, professional photography, sharp focus`;
    case "Stable Diffusion":
      return `(masterpiece, best quality:1.4), ${prompt}, (highly detailed:1.2), (sharp focus:1.1)\nNegative: (worst quality, low quality, blurry, deformed:1.4)`;
    case "Leonardo AI":
      return `${prompt} | Style: Dynamic | Enhancement: High Detail`;
    default:
      return prompt;
  }
}

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  subject: "from-violet-500 to-purple-600",
  style: "from-fuchsia-500 to-pink-600",
  lighting: "from-amber-400 to-orange-500",
  camera: "from-cyan-400 to-blue-500",
  color: "from-emerald-400 to-teal-500",
  composition: "from-rose-400 to-red-500",
  custom: "from-indigo-400 to-violet-500",
};

const CATEGORY_BORDERS: Record<CategoryKey, string> = {
  subject: "border-violet-500/30",
  style: "border-fuchsia-500/30",
  lighting: "border-amber-400/30",
  camera: "border-cyan-400/30",
  color: "border-emerald-400/30",
  composition: "border-rose-400/30",
  custom: "border-indigo-400/30",
};

/* ── Score Ring ── */
function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#00C9A7" : score >= 50 ? "#F59E0B" : "#EF4444";
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--ring-track)" strokeWidth="6" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className={`absolute font-bold ${size <= 72 ? "text-lg" : "text-2xl"}`} style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* ── Main Page ── */
export default function ComposerPage() {
  const [blocks, setBlocks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const key of Object.keys(CATEGORIES)) init[key] = "";
    return init;
  });

  const [copied, setCopied] = useState(false);
  const [exportedModel, setExportedModel] = useState<string | null>(null);
  const [exportedPrompt, setExportedPrompt] = useState("");
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState<{ fixed: string; fixedScore: number } | null>(null);
  const [fixError, setFixError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accept subject from A/B Test "Use in Composer" button
  useEffect(() => {
    const saved = sessionStorage.getItem("composerSubject");
    if (saved) {
      setBlocks((prev) => ({ ...prev, subject: saved }));
      sessionStorage.removeItem("composerSubject");
    }
  }, []);

  const prompt = buildPrompt(blocks);
  const score = calcScore(blocks);
  const activeBlocks = Object.entries(blocks).filter(([, v]) => v.trim().length > 0);

  const setBlock = useCallback((key: string, value: string) => {
    setBlocks((prev) => ({ ...prev, [key]: value }));
    setExportedModel(null);
    setFixResult(null);
  }, []);

  const removeBlock = useCallback((key: string) => {
    setBlocks((prev) => ({ ...prev, [key]: "" }));
    setExportedModel(null);
    setFixResult(null);
  }, []);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (model: string) => {
    const formatted = formatForModel(prompt, model);
    setExportedPrompt(formatted);
    setExportedModel(model);
  };

  const handleFix = async () => {
    if (!prompt.trim()) return;
    setFixing(true);
    setFixError("");
    setFixResult(null);
    try {
      const res = await fetch("/api/fix-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model: "Midjourney" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      const data = await res.json();
      setFixResult({ fixed: data.fixed, fixedScore: data.fixedScore });
    } catch (err) {
      setFixError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Fixer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">A/B Test</Link>
            <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Composer</span>
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
        <div className={`border-t border-border dark:border-white/[0.06] bg-background/95 backdrop-blur-xl sm:hidden mobile-menu-enter ${mobileMenuOpen ? "open" : ""}`}>
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Fixer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>A/B Test</Link>
            <span className="text-sm text-primary font-bold">Composer (current)</span>
          </div>
        </div>
      </nav>
      <AuthBanner />

      <div className="pt-16 min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[320px_1fr_320px]">
        {/* ── LEFT SIDEBAR: Building Blocks ── */}
        <aside className="md:col-span-1 border-b md:border-b-0 md:border-r border-border dark:border-white/[0.06] bg-background p-4 sm:p-5 md:overflow-y-auto md:h-[calc(100vh-4rem)] md:sticky md:top-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
            Building Blocks
          </h2>

          <div className="space-y-4">
            {(Object.entries(CATEGORIES) as [CategoryKey, (typeof CATEGORIES)[CategoryKey]][]).map(
              ([key, cat]) => (
                <div key={key} className="group">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[key]}`} />
                    {cat.label}
                  </label>

                  {cat.type === "text" ? (
                    <input
                      type="text"
                      value={blocks[key]}
                      onChange={(e) => setBlock(key, e.target.value)}
                      placeholder={cat.placeholder}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ) : (
                    <select
                      value={blocks[key]}
                      onChange={(e) => setBlock(key, e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select {cat.label.toLowerCase()}...</option>
                      {cat.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ),
            )}
          </div>

          {/* Quick-fill button */}
          <button
            onClick={() => {
              setBlock("subject", "A lone astronaut exploring ancient ruins on Mars");
              setBlock("style", "Photorealistic");
              setBlock("lighting", "Golden Hour");
              setBlock("camera", "Wide Shot");
              setBlock("color", "Warm");
              setBlock("composition", "Rule of Thirds");
              setBlock("custom", "volumetric fog, 8k, ultra detailed");
            }}
            className="mt-6 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-muted hover:text-foreground transition-all"
          >
            Fill Example Prompt
          </button>
        </aside>

        {/* ── CENTER: Canvas ── */}
        <main className="md:col-span-1 p-4 sm:p-6 lg:p-8 md:overflow-y-auto md:h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              Prompt Canvas
            </h2>

            {/* Active blocks */}
            <div className="min-h-[180px] rounded-2xl border-2 border-dashed border-border bg-background p-5">
              {activeBlocks.length === 0 ? (
                <div className="flex h-[140px] items-center justify-center text-sm text-muted/60">
                  Select blocks from the sidebar to start composing your prompt
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {activeBlocks.map(([key, value]) => {
                    const cat = CATEGORIES[key as CategoryKey];
                    return (
                      <div
                        key={key}
                        className={`group/card animate-in flex items-start gap-2 rounded-xl border ${CATEGORY_BORDERS[key as CategoryKey]} bg-surface px-4 py-3 transition-all hover:scale-[1.02] card-shadow`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">
                            {cat.label}
                          </span>
                          <span className="block text-sm font-medium text-foreground truncate max-w-[200px]">
                            {value}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBlock(key)}
                          className="mt-0.5 rounded-md p-0.5 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                          aria-label={`Remove ${cat.label}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Model Export Buttons */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                Export for Model
              </h3>
              <div className="flex flex-wrap gap-2">
                {EXPORT_MODELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleExport(m)}
                    disabled={!prompt.trim()}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                      exportedModel === m
                        ? "bg-gradient-to-r from-primary to-accent text-black shadow-md shadow-primary/20"
                        : "border border-border bg-background text-muted hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Exported Prompt */}
            {exportedModel && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5 animate-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Formatted for {exportedModel}
                  </span>
                  <button
                    onClick={() => handleCopy(exportedPrompt)}
                    className="rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-muted hover:text-foreground transition-all"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-mono">
                  {exportedPrompt}
                </p>
              </div>
            )}

            {/* Fix with AI */}
            {fixResult && (
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-5 animate-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    AI Optimized (Score: {fixResult.fixedScore})
                  </span>
                  <button
                    onClick={() => handleCopy(fixResult.fixed)}
                    className="rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-muted hover:text-foreground transition-all"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {fixResult.fixed}
                </p>
              </div>
            )}

            {fixError && (
              <div className="mt-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-3 text-sm text-red-600 dark:text-red-400">
                {fixError}
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT PANEL: Live Preview ── */}
        <aside className="md:col-span-2 lg:col-span-1 border-t md:border-t lg:border-t-0 lg:border-l border-border dark:border-white/[0.06] bg-background p-4 sm:p-5 md:overflow-y-auto lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            Live Preview
          </h2>

          {/* Prompt text */}
          <div className="rounded-xl border border-border bg-surface p-4 min-h-[120px]">
            {prompt.trim() ? (
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {prompt}
              </p>
            ) : (
              <p className="text-sm text-muted/40 italic">Your prompt will appear here...</p>
            )}
          </div>

          {/* Quality Score */}
          <div className="mt-6 flex flex-col items-center md:flex-row md:items-start md:gap-6 lg:flex-col lg:items-center">
            <ScoreRing score={score} size={80} />
            <div className="md:flex-1 lg:text-center">
              <p className="mt-2 md:mt-0 text-sm font-semibold text-foreground">Quality Score</p>
              <p className="text-xs text-muted text-center md:text-left lg:text-center mt-1">
                {score < 30
                  ? "Add more blocks to improve quality"
                  : score < 60
                    ? "Getting better, keep adding details"
                    : score < 85
                      ? "Good prompt, almost complete"
                      : "Excellent! Ready to generate"}
              </p>
              <div className="mt-2 text-xs text-muted text-center md:text-left lg:text-center">
                {activeBlocks.length}/{Object.keys(CATEGORIES).length} categories filled
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-1">
            <button
              onClick={() => handleCopy(prompt)}
              disabled={!prompt.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>

            <button
              onClick={handleFix}
              disabled={!prompt.trim() || fixing}
              className="w-full rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {fixing ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Optimizing...
                </span>
              ) : (
                "Fix with AI"
              )}
            </button>

            <button
              onClick={() => {
                setBlocks(() => {
                  const init: Record<string, string> = {};
                  for (const key of Object.keys(CATEGORIES)) init[key] = "";
                  return init;
                });
                setExportedModel(null);
                setFixResult(null);
              }}
              className="w-full col-span-2 md:col-span-1 lg:col-span-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-all"
            >
              Clear All
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

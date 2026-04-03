"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";

/* ───── Types ───── */
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

const STYLES = ["detailed", "concise", "creative"] as const;
type Style = (typeof STYLES)[number];

interface Result {
  prompt: string;
  negativePrompt: string;
  detectedSubject: string;
  detectedStyle: string;
  detectedMood: string;
  tags: string[];
  score: number;
  tips: string[];
  model: string;
}

/* ───── Helpers ───── */
function compressImage(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (file.size <= 1024 * 1024) {
        // Under 1MB, just strip the data URI prefix
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
        resolve(base64);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/* ───── Sub-components ───── */
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
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-all hover:text-foreground active:scale-95 cursor-pointer"
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

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const color = animated >= 75 ? "#00C9A7" : animated >= 50 ? "#F59E0B" : "#EF4444";
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

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
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={`absolute font-bold ${size <= 56 ? "text-sm" : "text-lg"}`} style={{ color }}>
        {animated}
      </span>
    </div>
  );
}

/* ───── FAQ Data ───── */
const faqs = [
  {
    q: "What is Image to Prompt?",
    a: "Image to Prompt is an AI tool that analyzes any image and generates an optimized text prompt that can recreate that image using AI art generators like Midjourney, DALL-E, Stable Diffusion, and Flux.",
  },
  {
    q: "Is the Image to Prompt generator free?",
    a: "Yes, our Image to Prompt generator is completely free to use with no login required and no daily limits.",
  },
  {
    q: "Which AI models are supported?",
    a: "We generate optimized prompts for Midjourney, DALL-E 3, Stable Diffusion, Flux, Leonardo AI, Grok, and a General format that works across all models.",
  },
  {
    q: "How accurate are the generated prompts?",
    a: "Our AI analyzes composition, style, lighting, colors, and subject matter to produce highly accurate prompts. Results vary by image complexity, but most prompts score 75+ on our quality scale.",
  },
  {
    q: "Can I use this for commercial purposes?",
    a: "Yes, all generated prompts are yours to use however you like, including for commercial projects.",
  },
  {
    q: "What image formats are supported?",
    a: "We support JPG, PNG, and WEBP images up to 4MB. Images over 1MB are automatically compressed for optimal processing.",
  },
  {
    q: "How is this different from other image to prompt tools?",
    a: "We optimize prompts specifically for each AI model, provide a quality score, show detected style and mood, and connect to a full visual prompt builder for further refinement.",
  },
  {
    q: "Do you store my images?",
    a: "No. Images are processed in real-time and never stored on our servers. Your uploads are discarded immediately after analysis.",
  },
];

/* ───── Model cards data ───── */
const modelCards = [
  { name: "Midjourney", desc: "Comma-separated keywords with --ar and --v parameters" },
  { name: "DALL-E 3", desc: "Natural language paragraphs with rich descriptive detail" },
  { name: "Stable Diffusion", desc: "Weighted tags with quality prefixes and negative prompts" },
  { name: "Flux", desc: "Flowing descriptions with precise spatial relationships" },
  { name: "Leonardo AI", desc: "Clean tags with style presets and resolution parameters" },
  { name: "Grok", desc: "Concise natural language with focused descriptions" },
  { name: "General", desc: "Universal prompts that work across all AI image models" },
];

/* ───── Main Component ───── */
export default function ImageToPromptPage() {
  const [model, setModel] = useState<Model>("Midjourney");
  const [style, setStyle] = useState<Style>("detailed");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB.");
      return;
    }
    setError("");
    setResult(null);
    setFileSize(file.size);
    setImagePreview(URL.createObjectURL(file));
    const base64 = await compressImage(file);
    setImage(base64);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setFileSize(0);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/image-to-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, model, promptStyle: style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
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

  return (
    <div className="min-h-screen bg-background">
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image to Prompt AI Generator",
            url: "https://visualpromptai.com/image-to-prompt",
            description:
              "Free AI tool that converts images into optimized prompts for Midjourney, DALL-E, Stable Diffusion, Flux, and more.",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "VisualPromptAI" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold tracking-[-0.02em]">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Composer</Link>
            <Link href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Fixer</Link>
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">A/B Test</Link>
            <span className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Image to Prompt</span>
            <ThemeToggle />
            <UserMenu />
          </div>
          <div className="flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex flex-col gap-1.5" aria-label="Toggle menu">
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
            <Link href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>A/B Test</Link>
            <span className="text-sm text-accent font-semibold">Image to Prompt (current)</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* ── Hero ── */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl text-foreground">
            Free{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Image to Prompt
            </span>{" "}
            AI Generator
          </h1>
          <p className="mt-4 text-muted leading-relaxed text-lg">
            Upload any image and get an optimized AI prompt instantly. Works with
            Midjourney, DALL-E, Stable Diffusion, Flux, Grok, and more.
          </p>
        </div>

        {/* ── Tool Section ── */}
        <div ref={toolRef} id="tool" className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Left: Upload */}
          <div className="rounded-2xl bg-background p-4 sm:p-6 card-shadow border border-transparent dark:border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Upload Image
            </h2>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="w-full rounded-xl object-contain max-h-[400px] bg-surface"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">{formatBytes(fileSize)}</span>
                  <button
                    onClick={clearImage}
                    className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-surface"
                }`}
              >
                <svg className="h-12 w-12 text-muted mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM16.5 7.5h.008v.008H16.5V7.5z" />
                </svg>
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="mt-1 text-xs text-muted">
                  JPG, PNG, WEBP up to 4MB
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {/* Right: Settings + Output */}
          <div className="rounded-2xl bg-background p-4 sm:p-6 card-shadow border border-transparent dark:border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Settings
            </h2>

            {/* Model selector */}
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Target Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as Model)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Style selector */}
            <label className="mt-4 mb-2 block text-sm font-semibold text-foreground">
              Prompt Style
            </label>
            <div className="flex gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all cursor-pointer ${
                    style === s
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!image || loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Analyzing your image...
                </span>
              ) : (
                "Generate Prompt"
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4 animate-in fade-in">
                {/* Generated prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Generated Prompt
                    </h3>
                    <CopyButton text={result.prompt} />
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {result.prompt}
                  </div>
                </div>

                {/* Negative prompt */}
                {result.negativePrompt && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        Negative Prompt
                      </h3>
                      <CopyButton text={result.negativePrompt} />
                    </div>
                    <div className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-muted whitespace-pre-wrap">
                      {result.negativePrompt}
                    </div>
                  </div>
                )}

                {/* Detection badges */}
                <div className="flex flex-wrap gap-2">
                  {result.detectedSubject && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {result.detectedSubject}
                    </span>
                  )}
                  {result.detectedStyle && (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {result.detectedStyle}
                    </span>
                  )}
                  {result.detectedMood && (
                    <span className="rounded-full bg-purple-100 dark:bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                      {result.detectedMood}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Score + Tips */}
                <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-4">
                  <ScoreRing score={result.score} size={64} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Quality Score
                    </p>
                    {result.tips.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted">
                            <span className="mt-0.5 text-accent">&#8226;</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Powered by */}
                <p className="text-center text-[10px] text-muted/60">
                  Powered by VisualPromptAI
                </p>

                {/* Upsell banner */}
                <Link
                  href="/composer"
                  className="block rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
                >
                  Want to optimize this prompt further? Try our Visual Composer &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── How It Works ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            How It Works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload your image",
                desc: "Upload any image you want to recreate with AI",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Choose your AI model",
                desc: "Select which AI tool you'll use to generate",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Get your prompt",
                desc: "Copy your optimized, model-specific prompt instantly",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Supported Models ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Supported AI Models
          </h2>
          <p className="mt-3 text-center text-muted">
            Optimized image to prompt generation for every major AI art platform
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modelCards.map((m) => (
              <div
                key={m.name}
                className="rounded-xl bg-background p-5 card-shadow border border-transparent dark:border-border hover:scale-[1.02] transition-all"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-bold text-primary">
                  {m.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-foreground">
            Use Cases
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Recreate a photo",
                desc: "Turn any photograph into an AI-reproducible prompt with accurate style and composition details.",
              },
              {
                title: "Learn from AI art",
                desc: "See an AI image you love? Extract the prompt behind it to understand how it was made.",
              },
              {
                title: "Build a style library",
                desc: "Analyze multiple images to build a collection of style prompts for consistent branding.",
              },
              {
                title: "Cross-model translation",
                desc: "Take a Midjourney result and get the prompt formatted for Stable Diffusion, Flux, or any other model.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl bg-background p-6 sm:p-8 card-shadow border border-transparent dark:border-border"
              >
                <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{c.desc}</p>
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
            {faqs.map((f) => (
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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
            Ready to build better prompts?
          </h2>
          <p className="mt-3 text-muted">
            Turn any image into a production-ready AI prompt in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => toolRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              Try Image to Prompt — Free
            </button>
            <Link
              href="/composer"
              className="rounded-xl border border-border bg-surface px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-light active:scale-95"
            >
              Explore Visual Composer
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

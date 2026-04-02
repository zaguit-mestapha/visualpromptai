"use client";

import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[300px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Now in early access
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Build AI Image Prompts{" "}
          <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
            Visually
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Stop guessing. Drag, drop, and optimize prompts for Midjourney,
          DALL-E, Flux, and Stable Diffusion.
        </p>

        {/* Waitlist form */}
        <div id="waitlist" className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 px-6 py-4 text-accent">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-full border border-white/10 bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110 active:scale-95"
              >
                Join Waitlist
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted">
            Free during beta &middot; No credit card required
          </p>
        </div>

        {/* Model logos row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted">
          <span className="opacity-60">Works with:</span>
          {["Midjourney", "DALL-E 3", "Stable Diffusion", "Flux"].map((m) => (
            <span key={m} className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-medium">
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

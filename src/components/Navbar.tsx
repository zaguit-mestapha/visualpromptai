"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 text-xl font-bold">
          <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <span>
            Visual<span className="text-primary">Prompt</span>AI
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="/composer" className="text-sm text-muted hover:text-foreground transition-colors">
            Composer
          </a>
          <a href="/fixer" className="text-sm text-muted hover:text-foreground transition-colors">
            Fixer
          </a>
          <a href="/ab-test" className="text-sm text-muted hover:text-foreground transition-colors">
            A/B Test
          </a>
          <a
            href="#waitlist"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            <a href="#features" className="text-sm text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Pricing
            </a>
            <a href="/composer" className="text-sm text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Composer
            </a>
            <a href="/fixer" className="text-sm text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Fixer
            </a>
            <a href="/ab-test" className="text-sm text-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
              A/B Test
            </a>
            <a
              href="#waitlist"
              className="rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Join Waitlist
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

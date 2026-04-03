"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em]">
          <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <span className="text-foreground">
            Visual<span className="text-primary">Prompt</span>AI
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Composer
          </a>
          <a href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Fixer
          </a>
          <a href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            A/B Test
          </a>
          <ThemeToggle />
          <a
            href="#waitlist"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`border-t border-border bg-background/95 backdrop-blur-xl md:hidden mobile-menu-enter ${mobileOpen ? "open" : ""}`}
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Pricing
          </a>
          <a href="/composer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Composer
          </a>
          <a href="/fixer" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Fixer
          </a>
          <a href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            A/B Test
          </a>
          <a
            href="#waitlist"
            className="rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
            onClick={() => setMobileOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

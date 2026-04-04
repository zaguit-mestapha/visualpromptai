"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
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
          <a href="/prompt-scoring" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Scoring
          </a>
          <a href="/image-to-prompt" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Image to Prompt
          </a>
          <a href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            A/B Test
          </a>
          <ThemeToggle />
          <UserMenu />
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
        className={`border-t border-border dark:border-white/[0.08] bg-background/95 backdrop-blur-xl md:hidden mobile-menu-enter ${mobileOpen ? "open" : ""}`}
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
          <a href="/prompt-scoring" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Scoring
          </a>
          <a href="/image-to-prompt" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Image to Prompt
          </a>
          <a href="/ab-test" className="text-sm font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            A/B Test
          </a>
          <div className="pt-2 border-t border-border dark:border-white/[0.08]">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

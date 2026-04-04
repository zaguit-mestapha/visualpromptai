import Link from "next/link";
import { LogoIcon } from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border dark:border-white/[0.08] bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <LogoIcon size={28} />
              <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              The visual prompt engineering platform for AI image generation.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#features" className="text-muted/70 hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="text-muted/70 hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
              Tools
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/fixer" className="text-muted/70 hover:text-foreground transition-colors">Prompt Fixer</Link></li>
              <li><Link href="/image-to-prompt" className="text-muted/70 hover:text-foreground transition-colors">Image to Prompt</Link></li>
              <li><Link href="/prompt-scoring" className="text-muted/70 hover:text-foreground transition-colors">Prompt Scoring</Link></li>
              <li><Link href="/composer" className="text-muted/70 hover:text-foreground transition-colors">Visual Composer</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="text-muted/70 hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted/70 hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted/70 hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted/70 hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/disclaimer" className="text-muted/70 hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border dark:border-white/[0.08] pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} VisualPromptAI. All rights
              reserved.
            </p>
            <span className="hidden sm:inline rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              Built with AI
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-muted hover:text-foreground transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-muted hover:text-foreground transition-colors" aria-label="GitHub">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

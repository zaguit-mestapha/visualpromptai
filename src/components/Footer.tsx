export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent" />
              Visual<span className="text-primary">Prompt</span>AI
            </a>
            <p className="mt-3 text-sm text-muted">
              The visual prompt engineering platform for AI image generation.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Product
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#features" className="text-muted hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Resources
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Prompt Guide</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="mailto:hello@visualpromptai.com" className="text-muted hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} VisualPromptAI. All rights
            reserved.
          </p>
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

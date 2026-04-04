import Link from "next/link";
import Footer from "@/components/Footer";
import { LogoIcon } from "@/components/Logo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <LogoIcon size={28} />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <Link
            href="/fixer"
            className="rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90"
          >
            Try Prompt Fixer
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <h1 className="text-3xl font-bold font-display sm:text-4xl text-foreground">
          About{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VisualPromptAI
          </span>
        </h1>

        <div className="mt-8 space-y-6 text-muted leading-relaxed text-lg">
          <p>
            VisualPromptAI is a visual prompt engineering platform for AI image
            generation. We help creators build, optimize, and test prompts for
            Midjourney, DALL-E, Stable Diffusion, Flux, and other AI art tools.
          </p>
          <p>
            Our mission is to make prompt engineering accessible to everyone
            &mdash; from hobbyists to professional creative teams.
          </p>
          <p>Built with love and AI.</p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-bold font-display text-foreground">Get in touch</h2>
          <p className="mt-3 text-muted">
            Have questions or feedback? Reach out at{" "}
            <a
              href="mailto:hello@visualpromptai.com"
              className="text-primary hover:underline"
            >
              hello@visualpromptai.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

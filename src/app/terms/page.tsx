import Link from "next/link";
import Footer from "@/components/Footer";
import { LogoIcon } from "@/components/Logo";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold font-display sm:text-4xl text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 2026</p>

        <div className="mt-8 space-y-8 text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold font-display text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using VisualPromptAI, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">2. Description of Service</h2>
            <p className="mt-3">
              VisualPromptAI is a visual prompt engineering platform for AI image generation. We
              provide tools to build, optimize, test, and score prompts for various AI image
              generation models including Midjourney, DALL-E, Stable Diffusion, and Flux.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">3. User Accounts</h2>
            <p className="mt-3">
              Some features may require you to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">4. Acceptable Use</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Use the service for any unlawful purpose.</li>
              <li>Generate prompts intended to produce harmful, abusive, or illegal content.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble the service.</li>
              <li>Interfere with or disrupt the service or its infrastructure.</li>
              <li>Use automated tools to scrape or extract data from the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">5. Intellectual Property</h2>
            <p className="mt-3">
              <strong className="text-foreground">Your prompts are yours.</strong> You retain full
              ownership of all prompts you create, modify, or optimize using VisualPromptAI. We do
              not claim any rights over your content.
            </p>
            <p className="mt-3">
              The VisualPromptAI platform, including its design, code, and branding, is owned by us
              and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">6. Limitation of Liability</h2>
            <p className="mt-3">
              VisualPromptAI is provided &ldquo;as is&rdquo; without warranties of any kind. We are
              not liable for any indirect, incidental, special, or consequential damages arising
              from your use of the service. Our total liability shall not exceed the amount you paid
              us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">7. Changes to Terms</h2>
            <p className="mt-3">
              We may update these terms from time to time. We will notify you of significant changes
              by posting a notice on our website. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display text-foreground">8. Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@visualpromptai.com" className="text-primary hover:underline">
                hello@visualpromptai.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

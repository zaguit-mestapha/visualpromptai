import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <Link
            href="/fixer"
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            Try Prompt Fixer
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <h1 className="text-3xl font-semibold sm:text-4xl text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 2026</p>

        <div className="mt-8 space-y-8 text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-3">
              We collect the following types of information when you use VisualPromptAI:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Account information:</strong> Email address when you create an account.</li>
              <li><strong className="text-foreground">Usage data:</strong> Pages visited, features used, and interaction patterns collected via Google Analytics.</li>
              <li><strong className="text-foreground">Payment information:</strong> Processed securely through Stripe. We do not store your credit card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Image Processing</h2>
            <p className="mt-3">
              Images uploaded to our Image to Prompt feature are processed in real-time and are
              <strong className="text-foreground"> not stored</strong> on our servers. Images are deleted
              immediately after processing is complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Cookies</h2>
            <p className="mt-3">
              We use cookies for authentication (to keep you logged in) and analytics (via Google
              Analytics) to understand how our service is used. You can disable cookies in your
              browser settings, though some features may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p className="mt-3">We use the following third-party services:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Supabase</strong> &mdash; Authentication and database.</li>
              <li><strong className="text-foreground">OpenRouter</strong> &mdash; AI model access for prompt processing.</li>
              <li><strong className="text-foreground">Stripe</strong> &mdash; Payment processing.</li>
              <li><strong className="text-foreground">Google Analytics</strong> &mdash; Usage tracking and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p className="mt-3">You have the right to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of analytics tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
            <p className="mt-3">
              We implement industry-standard security measures to protect your data. All data is
              transmitted over encrypted connections (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
            <p className="mt-3">
              For privacy-related questions, contact us at{" "}
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

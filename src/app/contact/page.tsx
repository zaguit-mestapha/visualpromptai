"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <h1 className="text-3xl font-semibold sm:text-4xl text-foreground">Contact Us</h1>
        <p className="mt-3 text-lg text-muted">
          Have questions, feedback, or need support? We&apos;d love to hear from you.
        </p>

        {/* Contact info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Email</h3>
            <a
              href="mailto:hello@visualpromptai.com"
              className="mt-2 block text-primary hover:underline"
            >
              hello@visualpromptai.com
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Response Time</h3>
            <p className="mt-2 text-foreground">We typically respond within 24 hours</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          {submitted ? (
            <div className="rounded-xl border border-accent/30 bg-accent/5 px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
              <p className="mt-2 text-muted">
                Your message has been sent. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
                  Subject
                </label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option>General Inquiry</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-primary/30 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Social */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted">
            You can also reach us on social media &mdash; follow us on X (Twitter) for updates,
            tips, and community highlights.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

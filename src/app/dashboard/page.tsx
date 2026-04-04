"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { LogoIcon } from "@/components/Logo";

const quickLinks = [
  {
    title: "Visual Composer",
    description: "Build prompts with drag-and-drop blocks",
    href: "/composer",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Prompt Fixer",
    description: "Optimize any prompt with AI",
    href: "/fixer",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "A/B Testing",
    description: "Compare and pick the best prompt",
    href: "/ab-test",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    color: "from-cyan-400 to-blue-500",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-white/[0.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <LogoIcon size={32} />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight font-display text-foreground">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-muted">
            Here&apos;s your prompt engineering overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl bg-background p-6 card-shadow border border-transparent dark:border-white/[0.06]">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
              Prompts Today
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">0</p>
            <p className="mt-1 text-xs text-muted">of 5 free daily prompts</p>
          </div>
          <div className="rounded-2xl bg-background p-6 card-shadow border border-transparent dark:border-white/[0.06]">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
              Total Prompts
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">0</p>
            <p className="mt-1 text-xs text-muted">prompts created</p>
          </div>
          <div className="rounded-2xl bg-background p-6 card-shadow border border-transparent dark:border-white/[0.06]">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
              Plan
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">Free</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link href="/pricing" className="inline-block text-xs text-primary font-semibold hover:underline">
                Upgrade to Pro
              </Link>
              <span className="text-xs text-muted">|</span>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/stripe/portal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ customerId: "" }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch { /* no-op */ }
                }}
                className="text-xs text-muted hover:text-foreground font-semibold transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl bg-background p-6 card-shadow card-shadow-hover border border-transparent dark:border-white/[0.06] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white`}>
                {link.icon}
              </div>
              <h3 className="text-base font-bold text-foreground">{link.title}</h3>
              <p className="mt-1 text-sm text-muted">{link.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

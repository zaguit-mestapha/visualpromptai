"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";
import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em]">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-foreground">Visual<span className="text-primary">Prompt</span>AI</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center">
              <div className="rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 px-4 py-4">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Password updated successfully. Redirecting...
                </p>
              </div>
            </div>
          ) : !ready ? (
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground mb-4">
                Set new password
              </h1>
              <p className="text-sm text-muted">
                Verifying your reset link...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Set new password
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-foreground">
                    New password
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-foreground">
                    Confirm password
                  </label>
                  <PasswordInput
                    id="confirm"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

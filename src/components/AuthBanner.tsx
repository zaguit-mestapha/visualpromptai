"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AuthBanner() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return (
    <div className="border-b border-primary/10 bg-primary/5">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm text-primary">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
        <span>
          <Link href="/login" className="font-semibold underline underline-offset-2 hover:opacity-80">
            Sign in
          </Link>{" "}
          to save your prompts and unlock more features
        </span>
      </div>
    </div>
  );
}

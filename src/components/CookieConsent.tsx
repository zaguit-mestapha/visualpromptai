"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes("cookie_consent=accepted")) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    document.cookie = "cookie_consent=accepted; max-age=31536000; path=/";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] translate-y-0 transition-transform duration-500 ease-out"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
      <div className="border-t border-border dark:border-white/[0.08] bg-surface-light/95 dark:bg-surface-light/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:px-6">
          <p className="flex-1 text-sm text-muted text-center sm:text-left">
            We use cookies to improve your experience and analyze site traffic. By continuing to use
            our site, you agree to our use of cookies.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/privacy"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Learn More
            </Link>
            <button
              onClick={accept}
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

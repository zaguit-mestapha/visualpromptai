import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Prompt Fixer & Generator — Optimize Any Prompt | VisualPromptAI",
  description:
    "Paste any AI image prompt and get an optimized version instantly. Free prompt generator and fixer for Midjourney, DALL-E, Stable Diffusion, Flux. No login needed.",
  keywords: [
    "AI prompt fixer",
    "prompt optimizer",
    "prompt generator",
    "fix midjourney prompt",
    "improve AI prompts",
    "prompt enhancer",
    "AI image prompt tool",
    "fix my prompt",
  ],
  openGraph: {
    title: "Free AI Prompt Fixer & Generator — Optimize Any Prompt | VisualPromptAI",
    description:
      "Paste any AI image prompt and get an optimized version instantly. Free prompt generator and fixer for Midjourney, DALL-E, Stable Diffusion, Flux.",
    url: "https://visualpromptai.com/fixer",
    siteName: "VisualPromptAI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Prompt Fixer & Generator | VisualPromptAI",
    description:
      "Paste any AI image prompt and get an optimized version instantly. Free, no login needed.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://visualpromptai.com/fixer",
  },
};

export default function FixerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

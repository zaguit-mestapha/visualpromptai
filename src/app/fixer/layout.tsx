import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Prompt Fixer - Optimize Prompts for Midjourney, DALL-E & More",
  description:
    "Instantly fix and optimize your AI image prompts. Paste any rough prompt and get an optimized version for Midjourney, DALL-E, Stable Diffusion, or Flux. Free online tool.",
  keywords: [
    "AI prompt fixer",
    "prompt optimizer",
    "fix midjourney prompt",
    "improve AI prompts",
    "prompt enhancer",
    "AI image prompt tool",
  ],
  openGraph: {
    title: "Free AI Prompt Fixer | VisualPromptAI",
    description:
      "Instantly fix and optimize your AI image prompts for any model. Free online tool.",
    url: "https://visualpromptai.com/fixer",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Prompt Fixer | VisualPromptAI",
    description:
      "Instantly fix and optimize your AI image prompts for any model.",
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

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt A/B Testing - Compare & Optimize Prompt Variations",
  description:
    "Compare two AI image prompt variations side by side. Optimize both with AI and pick the winner. Free A/B testing tool for Midjourney, DALL-E, Stable Diffusion, and more.",
  keywords: [
    "prompt A/B testing",
    "compare AI prompts",
    "prompt comparison tool",
    "AI prompt testing",
    "midjourney prompt comparison",
    "optimize prompt variations",
  ],
  openGraph: {
    title: "AI Prompt A/B Testing | VisualPromptAI",
    description:
      "Compare two AI image prompt variations side by side and pick the winner. Free tool.",
    url: "https://visualpromptai.com/ab-test",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt A/B Testing | VisualPromptAI",
    description:
      "Compare two AI image prompt variations side by side and pick the winner.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://visualpromptai.com/ab-test",
  },
};

export default function ABTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

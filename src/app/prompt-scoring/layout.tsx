import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free AI Prompt Scoring Tool — Rate Your Prompt | VisualPromptAI",
  description:
    "Score any AI image prompt instantly. Get a detailed quality analysis with 6 scoring criteria and actionable tips. Free prompt scorer for Midjourney, DALL-E, Stable Diffusion, Flux.",
  keywords:
    "prompt scoring, ai prompt analyzer, prompt quality checker, rate my prompt, ai prompt score, prompt evaluation tool, prompt grader",
  openGraph: {
    title: "Free AI Prompt Scoring Tool | VisualPromptAI",
    description:
      "Paste any prompt and get a quality score with tips. Free. No login.",
    url: "https://visualpromptai.com/prompt-scoring",
    siteName: "VisualPromptAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Prompt Scoring Tool",
    description:
      "Rate any AI image prompt. Get scores on clarity, creativity, technical accuracy + tips.",
  },
  alternates: {
    canonical: "https://visualpromptai.com/prompt-scoring",
  },
};

export default function PromptScoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

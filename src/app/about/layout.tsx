import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VisualPromptAI — Visual AI Prompt Engineering Platform",
  description:
    "Learn about VisualPromptAI, the visual prompt engineering platform for AI image generation. We help creators build, optimize, and test prompts for Midjourney, DALL-E, Stable Diffusion, Flux, and more.",
  openGraph: {
    title: "About VisualPromptAI",
    description:
      "Learn about VisualPromptAI, the visual prompt engineering platform for AI image generation.",
    url: "https://visualpromptai.com/about",
    type: "website",
  },
  alternates: {
    canonical: "https://visualpromptai.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

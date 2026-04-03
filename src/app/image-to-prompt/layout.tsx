import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image to Prompt AI Generator — No Login | VisualPromptAI",
  description:
    "Upload any image and instantly get an optimized AI prompt. Free image to prompt generator for Midjourney, DALL-E, Stable Diffusion, Flux, Grok. No login required.",
  keywords:
    "image to prompt, image to prompt ai, image to prompt generator, image to prompt free, ai image prompt generator, image to text prompt, reverse image to prompt, photo to prompt ai",
  openGraph: {
    title: "Free Image to Prompt AI Generator | VisualPromptAI",
    description:
      "Upload any image → Get an AI-optimized prompt. Free. No login. Works with Midjourney, DALL-E, Stable Diffusion, Flux & more.",
    url: "https://visualpromptai.com/image-to-prompt",
    siteName: "VisualPromptAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Prompt AI Generator",
    description:
      "Turn any image into an optimized AI prompt. Free, no login, works with all major AI models.",
  },
  alternates: {
    canonical: "https://visualpromptai.com/image-to-prompt",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageToPromptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

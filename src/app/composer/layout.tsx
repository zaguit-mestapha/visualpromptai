import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Prompt Composer - Drag & Drop AI Prompt Builder",
  description:
    "Build perfect AI image prompts visually. Drag and drop style, lighting, camera, and composition blocks to create prompts for Midjourney, DALL-E, Stable Diffusion, and Flux.",
  keywords: [
    "visual prompt builder",
    "drag drop prompt maker",
    "AI prompt composer",
    "midjourney prompt builder",
    "prompt block editor",
    "AI art prompt creator",
  ],
  openGraph: {
    title: "Visual Prompt Composer | VisualPromptAI",
    description:
      "Build perfect AI image prompts visually with drag-and-drop blocks. Free prompt builder.",
    url: "https://visualpromptai.com/composer",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Prompt Composer | VisualPromptAI",
    description:
      "Build perfect AI image prompts visually with drag-and-drop blocks.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://visualpromptai.com/composer",
  },
};

export default function ComposerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

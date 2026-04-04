import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | VisualPromptAI",
  description:
    "Get in touch with the VisualPromptAI team. Questions, feedback, partnerships — we'd love to hear from you.",
  openGraph: {
    title: "Contact Us | VisualPromptAI",
    description:
      "Get in touch with the VisualPromptAI team. Questions, feedback, partnerships — we'd love to hear from you.",
    url: "https://visualpromptai.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://visualpromptai.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VisualPromptAI",
  description:
    "VisualPromptAI privacy policy. Learn how we collect, use, and protect your data.",
  openGraph: {
    title: "Privacy Policy | VisualPromptAI",
    description: "Learn how we collect, use, and protect your data.",
    url: "https://visualpromptai.com/privacy",
    type: "website",
  },
  alternates: {
    canonical: "https://visualpromptai.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

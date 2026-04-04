import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | VisualPromptAI",
  description:
    "VisualPromptAI disclaimer. Information about the use of our AI-powered prompt engineering tools and services.",
  openGraph: {
    title: "Disclaimer | VisualPromptAI",
    description:
      "Information about the use of our AI-powered prompt engineering tools and services.",
    url: "https://visualpromptai.com/disclaimer",
    type: "website",
  },
  alternates: {
    canonical: "https://visualpromptai.com/disclaimer",
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

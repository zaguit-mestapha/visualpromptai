import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | VisualPromptAI",
  description:
    "VisualPromptAI terms of service. Read our terms and conditions for using the platform.",
  openGraph: {
    title: "Terms of Service | VisualPromptAI",
    description: "Read our terms and conditions for using the platform.",
    url: "https://visualpromptai.com/terms",
    type: "website",
  },
  alternates: {
    canonical: "https://visualpromptai.com/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

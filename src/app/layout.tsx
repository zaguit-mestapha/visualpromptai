import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://visualpromptai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VisualPromptAI — Free AI Prompt Builder & Image Prompt Generator",
    template: "%s | VisualPromptAI",
  },
  description:
    "Build, optimize, and test AI image prompts visually. Free prompt generator for Midjourney, DALL-E, Stable Diffusion, Flux & Grok. No login required.",
  keywords: [
    "ai prompt builder",
    "visual prompt ai",
    "prompt to image ai",
    "ai image prompt generator",
    "prompt generator free",
    "visual prompt builder",
    "midjourney prompt generator",
    "DALL-E prompt generator",
    "stable diffusion prompts",
    "flux prompt generator",
  ],
  authors: [{ name: "VisualPromptAI" }],
  creator: "VisualPromptAI",
  publisher: "VisualPromptAI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VisualPromptAI",
    title: "VisualPromptAI — Free AI Prompt Builder & Image Prompt Generator",
    description:
      "Build, optimize, and test AI image prompts visually. Free prompt generator for Midjourney, DALL-E, Stable Diffusion, Flux & Grok. No login required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisualPromptAI - Visual AI Prompt Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisualPromptAI — Free AI Prompt Builder & Image Prompt Generator",
    description:
      "Build, optimize, and test AI image prompts visually. Free prompt generator for Midjourney, DALL-E, Stable Diffusion, Flux & Grok. No login required.",
    images: ["/og-image.png"],
    creator: "@visualpromptai",
  },
  verification: {
    google: "S-WWXIzz6Hnou5zGKJH63H786IfMslBiGVRYk2oExMU",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

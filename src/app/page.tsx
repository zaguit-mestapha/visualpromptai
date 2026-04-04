import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

function JsonLd() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VisualPromptAI",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    url: "https://visualpromptai.com",
    description:
      "Visual prompt engineering platform for AI image generation. Build, optimize, and A/B test prompts for Midjourney, DALL-E, Stable Diffusion, and Flux.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier - 5 prompts per day",
      },
      {
        "@type": "Offer",
        price: "12",
        priceCurrency: "USD",
        description: "Pro tier - Unlimited prompts and full features",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Visual Prompt Composer",
      "AI Prompt Scoring",
      "Prompt A/B Testing",
      "Multi-Model Export (Midjourney, DALL-E, Stable Diffusion, Flux)",
      "Brand Kits",
      "Prompt Marketplace",
    ],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VisualPromptAI",
    url: "https://visualpromptai.com",
    description: "Visual AI prompt builder and optimizer for image generation",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://visualpromptai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

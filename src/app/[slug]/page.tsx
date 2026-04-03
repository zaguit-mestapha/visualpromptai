import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODEL_PAGES, getModelPageBySlug, CATEGORIES_LABEL } from "./data";
import PromptPageClient from "./PromptPageClient";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return MODEL_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = getModelPageBySlug(params.slug);
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    keywords: data.keywords,
    openGraph: {
      title: `${data.title} | VisualPromptAI`,
      description: data.metaDescription,
      url: `https://visualpromptai.com/${data.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | VisualPromptAI`,
      description: data.metaDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://visualpromptai.com/${data.slug}`,
    },
  };
}

export default function ModelPromptsPage({ params }: PageProps) {
  const data = getModelPageBySlug(params.slug);
  if (!data) notFound();

  const categoriesOrder = ["portraits", "landscapes", "products", "abstract", "cinematic"] as const;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.title,
    description: data.metaDescription,
    url: `https://visualpromptai.com/${data.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.prompts.length,
      itemListElement: data.prompts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${data.modelName} ${p.category} prompt`,
        description: p.text.slice(0, 150),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PromptPageClient
        modelName={data.modelName}
        slug={data.slug}
        intro={data.intro}
        features={data.features}
        prompts={data.prompts}
        categoriesOrder={categoriesOrder}
        categoriesLabel={CATEGORIES_LABEL}
      />
    </>
  );
}

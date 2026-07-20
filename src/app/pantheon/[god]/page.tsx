import { notFound } from "next/navigation";
import { GodView } from "@/views/god";
import { pantheonContent } from "@/data/mocks/pantheon";
import { storyContent } from "@/data/mocks/story";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

interface GodPageProps {
  params: Promise<{ god: string }>;
}

const { gods } = pantheonContent;

export function generateStaticParams() {
  return gods.map((god) => ({ god: god.slug }));
}

export async function generateMetadata({
  params,
}: GodPageProps): Promise<Metadata> {
  const { god: slug } = await params;
  const god = gods.find((g) => g.slug === slug);
  if (!god) return buildMetadata();
  return buildMetadata({
    title: `${god.name}, ${god.epithetEn} — The Pantheon`,
    description: `${god.blurbEn} Domain: ${god.domainEn}. ${god.worshipEn}`,
    url: `/pantheon/${god.slug}`,
    ogImage: god.portrait,
  });
}

export default async function GodPage({ params }: GodPageProps) {
  const { god: slug } = await params;
  const i = gods.findIndex((g) => g.slug === slug);
  const god = gods[i];
  const chapter = storyContent.chapters.find((c) => c.id === god?.chapterId);
  if (!god || !chapter) notFound();

  const prev = gods[(i - 1 + gods.length) % gods.length];
  const next = gods[(i + 1) % gods.length];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: god.name,
    alternateName: god.epithetEn,
    description: `${god.blurbEn} Domain: ${god.domainEn}.`,
    image: `${siteConfig.url}${god.portrait}`,
    url: `${siteConfig.url}/pantheon/${god.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GodView god={god} chapter={chapter} prev={prev} next={next} />
    </>
  );
}

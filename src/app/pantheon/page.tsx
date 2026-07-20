import { PantheonView } from "@/views/pantheon";
import { pantheonContent } from "@/data/mocks/pantheon";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";

export const metadata = generateMetadata({
  title: "The Pantheon — The Seven of the Drift",
  description:
    "Seven gods born of one Sundering: the Lantern, the Gambler, the Ember, the Sovereign, the Navigator, the Weaver, and the Harbinger. Read each god's origin, domain, and rites.",
  url: "/pantheon",
});

// ItemList of the seven gods, each pointing at its detail page.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "The Seven of the Drift",
  itemListElement: pantheonContent.gods.map((god, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${god.name}, ${god.epithetEn}`,
    url: `${siteConfig.url}/pantheon/${god.slug}`,
  })),
};

export default function PantheonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PantheonView content={pantheonContent} />
    </>
  );
}

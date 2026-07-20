import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { pantheonContent } from "@/data/mocks/pantheon";

/**
 * Generates `/sitemap.xml`. Lists the routes with real content (home, the
 * chronicle, the pantheon roster + one entry per god) — Coming-Soon stubs are
 * left out until they gain content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteConfig.url, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteConfig.url}/story`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/story/game`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/pantheon`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...pantheonContent.gods.map((god) => ({
      url: `${siteConfig.url}/pantheon/${god.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

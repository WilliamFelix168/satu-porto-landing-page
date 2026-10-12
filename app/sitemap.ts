import type { MetadataRoute } from "next";

import { buildSitemap, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig);
}

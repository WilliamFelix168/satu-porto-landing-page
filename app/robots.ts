import type { MetadataRoute } from "next";

import { buildRobots, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteConfig);
}

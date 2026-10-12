import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { buildRobots, buildSitemap, siteConfig } from "@/lib/site";

// The test run sets no NEXT_PUBLIC_SITE_* variables, like a preview build.
describe("robots.txt and sitemap routes", () => {
  it("disallow everything by default", () => {
    expect(siteConfig.isIndexable).toBe(false);
    expect(robots()).toEqual(buildRobots(siteConfig));
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("list the production landing page in the sitemap", () => {
    expect(sitemap()).toEqual(buildSitemap(siteConfig));
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://satuporto.biz.id",
    ]);
  });
});

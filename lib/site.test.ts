import { describe, expect, it } from "vitest";

import {
  buildRobots,
  canonicalUrl,
  buildRobotsMeta,
  buildSitemap,
  CONTENT_LAST_MODIFIED,
  INDEXABLE_FLAG,
  PRODUCTION_SITE_URL,
  resolveSiteConfig,
  SITEMAP_CHANGE_FREQUENCY,
  SITEMAP_PATH,
  SITEMAP_PRIORITY,
  type SiteConfig,
} from "@/lib/site";

/** How `URL` prints the production origin (with the root path). */
const PRODUCTION_HREF = "https://satuporto.biz.id/";
/** The one canonical form used in metadata, sitemap and JSON-LD. */
const PRODUCTION_CANONICAL = "https://satuporto.biz.id";

const indexable: SiteConfig = resolveSiteConfig({
  NEXT_PUBLIC_SITE_INDEXABLE: INDEXABLE_FLAG,
});
const preview: SiteConfig = resolveSiteConfig({});

describe("resolveSiteConfig", () => {
  it("defaults to the production URL and noindex", () => {
    expect(PRODUCTION_SITE_URL).toBe("https://satuporto.biz.id");
    expect(preview.url.toString()).toBe(PRODUCTION_HREF);
    expect(preview.isIndexable).toBe(false);
  });

  it("falls back to production when the URL is set but empty", () => {
    expect(resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: "" }).url.toString()).toBe(
      PRODUCTION_HREF,
    );
  });

  it.each([
    "satuporto.biz.id",
    "localhost:3000",
    "ftp://satuporto.biz.id",
    "not a url",
  ])("rejects NEXT_PUBLIC_SITE_URL=%j with a clear message", (value) => {
    expect(() => resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: value })).toThrow(
      `NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL such as ${PRODUCTION_SITE_URL}, got "${value}".`,
    );
  });

  it("uses NEXT_PUBLIC_SITE_URL when set", () => {
    const config = resolveSiteConfig({
      NEXT_PUBLIC_SITE_URL: "https://example.test",
    });
    expect(config.url.toString()).toBe("https://example.test/");
  });

  it.each(["", "false", "TRUE", "True", "1", "yes", " true"])(
    "stays noindex for NEXT_PUBLIC_SITE_INDEXABLE=%j",
    (value) => {
      expect(
        resolveSiteConfig({ NEXT_PUBLIC_SITE_INDEXABLE: value }).isIndexable,
      ).toBe(false);
    },
  );

  it('is indexable only for exactly "true"', () => {
    expect(INDEXABLE_FLAG).toBe("true");
    expect(indexable.isIndexable).toBe(true);
  });
});

describe("canonicalUrl", () => {
  it("drops the trailing slash so every surface uses one form", () => {
    expect(canonicalUrl(preview)).toBe(PRODUCTION_CANONICAL);
    expect(
      canonicalUrl(
        resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: "https://example.test/" }),
      ),
    ).toBe("https://example.test");
  });
});

describe("buildRobots", () => {
  it("blocks every crawler and lists no sitemap when not indexable", () => {
    expect(buildRobots(preview)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("allows every crawler and points at the sitemap when indexable", () => {
    expect(buildRobots(indexable)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `https://satuporto.biz.id${SITEMAP_PATH}`,
    });
  });
});

describe("buildRobotsMeta", () => {
  it("is noindex, nofollow when not indexable", () => {
    expect(buildRobotsMeta(preview)).toEqual({ index: false, follow: false });
  });

  it("is index, follow when indexable", () => {
    expect(buildRobotsMeta(indexable)).toEqual({ index: true, follow: true });
  });
});

describe("buildSitemap", () => {
  it("lists the one landing page with a fixed last-modified date", () => {
    expect(buildSitemap(preview)).toEqual([
      {
        url: PRODUCTION_CANONICAL,
        lastModified: CONTENT_LAST_MODIFIED,
        changeFrequency: SITEMAP_CHANGE_FREQUENCY,
        priority: SITEMAP_PRIORITY,
      },
    ]);
    expect(Number.isNaN(Date.parse(CONTENT_LAST_MODIFIED))).toBe(false);
  });
});

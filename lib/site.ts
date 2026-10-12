import type { Metadata, MetadataRoute } from "next";

/**
 * Deployment-level site settings, read from build-time environment variables
 * (`NEXT_PUBLIC_*` values are inlined when the app is built, so a Docker image
 * built without the indexing flag is always noindex).
 */

/** Canonical production URL, used unless `NEXT_PUBLIC_SITE_URL` says otherwise. */
export const PRODUCTION_SITE_URL = "https://satuporto.biz.id";
/** The only value of `NEXT_PUBLIC_SITE_INDEXABLE` that allows indexing. */
export const INDEXABLE_FLAG = "true";
/** The landing page itself; resolved against the site URL. */
export const HOME_PATH = "/";
/** The app icon (`app/icon.svg`, served by the Next.js icon convention). */
export const ICON_PATH = "/icon.svg";
/** Metadata / manifest category for the app. */
export const SITE_CATEGORY = "finance";
/** Google truncates longer titles in search results. */
export const TITLE_MAX_LENGTH = 60;
/** Google truncates longer meta descriptions in search results. */
export const DESCRIPTION_MAX_LENGTH = 155;
/** The landing page is the whole site, so it gets the top sitemap priority. */
export const SITEMAP_PRIORITY = 1;
/** Copy changes are occasional; crawlers need not check more often. */
export const SITEMAP_CHANGE_FREQUENCY = "monthly";
const TRAILING_SLASH = /\/$/;
/** URL schemes accepted for `NEXT_PUBLIC_SITE_URL`. */
const WEB_PROTOCOLS = ["https:", "http:"];
/** Path of the generated sitemap (`app/sitemap.ts`). */
export const SITEMAP_PATH = "/sitemap.xml";
/**
 * When the page content last changed meaningfully, for the sitemap. A fixed
 * date (not the build time) so rebuilding alone never claims fresh content.
 */
export const CONTENT_LAST_MODIFIED = "2026-10-12";

export interface SiteEnv {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SITE_INDEXABLE?: string;
}

export interface SiteConfig {
  /** Site URL (production by default). Previews may set their own host. */
  url: URL;
  /** Search engines may index the site (production only). */
  isIndexable: boolean;
}

/** Parses the site URL, failing the build with a clear message if invalid. */
function parseSiteUrl(value: string): URL {
  const invalid = new Error(
    `NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL such as ${PRODUCTION_SITE_URL}, got "${value}".`,
  );
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw invalid;
  }
  if (!WEB_PROTOCOLS.includes(url.protocol)) throw invalid;
  return url;
}

export function resolveSiteConfig(env: SiteEnv): SiteConfig {
  return {
    url: parseSiteUrl(env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL),
    isIndexable: env.NEXT_PUBLIC_SITE_INDEXABLE === INDEXABLE_FLAG,
  };
}

/**
 * The page's canonical URL in one form everywhere (metadata, sitemap,
 * JSON-LD): without a trailing slash, as Next.js prints the canonical link.
 */
export function canonicalUrl(config: SiteConfig): string {
  return new URL(HOME_PATH, config.url).href.replace(TRAILING_SLASH, "");
}

export const siteConfig = resolveSiteConfig({
  // Inlined at build time (next.config.ts `env`), never read at runtime.
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_INDEXABLE: process.env.NEXT_PUBLIC_SITE_INDEXABLE,
});

/** `robots.txt`: everything allowed plus the sitemap, or nothing at all. */
export function buildRobots(config: SiteConfig): MetadataRoute.Robots {
  if (!config.isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL(SITEMAP_PATH, config.url).toString(),
  };
}

/** The `robots` meta tag for the page. */
export function buildRobotsMeta(config: SiteConfig): Metadata["robots"] {
  return config.isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export function buildSitemap(config: SiteConfig): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrl(config),
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: SITEMAP_CHANGE_FREQUENCY,
      priority: SITEMAP_PRIORITY,
    },
  ];
}

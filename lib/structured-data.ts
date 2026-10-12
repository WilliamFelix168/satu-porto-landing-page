import { brand, faqContent, pricingContent, siteMetadata } from "@/lib/content";
import { DISPLAY_CURRENCY, DISPLAY_LOCALE } from "@/lib/format";
import { canonicalUrl, ICON_PATH, type SiteConfig } from "@/lib/site";

/** Fragment naming the organisation node, so other nodes can point at it. */
const ORGANIZATION_FRAGMENT = "#organization";

/**
 * JSON-LD for the page: who publishes it, the site, the app and the FAQ.
 * Deliberately no `aggregateRating` or reviews: there are none yet, and
 * inventing them is against Google's structured-data policy.
 */
export function buildStructuredData(config: SiteConfig) {
  const url = canonicalUrl(config);
  const organizationId = new URL(ORGANIZATION_FRAGMENT, config.url).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: brand.name,
        url,
        logo: new URL(ICON_PATH, config.url).toString(),
      },
      {
        "@type": "WebSite",
        name: brand.name,
        alternateName: brand.domain,
        url,
        inLanguage: DISPLAY_LOCALE,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        name: brand.name,
        url,
        description: siteMetadata.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: DISPLAY_LOCALE,
        offers: {
          "@type": "Offer",
          // schema.org wants the price as a string.
          price: String(pricingContent.plan.priceIdr),
          priceCurrency: DISPLAY_CURRENCY,
        },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "FAQPage",
        inLanguage: DISPLAY_LOCALE,
        mainEntity: faqContent.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/**
 * Serialises JSON-LD for a `<script>` tag: `<` is escaped so no value can
 * close the script element early.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

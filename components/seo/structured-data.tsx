import { siteConfig } from "@/lib/site";
import { buildStructuredData, serializeJsonLd } from "@/lib/structured-data";

/** Page-level JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage). */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Escaped by serializeJsonLd, so it cannot break out of the tag.
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildStructuredData(siteConfig)),
      }}
    />
  );
}

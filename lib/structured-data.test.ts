import { describe, expect, it } from "vitest";

import { brand, faqContent, pricingContent, siteMetadata } from "@/lib/content";
import { resolveSiteConfig } from "@/lib/site";
import { buildStructuredData, serializeJsonLd } from "@/lib/structured-data";

const config = resolveSiteConfig({});
const data = buildStructuredData(config);
const json = serializeJsonLd(data);

type Node = Record<string, unknown>;

function nodeOfType(type: string): Node {
  const node = (JSON.parse(json)["@graph"] as Node[]).find(
    (entry) => entry["@type"] === type,
  );
  if (!node) throw new Error(`No ${type} node`);
  return node;
}

describe("buildStructuredData", () => {
  it("serialises to valid schema.org JSON-LD", () => {
    const parsed = JSON.parse(json);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"].map((node: Node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "SoftwareApplication",
      "FAQPage",
    ]);
  });

  it("never claims ratings or reviews", () => {
    expect(json).not.toMatch(/aggregateRating|"review"|ratingValue/i);
  });

  it("uses the production URL for the organisation and site", () => {
    expect(nodeOfType("Organization")).toMatchObject({
      name: brand.name,
      url: "https://satuporto.biz.id",
      logo: "https://satuporto.biz.id/icon.svg",
    });
    expect(nodeOfType("WebSite")).toMatchObject({
      name: brand.name,
      alternateName: brand.domain,
      url: "https://satuporto.biz.id",
      inLanguage: "id-ID",
    });
  });

  it("describes a free, web-based finance app", () => {
    expect(nodeOfType("SoftwareApplication")).toMatchObject({
      name: brand.name,
      description: siteMetadata.description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        // Follows the pricing card, so a price change cannot desync.
        price: String(pricingContent.plan.priceIdr),
        priceCurrency: "IDR",
      },
    });
    expect(pricingContent.plan.priceIdr).toBe(0);
  });

  it("mirrors every FAQ question and answer", () => {
    expect(nodeOfType("FAQPage").mainEntity).toEqual(
      faqContent.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    );
  });

  it("follows the build's site URL", () => {
    const preview = buildStructuredData(
      resolveSiteConfig({ NEXT_PUBLIC_SITE_URL: "https://example.test" }),
    );
    const [organization, website] = preview["@graph"];

    expect(organization).toMatchObject({
      "@id": "https://example.test/#organization",
      url: "https://example.test",
      logo: "https://example.test/icon.svg",
    });
    expect(website).toMatchObject({ url: "https://example.test" });
  });

  it("links the site and app to the organisation by @id", () => {
    const organizationId = nodeOfType("Organization")["@id"];
    expect(organizationId).toBe("https://satuporto.biz.id/#organization");
    expect(nodeOfType("WebSite").publisher).toEqual({ "@id": organizationId });
    expect(nodeOfType("SoftwareApplication").publisher).toEqual({
      "@id": organizationId,
    });
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so a value cannot close the script tag", () => {
    const hostile = { text: "</script><script>alert(1)</script>" };
    const serialised = serializeJsonLd(hostile);

    expect(serialised).not.toContain("<");
    expect(serialised).not.toMatch(/<\/script/i);
    expect(JSON.parse(serialised)).toEqual(hostile);
  });

  it("leaves the page JSON-LD free of raw <", () => {
    expect(json).not.toContain("<");
  });
});

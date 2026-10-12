import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import RootLayout, { metadata, viewport } from "@/app/layout";
import { brand, siteMetadata } from "@/lib/content";
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "@/lib/site";
import { NO_SCRIPT_REVEAL_CSS, REVEAL_ATTRIBUTE } from "@/lib/motion";

vi.mock("next/font/google", () => {
  const font = () => ({ variable: "font-variable", className: "font" });
  return { Geist: font, Geist_Mono: font };
});

describe("RootLayout", () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <p>page</p>
    </RootLayout>,
  );

  it("shows scroll-reveal content to visitors without JavaScript", () => {
    const noscript = markup.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];

    expect(noscript).toContain(`[${REVEAL_ATTRIBUTE}]`);
    expect(noscript).toContain(NO_SCRIPT_REVEAL_CSS);
    expect(NO_SCRIPT_REVEAL_CSS).toContain("opacity:1!important");
  });

  it("renders a dark, Indonesian document around the page", () => {
    expect(markup).toMatch(/<html[^>]*lang="id"/);
    expect(markup).toMatch(/<html[^>]*class="[^"]*\bdark\b/);
    expect(markup).toContain("<p>page</p>");
  });
});

describe("metadata", () => {
  it("keeps the title and description within search-result limits", () => {
    expect(TITLE_MAX_LENGTH).toBe(60);
    expect(DESCRIPTION_MAX_LENGTH).toBe(155);
    expect(siteMetadata.title.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH);
    expect(siteMetadata.description.length).toBeLessThanOrEqual(
      DESCRIPTION_MAX_LENGTH,
    );
    expect(metadata.title).toBe(siteMetadata.title);
    expect(metadata.description).toBe(siteMetadata.description);
  });

  it("leads with the brand and the primary keywords", () => {
    expect(siteMetadata.title).toMatch(new RegExp(`^${brand.name}`));
    expect(siteMetadata.title).toMatch(/portfolio saham, kripto/i);
    expect(siteMetadata.description).toMatch(/catat pengeluaran/i);
    expect(siteMetadata.description).toMatch(/net worth/i);
  });

  it("uses the production URL, without a trailing slash, as canonical", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://satuporto.biz.id/");
    expect(metadata.alternates?.canonical).toBe("https://satuporto.biz.id");
  });

  it("declares Indonesian Open Graph metadata", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "https://satuporto.biz.id",
      locale: "id_ID",
      siteName: brand.name,
      title: siteMetadata.title,
      description: siteMetadata.description,
    });
  });

  it("uses a large-image Twitter card", () => {
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: siteMetadata.title,
      description: siteMetadata.description,
    });
  });

  it("is noindex, nofollow unless the build opts in", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("names the app, its category and its publisher", () => {
    expect(metadata).toMatchObject({
      applicationName: brand.name,
      category: "finance",
      creator: brand.name,
      publisher: brand.name,
      formatDetection: { telephone: false, email: false, address: false },
    });
    expect(metadata.keywords).toEqual([...siteMetadata.keywords]);
    expect(metadata.authors).toEqual([
      { name: brand.name, url: "https://satuporto.biz.id" },
    ]);
  });
});

describe("viewport", () => {
  it("colours the browser chrome like the page", () => {
    expect(viewport.themeColor).toBe(siteMetadata.themeColor);
  });
});

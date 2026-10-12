import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";
import { brand, siteMetadata } from "@/lib/content";

describe("web app manifest", () => {
  const result = manifest();

  it("names the app and describes it in Indonesian", () => {
    expect(result).toMatchObject({
      name: brand.name,
      short_name: brand.name,
      description: siteMetadata.description,
      lang: "id",
    });
  });

  it("starts on the landing page as a standalone app", () => {
    expect(result).toMatchObject({
      id: "/",
      start_url: "/",
      display: "standalone",
      categories: ["finance"],
    });
  });

  it("uses the black page background for the browser chrome", () => {
    expect(result.theme_color).toBe(siteMetadata.themeColor);
    expect(result.background_color).toBe(siteMetadata.themeColor);
  });

  it("points at the SVG app icon", () => {
    expect(result.icons).toEqual([
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ]);
  });
});

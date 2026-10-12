// @vitest-environment node
import { describe, expect, it } from "vitest";

import OpenGraphImage, * as openGraph from "@/app/opengraph-image";
import { siteMetadata } from "@/lib/content";
import {
  OG_IMAGE_CACHE_CONTROL,
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "@/lib/og-image";

/** The eight bytes every PNG file starts with. */
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
/** Width and height sit at these byte offsets of the PNG IHDR chunk. */
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;
/** Rendering loads WebAssembly and fonts; allow more than the default. */
const RENDER_TIMEOUT_MS = 30_000;

describe("opengraph-image (also used by X via og:image)", () => {
  it("declares the 1200x630 PNG size and Indonesian alt text", () => {
    expect(openGraph.size).toEqual({ width: 1200, height: 630 });
    expect(openGraph.size).toBe(OG_IMAGE_SIZE);
    expect(openGraph.contentType).toBe(OG_IMAGE_CONTENT_TYPE);
    expect(openGraph.alt).toBe(siteMetadata.ogImageAlt);
  });

  it(
    "renders a PNG of that size offline, from the vendored fonts",
    async () => {
      const response = await OpenGraphImage();
      const bytes = new Uint8Array(await response.arrayBuffer());
      const view = new DataView(bytes.buffer);

      expect(response.headers.get("content-type")).toBe(OG_IMAGE_CONTENT_TYPE);
      expect([...bytes.slice(0, PNG_SIGNATURE.length)]).toEqual(PNG_SIGNATURE);
      expect(view.getUint32(PNG_WIDTH_OFFSET)).toBe(OG_IMAGE_SIZE.width);
      expect(view.getUint32(PNG_HEIGHT_OFFSET)).toBe(OG_IMAGE_SIZE.height);
    },
    RENDER_TIMEOUT_MS,
  );

  it(
    "is cached for a day, not as an immutable asset",
    async () => {
      const response = await OpenGraphImage();

      expect(OG_IMAGE_CACHE_CONTROL).toBe(
        "public, max-age=86400, stale-while-revalidate=604800",
      );
      expect(response.headers.get("cache-control")).toBe(
        OG_IMAGE_CACHE_CONTROL,
      );
      expect(response.headers.get("cache-control")).not.toMatch(/immutable/);
    },
    RENDER_TIMEOUT_MS,
  );
});

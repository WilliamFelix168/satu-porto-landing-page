import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { brand, heroContent, siteMetadata } from "@/lib/content";

/** Open Graph / Twitter card size recommended by both platforms. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";
/**
 * One day fresh, then served stale for up to a week while it revalidates.
 * Not `immutable`: the image URL's hash only tracks the route file, so copy
 * changes (headline, tagline) must still reach crawlers.
 */
export const OG_IMAGE_CACHE_CONTROL =
  "public, max-age=86400, stale-while-revalidate=604800";

/** Brand colours, matching the page (emerald and indigo on black). */
const COLORS = {
  background: "#000000",
  text: "#ffffff",
  muted: "#a1a1aa",
  emerald: "#34d399",
  teal: "#99f6e4",
  indigo: "#818cf8",
  emeraldGlow: "rgba(16, 185, 129, 0.35)",
  indigoGlow: "rgba(99, 102, 241, 0.3)",
} as const;

/** Type sizes and spacing, in pixels of the 1200×630 canvas. */
const LAYOUT = {
  padding: 80,
  wordmarkSize: 40,
  wordmarkTracking: -1,
  headlineTracking: -3,
  headlineLineHeight: 1.05,
  headlineSize: 76,
  taglineSize: 32,
  gap: 28,
  /** Space between the headline lead and its gradient highlight. */
  wordGap: 20,
} as const;

/**
 * Fonts are read from the repo (not fetched), so the image renders inside
 * the offline, standalone Docker build. Geist is licensed under the OFL
 * (assets/fonts/OFL.txt).
 */
async function loadFonts() {
  const directory = join(process.cwd(), "assets", "fonts");
  const [bold, regular] = await Promise.all([
    readFile(join(directory, "Geist-Bold.ttf")),
    readFile(join(directory, "Geist-Regular.ttf")),
  ]);
  return [
    {
      name: "Geist",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

const SPACE = / /g;
const NO_BREAK_SPACE = "\u00A0";

/**
 * Joins a line's words with no-break spaces. Satori sizes each word before
 * kerning but draws it kerned, which leaves visible gaps after tightly
 * kerned words ("Portfolio", "Dashboard"); one unbroken run is measured and
 * drawn the same way. Each line (headline lines, tagline) is short enough not to need wrapping.
 */
function asOneRun(text: string): string {
  return text.replace(SPACE, NO_BREAK_SPACE);
}

/** The social card: wordmark, the hero headline and a tagline, on black. */
export async function renderOgImage() {
  const { lead, highlight, trail } = heroContent.headline;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: LAYOUT.padding,
        background: `radial-gradient(circle at 15% 0%, ${COLORS.emeraldGlow}, transparent 55%), radial-gradient(circle at 100% 100%, ${COLORS.indigoGlow}, transparent 55%), ${COLORS.background}`,
        color: COLORS.text,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: LAYOUT.wordmarkSize,
          fontWeight: 700,
          letterSpacing: LAYOUT.wordmarkTracking,
        }}
      >
        {brand.name}
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: LAYOUT.gap }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: LAYOUT.headlineSize,
            fontWeight: 700,
            letterSpacing: LAYOUT.headlineTracking,
            lineHeight: LAYOUT.headlineLineHeight,
          }}
        >
          <span style={{ marginRight: LAYOUT.wordGap }}>{asOneRun(lead)}</span>
          {/* The trailing period shares the gradient run: a separate element
              would be offset by the same satori measuring gap. */}
          <span
            style={{
              backgroundImage: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.teal}, ${COLORS.indigo})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {asOneRun(`${highlight}${trail}`)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: LAYOUT.taglineSize,
            color: COLORS.muted,
          }}
        >
          {asOneRun(siteMetadata.ogImageTagline)}
        </div>
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts: await loadFonts(),
      headers: { "Cache-Control": OG_IMAGE_CACHE_CONTROL },
    },
  );
}

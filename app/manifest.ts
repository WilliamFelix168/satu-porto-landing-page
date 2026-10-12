import type { MetadataRoute } from "next";

import { brand, siteMetadata } from "@/lib/content";
import { HOME_PATH, ICON_PATH, SITE_CATEGORY } from "@/lib/site";

/** Any size: the icon is an SVG. */
const SVG_ICON_SIZES = "any";
const SVG_MIME_TYPE = "image/svg+xml";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: HOME_PATH,
    name: brand.name,
    short_name: brand.name,
    description: siteMetadata.description,
    lang: siteMetadata.language,
    start_url: HOME_PATH,
    display: "standalone",
    background_color: siteMetadata.themeColor,
    theme_color: siteMetadata.themeColor,
    categories: [SITE_CATEGORY],
    icons: [{ src: ICON_PATH, sizes: SVG_ICON_SIZES, type: SVG_MIME_TYPE }],
  };
}

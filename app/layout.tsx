import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { MotionProvider } from "@/components/landing/motion";
import { brand, siteMetadata } from "@/lib/content";
import { NO_SCRIPT_REVEAL_CSS } from "@/lib/motion";
import {
  buildRobotsMeta,
  canonicalUrl,
  SITE_CATEGORY,
  siteConfig,
} from "@/lib/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = canonicalUrl(siteConfig);
const publisher = { name: brand.name, url: siteUrl };

export const metadata: Metadata = {
  // Canonical and social URLs use the build's site URL (production by
  // default), in the same no-trailing-slash form as the sitemap and JSON-LD.
  metadataBase: siteConfig.url,
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  applicationName: brand.name,
  category: SITE_CATEGORY,
  authors: [publisher],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: siteUrl },
  // Indexing is opt-in per build (NEXT_PUBLIC_SITE_INDEXABLE), so previews
  // stay out of search results.
  robots: buildRobotsMeta(siteConfig),
  // The icon comes from app/icon.svg and the share image from
  // app/opengraph-image.tsx (file conventions). X falls back to og:image.
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brand.name,
    title: siteMetadata.title,
    description: siteMetadata.description,
    locale: siteMetadata.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};

export const viewport: Viewport = {
  themeColor: siteMetadata.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang={siteMetadata.language}
      // Lets Next.js turn smooth scrolling off during route transitions.
      data-scroll-behavior="smooth"
      className={cn(geistSans.variable, geistMono.variable, "dark antialiased")}
    >
      <head>
        <noscript>
          <style>{NO_SCRIPT_REVEAL_CSS}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

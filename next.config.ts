import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  // Always inline the site settings at build time, even when unset: Next.js
  // only inlines NEXT_PUBLIC_* keys present during the build, and server code
  // would otherwise read them from the runtime environment.
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    NEXT_PUBLIC_SITE_INDEXABLE: process.env.NEXT_PUBLIC_SITE_INDEXABLE ?? "",
  },
  // The social-card route reads the vendored Geist fonts from disk.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**/*"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Keep `next dev` from writing generated instruction files into the project.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

# SatuPorto landing page

Waitlist landing page for SatuPorto (production: https://satuporto.biz.id), a
single dashboard for crypto and stock portfolios plus daily expenses. Dark
only, built with Next.js (App Router), Tailwind CSS v4, shadcn/ui, `motion`
and `lucide-react`.

The site copy is in Indonesian (`<html lang="id">`, Open Graph `id_ID`), in
the informal "kamu" voice. Product terms such as portfolio, net worth, early
access, dashboard, insight and SatuPorto AI stay in English. This README and
the code stay in English.

## Setup

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev   # http://localhost:3000
```

## Scripts

| Script                 | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)                              |
| `npm run build`        | Production build (`output: "standalone"`)                     |
| `npm run start`        | Serve the production build                                    |
| `npm run lint`         | ESLint (Next.js core web vitals + TypeScript)                 |
| `npm run typecheck`    | `next typegen && tsc --noEmit` (route types, then TypeScript) |
| `npm test`             | Vitest + Testing Library, single run                          |
| `npm run test:watch`   | Vitest in watch mode                                          |
| `npm run format`       | Prettier, write changes                                       |
| `npm run format:check` | Prettier, check only                                          |

## Structure

```
app/
  layout.tsx            Geist fonts, dark <html lang="id">, SEO metadata
  page.tsx              composes the sections and the JSON-LD
  robots.ts, sitemap.ts, manifest.ts   generated /robots.txt, /sitemap.xml,
                        /manifest.webmanifest
  opengraph-image.tsx   1200x630 share card (next/og); X falls back to it
  icon.svg              app icon
  globals.css           Tailwind v4 theme tokens; glow, grid, fade, shimmer-border and
                        torn-edge utilities; marquee, hero-rise and shimmer keyframes
components/
  ui/                   shadcn primitives (button, input, badge)
  landing/              one file per section or shared piece:
    navbar, hero, dashboard-preview, asset-marquee, features-bento,
    ai-section, how-it-works, pricing, faq-section, cta-section,
    footer                                                    sections
    waitlist-form, waitlist-link                             waitlist capture (shared)
    glass-card, gradient-border-panel, feature-card, feature-visuals,
    feature-visual-panel, three-up-grid, decorative-visual, mock-chip,
    icon-tile, ticker-badge, change-pill, legend-dot, check-badge,
    pop-check, live-dot, fill-segment, placeholder-lines, glow,
    sparkline, scan-beam (+ StepZeroScan), typing-dots, shimmer-pill,
    gradient-text, section-heading, landing-section, nav-link-list,
    pausable-marquee, hero-entrance, logo, button-styles, motion   shared building blocks
    dashboard/            live hero dashboard (count-up, growing bars, price ticks)
    bento/                animated feature-card visuals (asset sync, expense log,
                          net-worth split), all inside the shared FeatureVisualPanel
    steps/                How it works mini visuals
    ai/                   AI showcase rows and their animated visuals
                          (snap-import, receipt-scan, insights, allocation-donut,
                          detected-field, ai-feature-row)
lib/
  content.ts            all copy and mock data, typed
  motion.ts             animation variants and named timing constants
  ai-showcase-motion.ts timing constants for the AI showcase sequences
  dashboard-motion.ts   hero dashboard timings; card-motion.ts: card visual timings
  dashboard-display.ts, card-display.ts, ai-showcase-display.ts
                        server-side pre-formatted values (no Intl in the browser)
  count-up.ts           pre-formatted count-up frames
  use-count-up.ts, use-loop-index.ts, use-live-dashboard.ts, use-is-animating.ts
  use-showcase-cycle.ts in-view, looping step sequence (finished state when idle)
  use-prefers-reduced-motion.ts  hydration-safe reduced-motion preference
  waitlist.ts           pure email validation (no network)
  format.ts             IDR and percent formatting (id-ID locale); server only
  scale.ts              dependency-free 0 to 100 scale constant (safe in client code)
  utils.ts              `cn` class helper
  site.ts               site URL + indexing flag from env; robots, robots meta
                        and sitemap builders (pure, tested)
  structured-data.ts    JSON-LD graph (Organization, WebSite,
                        SoftwareApplication, FAQPage) and safe serialiser
  og-image.tsx          share-card renderer used by both image routes
components/seo/
  structured-data.tsx   <script type="application/ld+json"> for the page
assets/fonts/           Geist TTFs for the share cards (read from disk, so the
                        build needs no network; SIL OFL, see OFL.txt)
test/
  setup.tsx             jest-dom matchers, `motion/react` mocked to plain elements
  animation-frames.ts   queue `requestAnimationFrame` callbacks and flush them by hand
  media-query.ts        stub `window.matchMedia` (e.g. reduced motion)
  animated-visual-suite.tsx  shared contract tests for every looping visual
  client-boundaries.test.ts  client components never import Intl formatting
  brand.test.ts         no retired product name or pre-.biz domain in
                        source, tests or project docs
  source-files.ts       shared source-file walker for the two guards above
```

Copy lives in `lib/content.ts`; components only render it. Every timing,
offset and amplitude is a named constant: page entrances and reveals in
`lib/motion.ts`, the AI showcase in `lib/ai-showcase-motion.ts`, the hero
dashboard in `lib/dashboard-motion.ts` and the card visuals in
`lib/card-motion.ts`. Rupiah amounts are formatted on the server
(`*-display.ts`) and reach client components as plain strings.

## Motion and accessibility

- The hero rises in with the CSS "hero-rise" keyframe, so it plays on
  first paint and is never hidden waiting for JavaScript.
- Below the fold, sections fade in up with `motion` `whileInView` (once).
  Those elements are server-rendered hidden and appear after hydration as
  they scroll into view; without JavaScript, a `<noscript>` style in the root
  layout shows every `[data-reveal]` element straight away.
- `MotionProvider` (`MotionConfig reducedMotion="user"`) drops movement for
  visitors who prefer reduced motion; CSS animations use `motion-safe:`.
- The asset ticker pauses while hovered and has a pause/play toggle.
- The hero dashboard, the feature-card visuals, the How it works steps and
  the AI showcase play short sequences while they are in view, loop gently
  and stop when off screen (the hero dashboard also floats only while in
  view). Their markup is always rendered in the finished state (server
  output, no JavaScript, reduced motion); below the fold, the panels
  themselves are revealed on scroll.

## SatuPorto AI copy

The AI section describes information and savings opportunities only. Keep it
that way (OJK): no investment advice, buy/sell recommendations or promised
returns. The disclaimer under the section must stay.

## SEO

All SEO copy lives in `siteMetadata` and `faqContent` in `lib/content.ts`.
Tests keep the title within `TITLE_MAX_LENGTH` (60) and the description
within `DESCRIPTION_MAX_LENGTH` (155) characters, both in `lib/site.ts`.
Visible copy spells "impor" (KBBI); the English "import" appears only in the
search keywords.

| Keyword (Indonesian)                           | Where it appears                                   |
| ---------------------------------------------- | -------------------------------------------------- |
| aplikasi keuangan pribadi                      | hero subheadline (first words), FAQ, keywords      |
| aplikasi pencatat keuangan / catat pengeluaran | features H2, feature card, description             |
| tracker portfolio saham dan kripto             | title, H1, feature card, FAQ                       |
| aplikasi pantau investasi                      | features H2 ("pantau investasi"), keywords         |
| cek net worth / kekayaan bersih                | feature card "Cek Net Worth Kamu", description     |
| catat pengeluaran otomatis dari struk          | AI section description, receipt-scan feature       |
| import / impor portfolio dari screenshot       | keywords ("import"); AI description, FAQ ("impor") |
| pantau saham IDX dan kripto                    | hero subheadline, FAQ                              |

### Environment

| Variable                     | Default                    | Meaning                                                     |
| ---------------------------- | -------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | `https://satuporto.biz.id` | Canonical URL for metadata, Open Graph, sitemap and JSON-LD |
| `NEXT_PUBLIC_SITE_INDEXABLE` | unset (noindex)            | Only the exact value `true` allows indexing                 |

Both are build-time only: `next.config.ts` inlines them into the build (also
when unset), so pass them as Docker build args and rebuild to change them;
setting them on a running container has no effect. The site URL defaults to
production; a preview build may set its own host so link previews work.
Without the flag the page sends `noindex, nofollow` and `/robots.txt` is
`Disallow: /`, so preview deployments never get indexed. An invalid site URL
(for example one without `https://`) fails the build with a clear message.

### Production deployment / handover

Indexing is switched on only for the client's own production deployment on
satuporto.biz.id. Preview deployments stay noindex.

1. Build with `NEXT_PUBLIC_SITE_URL=https://satuporto.biz.id` and
   `NEXT_PUBLIC_SITE_INDEXABLE=true`, for example
   `docker build --build-arg NEXT_PUBLIC_SITE_URL=https://satuporto.biz.id --build-arg NEXT_PUBLIC_SITE_INDEXABLE=true -t satuporto .`
   The values are baked in during the build, so changing them needs a rebuild.
2. Check that `https://satuporto.biz.id/robots.txt` allows crawling and lists
   the sitemap, and that the page has no `noindex` robots meta tag.
3. Submit `https://satuporto.biz.id/sitemap.xml` in Google Search Console.
4. Check the share preview (Open Graph image, title and description) with a
   share debugger such as the Facebook Sharing Debugger or LinkedIn Post
   Inspector.

## Waitlist

The forms validate on the client (`lib/waitlist.ts`) and show a success state.
Nothing is sent anywhere yet: `WaitlistForm` takes an optional
`onJoin(email): Promise<void>` prop to plug a backend in later.

## Docker

`Dockerfile` builds a three-stage `node:22-alpine` image from the standalone
output and runs `node server.js` on port 3000 as the `node` user.

```bash
docker build -t satuporto .
docker run --rm -p 3000:3000 satuporto
```

## Notes

- `next.config.ts` sets `agentRules: false` so `next dev` does not write
  generated instruction files into the project.

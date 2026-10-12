import type { JSX } from "react";

import { InsightsVisual } from "@/components/landing/ai/insights-visual";
import { ReceiptScanVisual } from "@/components/landing/ai/receipt-scan-visual";
import { SnapImportVisual } from "@/components/landing/ai/snap-import-visual";
import { CheckBadge } from "@/components/landing/check-badge";
import { GlowTone } from "@/components/landing/glow";
import {
  GradientBorderPanel,
  PanelGlow,
} from "@/components/landing/gradient-border-panel";
import { IconTile } from "@/components/landing/icon-tile";
import { Reveal } from "@/components/landing/motion";
import {
  getReceiptScanDisplay,
  getSnapImportDisplay,
} from "@/lib/ai-showcase-display";
import { AiVisual, type AiFeature } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Rendered here, on the server, so rupiah amounts are formatted once and
 * passed to the client visuals as plain strings.
 */
const visuals: Record<AiVisual, () => JSX.Element> = {
  [AiVisual.SnapImport]: () => (
    <SnapImportVisual display={getSnapImportDisplay()} />
  ),
  [AiVisual.ReceiptScan]: () => (
    <ReceiptScanVisual display={getReceiptScanDisplay()} />
  ),
  [AiVisual.Insights]: () => <InsightsVisual />,
};

/** Alternate glow colours so neighbouring rows don't look identical. */
const glowTones = [GlowTone.Emerald, GlowTone.Indigo] as const;
/** Rows alternate between two layouts: copy first, then visual first. */
const LAYOUT_COUNT = 2;

interface AiFeatureRowProps {
  feature: AiFeature;
  /** Position in the list; odd rows put the visual on the left from `lg`. */
  index: number;
}

/**
 * One showcase row: copy (icon, title, description, benefits) beside a large
 * animated visual. Stacked on small screens, a split from `lg`.
 */
export function AiFeatureRow({ feature, index }: AiFeatureRowProps) {
  const Icon = feature.icon;
  const Visual = visuals[feature.visual];
  const isReversed = index % LAYOUT_COUNT === 1;

  return (
    <li className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal className={cn("lg:col-span-5", isReversed && "lg:order-last")}>
        <IconTile className="text-emerald-300">
          <Icon aria-hidden="true" className="size-5" />
        </IconTile>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-base text-pretty text-zinc-400 sm:text-lg">
          {feature.description}
        </p>
        <ul className="mt-6 space-y-3">
          {feature.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-sm text-zinc-300"
            >
              <CheckBadge className="mt-0.5" />
              {bullet}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* The glow stays outside the fading reveal so its blur is never clipped. */}
      <div className="relative isolate min-w-0 lg:col-span-7">
        <PanelGlow tone={glowTones[index % glowTones.length]} />
        <Reveal>
          <GradientBorderPanel>
            <Visual />
          </GradientBorderPanel>
        </Reveal>
      </div>
    </li>
  );
}

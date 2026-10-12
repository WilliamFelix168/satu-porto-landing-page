"use client";

import { Camera } from "lucide-react";
import { useRef } from "react";

import { FeatureVisualPanel } from "@/components/landing/feature-visual-panel";
import { LiveDot } from "@/components/landing/live-dot";
import { MockChip, MockChipTone } from "@/components/landing/mock-chip";
import { StepZeroScan } from "@/components/landing/scan-beam";
import { Sparkline } from "@/components/landing/sparkline";
import { TickerBadge } from "@/components/landing/ticker-badge";
import type { AssetSyncDisplay } from "@/lib/card-display";
import { ASSET_SYNC_STEP_MS, VISIBLE_TICKER_CHIPS } from "@/lib/card-motion";
import { featuresContent as features } from "@/lib/content";
import { PERCENT_SCALE_MAX } from "@/lib/scale";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const SYMBOLS = features.assetSyncSymbols;
const SHOWN_SYMBOLS = SYMBOLS.slice(0, VISIBLE_TICKER_CHIPS);
const SERIES = [...features.assetSyncTrend, ...features.assetSyncExtension];
const WINDOW_LENGTH = features.assetSyncTrend.length;
/** Number of distinct chart windows the loop slides through. */
const WINDOW_COUNT = features.assetSyncExtension.length + 1;
/**
 * Step 1 draws the chart, each following step syncs one ticker badge, and a
 * last step settles with every badge synced (none highlighted).
 */
const CHART_STEP = 1;
const SETTLE_STEPS = 1;
export const ASSET_SYNC_STEP_COUNT =
  CHART_STEP + SHOWN_SYMBOLS.length + SETTLE_STEPS;

/** Tickers shown in the compact tier (the rest collapse into "+N"). */
const COMPACT_TICKERS = 1;

/**
 * How many ticker badges fit beside the import chip, chosen from the panel's
 * own width (a container query on `FeatureVisualPanel`), not the viewport:
 * the panel is narrowest in the three-column layout and on small phones.
 * The chip is about 8.5rem wide and each badge 2rem plus a 0.25rem gap, so:
 * - full (two tickers and "+6") needs about 15.5rem,
 * - compact (one ticker and "+7") about 13.25rem,
 * - below that only "+8" is shown.
 * Tailwind needs these as literal class names.
 */
const TICKER_TIER_CLASS_NAMES = {
  full: "hidden @min-[15.5rem]:flex",
  fromCompact: "hidden @min-[13.25rem]:flex",
  compactOnly: "hidden @min-[13.25rem]:flex @min-[15.5rem]:hidden",
  minimalOnly: "@min-[13.25rem]:hidden",
} as const;

/** The chart series `offset` points along, rescaled to its own peak. */
export function chartWindow(offset: number): number[] {
  const series = SERIES.slice(offset, offset + WINDOW_LENGTH);
  const peak = Math.max(...series);
  return series.map((value) => (value / peak) * PERCENT_SCALE_MAX);
}

/**
 * Multi-Asset card: value and live-sync header, a chart that draws in once
 * and then glides one point along each loop, and a footer where the import
 * chip gets a quick scan and the ticker badges sync one at a time.
 */
export function AssetSyncVisual({ display }: { display: AssetSyncDisplay }) {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: ASSET_SYNC_STEP_COUNT,
    stepMs: ASSET_SYNC_STEP_MS,
  });
  const windowOffset = isPlaying ? cycle % WINDOW_COUNT : 0;
  // Drawn once per visit; later loops keep the line and glide it along.
  const isChartDrawn = step >= CHART_STEP || cycle > 0;
  // One badge glows while it syncs; none once the sequence is complete.
  const syncingIndex = isPlaying ? step - CHART_STEP - 1 : -1;

  return (
    <div ref={ref}>
      <FeatureVisualPanel>
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">
              {features.assetSyncValueLabel}
            </p>
            <p className="truncate text-base font-semibold tracking-tight text-white tabular-nums">
              {display.portfolioValue}
            </p>
          </div>
          <MockChip tone={MockChipTone.Emerald} className="ml-auto shrink-0">
            <LiveDot isPulsing={isPlaying} />
            {features.assetSyncLabel}
          </MockChip>
        </div>

        <Sparkline
          values={chartWindow(windowOffset)}
          isDrawn={isChartDrawn}
          className="min-h-32 flex-1"
        />

        <div className="flex items-center justify-between gap-2">
          <MockChip
            tone={MockChipTone.Indigo}
            className="relative shrink-0 overflow-clip"
          >
            <Camera aria-hidden="true" className="size-3.5" />
            {features.screenshotImportLabel}
            {isPlaying && step < CHART_STEP ? (
              <StepZeroScan cycle={cycle} />
            ) : null}
          </MockChip>
          <span className="flex min-w-0 shrink justify-end gap-1">
            {SHOWN_SYMBOLS.map((symbol, index) => (
              <TickerBadge
                key={symbol}
                label={symbol}
                isActive={index === syncingIndex}
                className={
                  index === 0
                    ? TICKER_TIER_CLASS_NAMES.fromCompact
                    : TICKER_TIER_CLASS_NAMES.full
                }
              />
            ))}
            <TickerBadge
              label={`+${SYMBOLS.length - SHOWN_SYMBOLS.length}`}
              className={TICKER_TIER_CLASS_NAMES.full}
            />
            <TickerBadge
              label={`+${SYMBOLS.length - COMPACT_TICKERS}`}
              className={TICKER_TIER_CLASS_NAMES.compactOnly}
            />
            <TickerBadge
              label={`+${SYMBOLS.length}`}
              className={TICKER_TIER_CLASS_NAMES.minimalOnly}
            />
          </span>
        </div>
      </FeatureVisualPanel>
    </div>
  );
}

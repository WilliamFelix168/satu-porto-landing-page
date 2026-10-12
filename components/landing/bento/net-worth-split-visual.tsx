"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { ChangePill, ChangePillSize } from "@/components/landing/change-pill";
import { CheckBadge } from "@/components/landing/check-badge";
import { FeatureVisualPanel } from "@/components/landing/feature-visual-panel";
import { FillSegment } from "@/components/landing/fill-segment";
import { LegendDot } from "@/components/landing/legend-dot";
import { Sparkline } from "@/components/landing/sparkline";
import { showcaseReveal } from "@/lib/ai-showcase-motion";
import type { NetWorthSplitDisplay } from "@/lib/card-display";
import {
  NET_WORTH_COUNT_UP_STEP_MS,
  NET_WORTH_SPLIT_STEP_MS,
} from "@/lib/card-motion";
import { dashboardContent, featuresContent as features } from "@/lib/content";
import { PERCENT_SCALE_MAX } from "@/lib/scale";
import { useCountUp } from "@/lib/use-count-up";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

/** Chart and owned fill, then spent fill, then the "updated" tick. */
export enum SplitStep {
  Owned = 1,
  Spent,
  Updated,
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
      <p className="truncate text-2xs text-zinc-400">{label}</p>
      <p className="truncate text-xs font-semibold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

/**
 * Unified Net Worth card: the figure counts up beside its monthly change,
 * the owned/spent bar fills, two stat tiles, a trend line that draws in, and
 * an "updated just now" tick.
 */
export function NetWorthSplitVisual({
  display,
}: {
  display: NetWorthSplitDisplay;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: SplitStep.Updated,
    stepMs: NET_WORTH_SPLIT_STEP_MS,
  });
  const netWorth = useCountUp(display.netWorthCountUp, {
    isActive: isPlaying,
    stepMs: NET_WORTH_COUNT_UP_STEP_MS,
    restartKey: cycle,
  });
  const split = features.netWorthSplit;

  return (
    <div ref={ref}>
      <FeatureVisualPanel>
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-400">{split.figureLabel}</p>
            <ChangePill
              value={display.monthlyChange}
              isGain={display.isMonthlyGain}
              suffix={dashboardContent.netWorthChangeLabel}
              size={ChangePillSize.Small}
            />
          </div>
          <p className="mt-1 truncate text-xl font-semibold tracking-tight text-white tabular-nums">
            {netWorth.text}
          </p>
        </div>

        <div>
          <div className="flex h-2 gap-0.5 overflow-clip rounded-full bg-white/[0.06]">
            <FillSegment
              percent={split.ownedPercent}
              isFilled={step >= SplitStep.Owned}
              className="bg-gradient-to-r from-emerald-400 to-emerald-300"
            />
            <FillSegment
              percent={PERCENT_SCALE_MAX - split.ownedPercent}
              isFilled={step >= SplitStep.Spent}
              className="bg-indigo-400"
            />
          </div>
          <div className="mt-2 flex justify-between text-2xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <LegendDot className="bg-emerald-400" />
              {split.ownedLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <LegendDot className="bg-indigo-400" />
              {split.spentLabel}
            </span>
          </div>
        </div>

        <div
          // Side by side once the panel can fit "Rp 523.400.000" twice
          // (about 15.5rem); stacked on the narrowest phones.
          className="grid grid-cols-1 gap-2 @min-[15.5rem]:grid-cols-2"
        >
          <StatTile
            label={split.totalAssetsLabel}
            value={display.totalAssets}
          />
          <StatTile
            label={split.spentThisMonthLabel}
            value={display.spentThisMonth}
          />
        </div>

        <Sparkline
          values={split.trend}
          isDrawn={step >= SplitStep.Owned}
          className="min-h-12 flex-1"
        />

        <motion.p
          className="flex items-center gap-2 text-xs text-emerald-200"
          {...showcaseReveal(step >= SplitStep.Updated, {
            hideInstantly: true,
          })}
        >
          <CheckBadge />
          {split.updatedLabel}
        </motion.p>
      </FeatureVisualPanel>
    </div>
  );
}

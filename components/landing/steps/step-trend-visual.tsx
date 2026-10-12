"use client";

import { useRef } from "react";

import { PopCheck } from "@/components/landing/pop-check";
import { Sparkline } from "@/components/landing/sparkline";
import { stepVisualRowClassName } from "@/components/landing/steps/step-visual-styles";
import { STEP_VISUAL_STEP_MS } from "@/lib/card-motion";
import { howItWorksContent } from "@/lib/content";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const { trend } = howItWorksContent.visuals;

/** The line draws in, then the latest point is confirmed. */
enum TrendStep {
  Drawn = 1,
  Confirmed,
}

/** Step 3: a mini net-worth line draws itself in. */
export function StepTrendVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { step } = useShowcaseCycle(ref, {
    stepCount: TrendStep.Confirmed,
    stepMs: STEP_VISUAL_STEP_MS,
  });

  return (
    <div ref={ref} className={stepVisualRowClassName}>
      <div className="flex h-full min-w-0 flex-1 flex-col rounded-lg border border-white/10 bg-black/40 p-2">
        <span className="flex items-center justify-between text-2xs text-zinc-400">
          {trend.label}
          <PopCheck isShown={step >= TrendStep.Confirmed} />
        </span>
        <Sparkline
          values={trend.values}
          isDrawn={step >= TrendStep.Drawn}
          className="mt-1 min-h-0 flex-1"
        />
      </div>
    </div>
  );
}

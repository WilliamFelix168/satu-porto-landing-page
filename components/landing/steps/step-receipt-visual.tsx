"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { PopCheck } from "@/components/landing/pop-check";
import { MockChip, MockChipTone } from "@/components/landing/mock-chip";
import { PlaceholderLines } from "@/components/landing/placeholder-lines";
import { StepZeroScan } from "@/components/landing/scan-beam";
import {
  stepArrowClassName,
  stepThumbnailClassName,
  stepVisualRowClassName,
} from "@/components/landing/steps/step-visual-styles";
import { showcaseReveal } from "@/lib/ai-showcase-motion";
import type { StepReceiptDisplay } from "@/lib/card-display";
import { STEP_VISUAL_STEP_MS } from "@/lib/card-motion";
import { howItWorksContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const { receipt } = howItWorksContent.visuals;

/** The receipt is read into a chip, then the expense is confirmed. */
enum ReceiptStep {
  Parsed = 1,
  Saved,
}

/** Step 2: a receipt turns into a categorized expense chip. */
export function StepReceiptVisual({
  display,
}: {
  display: StepReceiptDisplay;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: ReceiptStep.Saved,
    stepMs: STEP_VISUAL_STEP_MS,
  });

  return (
    <div ref={ref} className={stepVisualRowClassName}>
      <div className={cn(stepThumbnailClassName, "bg-zinc-900")}>
        <span className="mb-2 block h-1 w-3/4 rounded-full bg-white/40" />
        <PlaceholderLines widths={receipt.lineWidths} />
        <span className="mt-2 block border-t border-dashed border-white/20" />
        {isPlaying && step < ReceiptStep.Parsed ? (
          <StepZeroScan cycle={cycle} />
        ) : null}
      </div>
      <ArrowRight className={stepArrowClassName} />
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <motion.span
          className="max-w-full min-w-0"
          {...showcaseReveal(step >= ReceiptStep.Parsed, {
            hideInstantly: true,
          })}
        >
          <MockChip tone={MockChipTone.Emerald} className="max-w-full">
            <span className="truncate">{receipt.category}</span>
          </MockChip>
        </motion.span>
        <motion.span
          className="flex items-center gap-1.5 text-xs text-zinc-200 tabular-nums"
          {...showcaseReveal(step >= ReceiptStep.Parsed, {
            hideInstantly: true,
          })}
        >
          {display.amount}
          <PopCheck isShown={step >= ReceiptStep.Saved} />
        </motion.span>
      </div>
    </div>
  );
}

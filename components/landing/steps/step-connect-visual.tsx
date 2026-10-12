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
import { STEP_VISUAL_STEP_MS } from "@/lib/card-motion";
import { howItWorksContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const { connect } = howItWorksContent.visuals;

/** Scan finished (check pops), then the result chip appears. */
enum ConnectStep {
  Scanned = 1,
  Found,
}

/** Step 1: a screenshot is scanned and its holdings are found. */
export function StepConnectVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: ConnectStep.Found,
    stepMs: STEP_VISUAL_STEP_MS,
  });

  return (
    <div ref={ref} className={stepVisualRowClassName}>
      <div className={cn(stepThumbnailClassName, "bg-zinc-950")}>
        <span className="mx-auto mb-2 block h-1 w-5 rounded-full bg-white/20" />
        <PlaceholderLines widths={connect.lineWidths} />
        {isPlaying && step < ConnectStep.Scanned ? (
          <StepZeroScan cycle={cycle} />
        ) : null}
      </div>
      <ArrowRight className={stepArrowClassName} />
      <div className="flex min-w-0 items-center gap-2">
        <PopCheck isShown={step >= ConnectStep.Scanned} />
        <motion.span
          className="min-w-0"
          {...showcaseReveal(step >= ConnectStep.Found, {
            hideInstantly: true,
          })}
        >
          <MockChip tone={MockChipTone.Emerald} className="max-w-full">
            <span className="truncate">{connect.foundLabel}</span>
          </MockChip>
        </motion.span>
      </div>
    </div>
  );
}

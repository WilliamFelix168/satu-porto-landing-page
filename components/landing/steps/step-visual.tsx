import type { JSX } from "react";

import { DecorativeVisual } from "@/components/landing/decorative-visual";
import { StepConnectVisual } from "@/components/landing/steps/step-connect-visual";
import { StepReceiptVisual } from "@/components/landing/steps/step-receipt-visual";
import { StepTrendVisual } from "@/components/landing/steps/step-trend-visual";
import { getStepReceiptDisplay } from "@/lib/card-display";
import { howItWorksContent, StepVisual } from "@/lib/content";

/** Step numbers are 1-based for display. */
const FIRST_STEP_NUMBER = 1;
/** Steps render as "Step 01", "Step 02", ... */
const STEP_NUMBER_DIGITS = 2;

/** Server-rendered, so the receipt amount is formatted here. */
const visuals: Record<StepVisual, () => JSX.Element> = {
  [StepVisual.Connect]: () => <StepConnectVisual />,
  [StepVisual.Receipt]: () => (
    <StepReceiptVisual display={getStepReceiptDisplay()} />
  ),
  [StepVisual.Trend]: () => <StepTrendVisual />,
};

interface StepFlourishProps {
  visual: StepVisual;
  /** Zero-based position of the step. */
  index: number;
}

/**
 * A step's animated mini visual above its "Step 0n" label. Pinned to the
 * bottom of the card (`mt-auto`) so the three visuals line up even though
 * the step descriptions differ in length.
 */
export function StepFlourish({ visual, index }: StepFlourishProps) {
  const Visual = visuals[visual];
  return (
    <div className="@container mt-auto space-y-4">
      <DecorativeVisual>
        <Visual />
      </DecorativeVisual>
      <span className="block font-mono text-sm tracking-wide text-zinc-400">
        {howItWorksContent.stepLabel}{" "}
        {String(index + FIRST_STEP_NUMBER).padStart(STEP_NUMBER_DIGITS, "0")}
      </span>
    </div>
  );
}

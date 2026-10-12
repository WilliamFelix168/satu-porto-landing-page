import { expect } from "vitest";

import { StepConnectVisual } from "@/components/landing/steps/step-connect-visual";
import { StepReceiptVisual } from "@/components/landing/steps/step-receipt-visual";
import { StepTrendVisual } from "@/components/landing/steps/step-trend-visual";
import { getStepReceiptDisplay } from "@/lib/card-display";
import { STEP_VISUAL_STEP_MS } from "@/lib/card-motion";
import { howItWorksContent } from "@/lib/content";
import {
  describeAnimatedVisual,
  sequenceMs,
} from "@/test/animated-visual-suite";

/** Each mini visual is a two-step sequence. */
const STEP_VISUAL_STEPS = 2;
const stepSequenceMs = sequenceMs(STEP_VISUAL_STEPS, STEP_VISUAL_STEP_MS);
const receiptDisplay = getStepReceiptDisplay();

describeAnimatedVisual({
  name: "StepConnectVisual",
  renderVisual: () => <StepConnectVisual />,
  sequenceMs: stepSequenceMs,
  expectFinished: (container) => {
    expect(container).toHaveTextContent(
      howItWorksContent.visuals.connect.foundLabel,
    );
  },
});

describeAnimatedVisual({
  name: "StepReceiptVisual",
  renderVisual: () => <StepReceiptVisual display={receiptDisplay} />,
  sequenceMs: stepSequenceMs,
  expectFinished: (container) => {
    expect(container).toHaveTextContent(
      howItWorksContent.visuals.receipt.category,
    );
  },
});

describeAnimatedVisual({
  name: "StepTrendVisual",
  renderVisual: () => <StepTrendVisual />,
  sequenceMs: stepSequenceMs,
  expectStarted: (container) => {
    expect(container.querySelector("[data-drawn]")).toHaveAttribute(
      "data-drawn",
      "false",
    );
  },
});

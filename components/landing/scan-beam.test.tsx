import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ScanBeam,
  StepZeroScan,
  stepZeroScanTiming,
} from "@/components/landing/scan-beam";
import { SHOWCASE_START_DELAY_MS } from "@/lib/ai-showcase-motion";

const MS_PER_SECOND = 1000;

describe("StepZeroScan", () => {
  it("finishes its sweep inside step 0, while it is still mounted", () => {
    const { delayS, durationS } = stepZeroScanTiming();
    expect(delayS).toBe(0);
    expect((delayS + durationS) * MS_PER_SECOND).toBeLessThanOrEqual(
      SHOWCASE_START_DELAY_MS,
    );
    expect(durationS).toBeGreaterThan(0);
  });

  it("renders a beam", () => {
    const { container } = render(<StepZeroScan cycle={0} />);
    expect(container.querySelector("[data-scan-beam]")).not.toBeNull();
  });
});

describe("ScanBeam", () => {
  it("moves with a transform (y), never by animating top", () => {
    const { container } = render(<ScanBeam cycle={0} durationS={1} />);
    const animate = container
      .querySelector("[data-scan-beam]")
      ?.getAttribute("data-motion-animate");
    expect(animate).toContain('"y"');
    expect(animate).not.toContain('"top"');
  });
});

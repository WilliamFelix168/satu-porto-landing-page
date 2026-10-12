import { act, render, screen } from "@testing-library/react";
import { useInView } from "motion/react";
import { StrictMode, useRef } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  SHOWCASE_HOLD_MS,
  SHOWCASE_START_DELAY_MS,
} from "@/lib/ai-showcase-motion";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";
import { stubMatchMedia } from "@/test/media-query";

const STEP_COUNT = 3;
const STEP_MS = 100;

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: STEP_COUNT,
    stepMs: STEP_MS,
  });
  return (
    <div ref={ref}>
      <span data-testid="step">{step}</span>
      <span data-testid="playing">{String(isPlaying)}</span>
      <span data-testid="cycle">{cycle}</span>
    </div>
  );
}

function readStep() {
  return Number(screen.getByTestId("step").textContent);
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe("useShowcaseCycle", () => {
  it("shows the finished state while out of view (server output too)", () => {
    vi.mocked(useInView).mockReturnValue(false);
    render(<Probe />);

    expect(readStep()).toBe(STEP_COUNT);
    expect(screen.getByTestId("playing")).toHaveTextContent("false");
  });

  it("plays the steps in order once in view, holds, then loops", async () => {
    vi.useFakeTimers();
    vi.mocked(useInView).mockReturnValue(true);
    render(<Probe />);

    expect(readStep()).toBe(0);
    expect(screen.getByTestId("playing")).toHaveTextContent("true");

    await advance(SHOWCASE_START_DELAY_MS);
    expect(readStep()).toBe(1);
    await advance(STEP_MS);
    expect(readStep()).toBe(2);
    await advance(STEP_MS);
    expect(readStep()).toBe(STEP_COUNT);

    // Holds the finished state...
    await advance(SHOWCASE_HOLD_MS - 1);
    expect(readStep()).toBe(STEP_COUNT);
    // ...then starts the next loop from the beginning.
    await advance(1);
    expect(readStep()).toBe(0);
    expect(screen.getByTestId("cycle")).toHaveTextContent("1");
  });

  it("stops and settles on the finished state when it leaves view", async () => {
    vi.useFakeTimers();
    vi.mocked(useInView).mockReturnValue(true);
    const { rerender } = render(<Probe />);
    await advance(SHOWCASE_START_DELAY_MS);
    expect(readStep()).toBe(1);

    vi.mocked(useInView).mockReturnValue(false);
    rerender(<Probe />);
    expect(readStep()).toBe(STEP_COUNT);

    await advance(SHOWCASE_HOLD_MS * STEP_COUNT);
    expect(readStep()).toBe(STEP_COUNT);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("never plays for visitors who prefer reduced motion", async () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    vi.mocked(useInView).mockReturnValue(true);
    render(<Probe />);

    expect(readStep()).toBe(STEP_COUNT);
    expect(screen.getByTestId("playing")).toHaveTextContent("false");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("restarts from the first step when it comes back into view", async () => {
    vi.useFakeTimers();
    vi.mocked(useInView).mockReturnValue(true);
    const { rerender } = render(<Probe />);
    await advance(SHOWCASE_START_DELAY_MS + STEP_MS);
    expect(readStep()).toBe(2);

    vi.mocked(useInView).mockReturnValue(false);
    rerender(<Probe />);
    vi.mocked(useInView).mockReturnValue(true);
    rerender(<Probe />);

    expect(readStep()).toBe(0);
    await advance(SHOWCASE_START_DELAY_MS);
    expect(readStep()).toBe(1);
  });

  it("leaves no timers behind when it unmounts mid-sequence", async () => {
    vi.useFakeTimers();
    vi.mocked(useInView).mockReturnValue(true);
    const { unmount } = render(<Probe />);
    await advance(SHOWCASE_START_DELAY_MS);
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps exactly one pending timer under StrictMode's double effects", () => {
    vi.useFakeTimers();
    vi.mocked(useInView).mockReturnValue(true);
    render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    );

    expect(vi.getTimerCount()).toBe(1);
  });
});

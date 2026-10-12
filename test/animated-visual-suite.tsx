import { act, render } from "@testing-library/react";
import { useInView } from "motion/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { SHOWCASE_START_DELAY_MS } from "@/lib/ai-showcase-motion";
import { stubMatchMedia } from "@/test/media-query";

/** `toHaveTextContent` collapses the no-break space inside rupiah amounts. */
export function plain(text: string): string {
  return text.replace(/\s/gu, " ");
}

/** Time for a `useShowcaseCycle` sequence of `steps` steps to finish. */
export function sequenceMs(steps: number, stepMs: number): number {
  return SHOWCASE_START_DELAY_MS + (steps - 1) * stepMs;
}

/** Advances fake timers inside `act`, so React flushes in between. */
export async function advanceTimers(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

/** Animate targets that mean "not shown yet" (see the motion mock). */
const HIDDEN_TARGET = /"(?:opacity|scale|scaleX|scaleY)":0(?![.\d])/;

/** Elements currently animating to a hidden state. */
export function countHidden(container: HTMLElement): number {
  return Array.from(container.querySelectorAll("[data-motion-animate]")).filter(
    (element) =>
      HIDDEN_TARGET.test(element.getAttribute("data-motion-animate") ?? ""),
  ).length;
}

interface AnimatedVisualSpec {
  name: string;
  renderVisual: () => ReactElement;
  /** Time from entering view until the sequence reaches its finished state. */
  sequenceMs: number;
  /** Extra checks for the finished state. */
  expectFinished?: (container: HTMLElement) => void;
  /** Extra checks for the first frame of a playing sequence. */
  expectStarted?: (container: HTMLElement) => void;
  /**
   * Whether the first frame hides elements (opacity or scale 0). Visuals that
   * start dimmed or clipped instead set this to false and check their start
   * state in `expectStarted`.
   */
  startsHidden?: boolean;
}

/**
 * The contract every looping card visual must meet: finished state on the
 * server, out of view and under reduced motion; plays from the start in
 * view; stops when it leaves view; leaves no timers behind.
 */
export function describeAnimatedVisual({
  name,
  renderVisual,
  sequenceMs,
  expectFinished = () => {},
  expectStarted = () => {},
  startsHidden = true,
}: AnimatedVisualSpec) {
  function assertFinished(container: HTMLElement) {
    expect(countHidden(container)).toBe(0);
    expectFinished(container);
  }

  describe(`${name} (animated visual)`, () => {
    it("renders the finished state on the server and while out of view", () => {
      const { container } = render(renderVisual());
      assertFinished(container);
    });

    it("renders the finished state under reduced motion, with no timers", () => {
      vi.useFakeTimers();
      stubMatchMedia(true);
      vi.mocked(useInView).mockReturnValue(true);
      const { container } = render(renderVisual());

      assertFinished(container);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("starts from the beginning in view and plays to the finished state", async () => {
      vi.useFakeTimers();
      stubMatchMedia(false);
      vi.mocked(useInView).mockReturnValue(true);
      const { container } = render(renderVisual());

      if (startsHidden) expect(countHidden(container)).toBeGreaterThan(0);
      expectStarted(container);

      await act(async () => {
        vi.advanceTimersByTime(sequenceMs);
      });
      assertFinished(container);
    });

    it("stops and settles on the finished state when it leaves view", async () => {
      vi.useFakeTimers();
      stubMatchMedia(false);
      vi.mocked(useInView).mockReturnValue(true);
      const { container, rerender } = render(renderVisual());
      await act(async () => {
        vi.advanceTimersByTime(sequenceMs / 2);
      });

      vi.mocked(useInView).mockReturnValue(false);
      rerender(renderVisual());

      assertFinished(container);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("leaves no timers behind when it unmounts mid-sequence", async () => {
      vi.useFakeTimers();
      stubMatchMedia(false);
      vi.mocked(useInView).mockReturnValue(true);
      const { unmount } = render(renderVisual());
      await act(async () => {
        vi.advanceTimersByTime(sequenceMs / 2);
      });

      unmount();
      expect(vi.getTimerCount()).toBe(0);
    });
  });
}

import { useEffect, useState, type RefObject } from "react";

import {
  COUNT_UP_DURATION_MS,
  COUNT_UP_STEP_MS,
  DASHBOARD_IN_VIEW_AMOUNT,
  DASHBOARD_INTRO_WINDOW_MS,
  DASHBOARD_START_DELAY_MS,
  TICK_INTERVAL_MS,
} from "@/lib/dashboard-motion";
import { useCountUp } from "@/lib/use-count-up";
import { useIsAnimating } from "@/lib/use-is-animating";
import { useLoopIndex } from "@/lib/use-loop-index";

/** The intro is over once the count-up has finished. */
export const INTRO_DURATION_MS =
  DASHBOARD_START_DELAY_MS + COUNT_UP_DURATION_MS;
/** Lets a state change wait for the next task (keeps StrictMode's double effects harmless). */
const NEXT_TASK_MS = 0;

/** Where the once-per-page-load intro stands. */
enum IntroPhase {
  Pending = "pending",
  Playing = "playing",
  Done = "done",
}

/** True when the page hydrated soon enough for the intro to look intended. */
export function isWithinIntroWindow(): boolean {
  return (
    typeof performance !== "undefined" &&
    performance.now() < DASHBOARD_INTRO_WINDOW_MS
  );
}

export interface LiveDashboard {
  /** Net-worth text during the count-up, or null once it is over. */
  countUpText: string | null;
  /** Bars, rows and tiles are shown (false only at the very start). */
  isRevealed: boolean;
  /** Current frame of the price-tick loop (0 is the real state). */
  frameIndex: number;
  /** Ticks since the loop started; changes on every tick (0 before the first). */
  tickCount: number;
  /** The tick loop is running (in view, after the intro). */
  isLooping: boolean;
}

/**
 * Drives the hero dashboard: a one-time intro (count-up, bars, rows) if the
 * page hydrates quickly, then price ticks while the card is in view.
 * Server output, reduced motion and off-screen cards show the static state.
 */
export function useLiveDashboard(
  ref: RefObject<Element | null>,
  { frameCount, countUp }: { frameCount: number; countUp: readonly string[] },
): LiveDashboard {
  const isAnimating = useIsAnimating(ref, DASHBOARD_IN_VIEW_AMOUNT);
  // Read once, when the card mounts. It only matters once the card animates,
  // which never happens while rendering on the server or hydrating, so it
  // cannot cause a hydration mismatch.
  const [isIntroAllowed] = useState(isWithinIntroWindow);
  const [introPhase, setIntroPhase] = useState(IntroPhase.Pending);
  const isIntro =
    isAnimating && isIntroAllowed && introPhase !== IntroPhase.Done;

  const count = useCountUp(countUp, {
    isActive: isIntro,
    stepMs: COUNT_UP_STEP_MS,
    startDelayMs: DASHBOARD_START_DELAY_MS,
  });

  // The intro plays at most once per page load: it starts the first time the
  // card animates, finishes after the count-up, and counts as played if the
  // visitor scrolls away before it ends.
  useEffect(() => {
    if (!isIntro) return;
    const next =
      introPhase === IntroPhase.Pending
        ? { phase: IntroPhase.Playing, afterMs: NEXT_TASK_MS }
        : { phase: IntroPhase.Done, afterMs: INTRO_DURATION_MS };
    const timer = setTimeout(() => setIntroPhase(next.phase), next.afterMs);
    return () => clearTimeout(timer);
  }, [isIntro, introPhase]);

  useEffect(() => {
    if (introPhase !== IntroPhase.Playing || isAnimating) return;
    const timer = setTimeout(
      () => setIntroPhase(IntroPhase.Done),
      NEXT_TASK_MS,
    );
    return () => clearTimeout(timer);
  }, [introPhase, isAnimating]);

  const isLooping = isAnimating && !isIntro;
  const loop = useLoopIndex(frameCount, {
    isActive: isLooping,
    intervalMs: TICK_INTERVAL_MS,
  });

  return {
    countUpText: isIntro ? count.text : null,
    isRevealed: !isIntro || count.step > 0,
    frameIndex: loop.index,
    tickCount: loop.advances,
    isLooping,
  };
}

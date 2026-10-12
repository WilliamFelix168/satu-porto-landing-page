import { useEffect, useState, type RefObject } from "react";

import {
  SHOWCASE_HOLD_MS,
  SHOWCASE_IN_VIEW_AMOUNT,
  SHOWCASE_START_DELAY_MS,
} from "@/lib/ai-showcase-motion";
import { useIsAnimating } from "@/lib/use-is-animating";

interface ShowcaseCycleOptions {
  /** Number of steps; `step === stepCount` is the finished state. */
  stepCount: number;
  /** Time between steps. */
  stepMs: number;
}

export interface ShowcaseCycle {
  /** 0 is the empty start, `stepCount` the finished state. */
  step: number;
  /** True while a sequence is playing (in view, motion allowed). */
  isPlaying: boolean;
  /** Changes on every loop, to restart keyed one-shot animations. */
  cycle: number;
}

/**
 * Drives a looping step sequence for a decorative visual.
 *
 * - Renders the finished state whenever it is not playing: in the server
 *   output, for visitors without JavaScript, and while out of view. (The
 *   panel around it is still hidden until its scroll reveal runs, except
 *   without JavaScript, where the layout's noscript style shows it.)
 * - Plays only while the visual is in view, and stops its timers when it
 *   leaves, so off-screen visuals cost nothing.
 * - Stays on the finished state, without looping, for visitors who prefer
 *   reduced motion.
 */
export function useShowcaseCycle(
  ref: RefObject<Element | null>,
  { stepCount, stepMs }: ShowcaseCycleOptions,
): ShowcaseCycle {
  const isPlaying = useIsAnimating(ref, SHOWCASE_IN_VIEW_AMOUNT);

  // Progress of the playing sequence. Ignored (finished state shown) while
  // not playing, so server output and off-screen visuals are complete.
  const [playedStep, setPlayedStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    function advance() {
      current += 1;
      setPlayedStep(current);
      timer =
        current < stepCount
          ? setTimeout(advance, stepMs)
          : setTimeout(restart, SHOWCASE_HOLD_MS);
    }

    function restart() {
      current = 0;
      setPlayedStep(0);
      setCycle((value) => value + 1);
      timer = setTimeout(advance, SHOWCASE_START_DELAY_MS);
    }

    timer = setTimeout(advance, SHOWCASE_START_DELAY_MS);
    return () => {
      clearTimeout(timer);
      // Start from the beginning the next time the visual comes into view.
      setPlayedStep(0);
    };
  }, [isPlaying, stepCount, stepMs]);

  return { step: isPlaying ? playedStep : stepCount, isPlaying, cycle };
}

import { useEffect, useState } from "react";

interface CountUpOptions {
  /** Counts while true; shows the final frame otherwise. */
  isActive: boolean;
  /** Time between frames. */
  stepMs: number;
  /** Wait before the first frame advances. */
  startDelayMs?: number;
  /** Changing this restarts the count from the first frame. */
  restartKey?: number;
}

export interface CountUp {
  /** The frame to show. */
  text: string;
  /** Its position; 0 is the start, `frames.length - 1` the final value. */
  step: number;
}

/**
 * Steps through pre-formatted count-up frames (see `buildCountUp`). Returns
 * the final frame whenever it is not active, so server output, reduced
 * motion and off-screen cards always show the real value.
 */
export function useCountUp(
  frames: readonly string[],
  { isActive, stepMs, startDelayMs = 0, restartKey = 0 }: CountUpOptions,
): CountUp {
  const lastIndex = frames.length - 1;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    function advance() {
      current += 1;
      setIndex(current);
      if (current < lastIndex) timer = setTimeout(advance, stepMs);
    }

    timer = setTimeout(advance, startDelayMs);
    return () => {
      clearTimeout(timer);
      setIndex(0);
    };
  }, [isActive, lastIndex, stepMs, startDelayMs, restartKey]);

  const step = isActive ? Math.min(index, lastIndex) : lastIndex;
  return { text: frames[step], step };
}

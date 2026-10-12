import { useEffect, useState } from "react";

interface LoopIndexOptions {
  /** Loops while true; returns 0 otherwise. */
  isActive: boolean;
  /** Time each index is shown. */
  intervalMs: number;
}

export interface LoopIndex {
  /** Current position: 0, 1, …, count - 1, then 0 again. */
  index: number;
  /** How many times it has advanced since it became active (0 at first). */
  advances: number;
}

/** Cycles 0, 1, …, count - 1, 0, … while active. Stops (and resets) when not. */
export function useLoopIndex(
  count: number,
  { isActive, intervalMs }: LoopIndexOptions,
): LoopIndex {
  const [advances, setAdvances] = useState(0);

  useEffect(() => {
    if (!isActive || count <= 1) return;
    const timer = setInterval(
      () => setAdvances((current) => current + 1),
      intervalMs,
    );
    return () => {
      clearInterval(timer);
      setAdvances(0);
    };
  }, [isActive, count, intervalMs]);

  return isActive
    ? { index: advances % count, advances }
    : { index: 0, advances: 0 };
}

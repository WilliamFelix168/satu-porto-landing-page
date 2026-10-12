import { formatIdr } from "@/lib/format";

/** Intermediate count-up values are rounded to this, for calmer digits. */
export const COUNT_UP_ROUND_IDR = 10_000;
/**
 * Net-worth count-ups start this close to the real value, so a card that
 * already showed the full figure never visibly drops towards zero.
 */
export const NET_WORTH_COUNT_UP_START_RATIO = 0.92;

/** Where a net-worth count-up starts, rounded like the frames. */
export function netWorthCountUpStart(finalIdr: number): number {
  return (
    Math.round(
      (finalIdr * NET_WORTH_COUNT_UP_START_RATIO) / COUNT_UP_ROUND_IDR,
    ) * COUNT_UP_ROUND_IDR
  );
}

/** Starts fast and settles gently on the final value. */
function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Pre-formatted rupiah frames counting from `startIdr` to `finalIdr`, for
 * `useCountUp`. Built on the server so no `Intl` call runs in the browser.
 * Intermediate values are rounded to `roundToIdr`; the last frame is exact.
 */
export function buildCountUp(
  finalIdr: number,
  steps: number,
  { startIdr = 0, roundToIdr = COUNT_UP_ROUND_IDR } = {},
): string[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    if (step === steps) return formatIdr(finalIdr);
    const value = startIdr + (finalIdr - startIdr) * easeOutCubic(step / steps);
    return formatIdr(Math.round(value / roundToIdr) * roundToIdr);
  });
}

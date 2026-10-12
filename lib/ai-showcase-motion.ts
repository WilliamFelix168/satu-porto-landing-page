import type { Transition } from "motion/react";

/**
 * Timing for the SatuPorto AI showcase. Each visual plays a short sequence of
 * steps once it scrolls into view, holds the finished state, then loops.
 */

const MS_PER_SECOND = 1000;

/** Converts the millisecond step timings to motion's seconds. */
export function msToSeconds(ms: number): number {
  return ms / MS_PER_SECOND;
}

/** Share of a visual that must be on screen before its sequence starts. */
export const SHOWCASE_IN_VIEW_AMOUNT = 0.35;
/** Pause between the visual entering view and its first step. */
export const SHOWCASE_START_DELAY_MS = 500;
/** How long the finished state stays on screen before the loop restarts. */
export const SHOWCASE_HOLD_MS = 3200;

/** Screenshot import: one step per holding row the scan line passes. */
export const SNAP_IMPORT_STEP_MS = 750;
/** Receipt scan: merchant, date, category, amount, then the toast. */
export const RECEIPT_SCAN_STEP_MS = 700;
/** Insights: alternating "typing" and "bubble" steps. */
export const INSIGHTS_STEP_MS = 850;

/** Scan beam opacity over one sweep: fade in, hold, fade out at the end. */
export const SCAN_BEAM_OPACITY = [0, 1, 1, 0];

/** Small elements (rows, fields, bubbles) fading or sliding in. */
export const SHOWCASE_FADE_S = 0.35;
/** Distance new rows and bubbles slide up from. */
export const SHOWCASE_SLIDE_PX = 8;
/** Donut and sparkline drawing themselves in. */
export const SHOWCASE_DRAW_S = 1.2;
/** A sparkline gliding to a new series (same point count). */
export const SPARKLINE_MORPH_S = 0.9;
/** One pulse of a detected-field outline. */
export const SHOWCASE_PULSE_S = 1.4;

/** Check marks and the "Expense added" toast pop in on a spring. */
export const SHOWCASE_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 22,
};

/** Typing indicator: bounce height, cycle length and per-dot offset. */
export const TYPING_DOT_BOUNCE_PX = 3;
export const TYPING_DOT_CYCLE_S = 0.9;
export const TYPING_DOT_STAGGER_S = 0.15;

/**
 * Props for a mock element that fades and slides into place once its step
 * is reached. `initial: false` makes the server render the current state.
 * `delayS` staggers siblings; `hideInstantly` resets without a fade-out.
 */
export function showcaseReveal(
  isShown: boolean,
  { delayS = 0, hideInstantly = false } = {},
) {
  return {
    initial: false,
    animate: {
      opacity: isShown ? 1 : 0,
      y: isShown ? 0 : SHOWCASE_SLIDE_PX,
    },
    transition:
      !isShown && hideInstantly
        ? { duration: 0 }
        : { duration: SHOWCASE_FADE_S, delay: isShown ? delayS : 0 },
  } as const;
}

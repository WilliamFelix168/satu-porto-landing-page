/**
 * Timing for the live hero dashboard: an intro (count-up, bars, rows) once
 * per page load, then a gentle loop of price ticks while it is in view.
 */

/** Share of the card that must be visible for it to animate. */
export const DASHBOARD_IN_VIEW_AMOUNT = 0.3;
/**
 * The intro only plays if the page hydrates this soon after navigation. On a
 * slow load the visitor has already read the static card, so resetting it to
 * zero would look like a glitch; it goes straight to the price ticks instead.
 */
export const DASHBOARD_INTRO_WINDOW_MS = 2500;
/** Pause before the intro starts (lets the hero entrance settle). */
export const DASHBOARD_START_DELAY_MS = 300;

/** Number of frames in the net-worth count-up. */
export const COUNT_UP_STEPS = 30;
/** Total count-up time. */
export const COUNT_UP_DURATION_MS = 1400;
export const COUNT_UP_STEP_MS = COUNT_UP_DURATION_MS / COUNT_UP_STEPS;

/** Bars grow from the baseline, one after another. */
export const BAR_GROW_S = 0.7;
export const BAR_STAGGER_S = 0.05;
/** Holdings rows and spending tiles fade in, one after another. */
export const ROW_STAGGER_S = 0.08;

/** Time between simulated price ticks. */
export const TICK_INTERVAL_MS = 2600;
/** A ticked value's highlight fades out over this long. */
export const TICK_FLASH_S = 1.2;
/** The latest bar's slow pulse: one cycle and its opacity keyframes. */
export const LATEST_BAR_PULSE_S = 2.4;
export const LATEST_BAR_PULSE_OPACITY = [1, 0.7, 1];

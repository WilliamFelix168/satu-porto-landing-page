/**
 * Timing for the animated mock visuals inside the bento and How it works
 * cards. Each one runs on `useShowcaseCycle` (in view only, gentle loop,
 * finished state when idle). The pricing check marks use the `popIn` reveal
 * from `lib/motion.ts` instead.
 */

/** Multi-Asset card: one step for the chart, then one per ticker chip. */
export const ASSET_SYNC_STEP_MS = 420;
/** Most ticker badges the panel footer shows; the rest collapse into "+N". */
export const VISIBLE_TICKER_CHIPS = 2;

/** Expense card: one step per new entry. */
export const EXPENSE_LOG_STEP_MS = 950;
/** Fixed number of expense rows; new entries push the oldest out. */
export const EXPENSE_SLOTS = 3;
/** Monthly total count-up: frames and time per frame. */
export const EXPENSE_TOTAL_COUNT_UP_STEPS = 20;
export const EXPENSE_TOTAL_COUNT_UP_STEP_MS = 120;

/** Net-worth card: chart and owned fill, spent fill, then "updated just now". */
export const NET_WORTH_SPLIT_STEP_MS = 900;
/** Net-worth figure count-up: frames and time per frame. */
export const NET_WORTH_COUNT_UP_STEPS = 24;
export const NET_WORTH_COUNT_UP_STEP_MS = 60;

/** How it works mini visuals: a short two-step sequence each. */
export const STEP_VISUAL_STEP_MS = 1100;

/** Progress bars and split segments filling from the left. */
export const FILL_S = 0.8;
export const FILL_STAGGER_S = 0.12;

/** "Live" status dot: one pulse and its scale/opacity keyframes. */
export const LIVE_DOT_PULSE_S = 1.6;
export const LIVE_DOT_PULSE_SCALE = [1, 1.8, 1];
export const LIVE_DOT_PULSE_OPACITY = [0.7, 0, 0.7];

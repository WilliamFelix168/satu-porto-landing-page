/** Shared frame for the How it works mini visuals: one row, fixed height. */
export const stepVisualRowClassName = "flex h-20 items-center gap-3";

/** A small card-like thumbnail (phone screen or receipt) inside a step. */
export const stepThumbnailClassName =
  "relative h-full w-14 shrink-0 overflow-clip rounded-lg border border-white/10 p-2";

/**
 * The arrow between thumbnail and result. Hidden when the step card is very
 * narrow (under 16rem, small phones) so the result chip never truncates.
 */
export const stepArrowClassName =
  "hidden size-4 shrink-0 text-emerald-300 @min-[16rem]:block";

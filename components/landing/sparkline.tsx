"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useId } from "react";

import {
  SHOWCASE_DRAW_S,
  SHOWCASE_FADE_S,
  SPARKLINE_MORPH_S,
} from "@/lib/ai-showcase-motion";
import { PERCENT_SCALE_MAX } from "@/lib/scale";
import { cn } from "@/lib/utils";

/** Drawing space; the SVG stretches it to the element's size. */
const SPARKLINE_WIDTH = 100;
const SPARKLINE_HEIGHT = 40;
/** Decimal places kept in path coordinates; more adds bytes, not detail. */
const SPARKLINE_COORDINATE_PRECISION = 2;
/** Opacity of the area fill at the line, fading to 0 at the bottom. */
const SPARKLINE_FILL_OPACITY = 0.35;
/** Room left around the plot so the stroke at the edges is not clipped. */
const STROKE_BLEED_PX = 4;
/** Draw progress (and opacity) at rest: nothing shown, everything shown. */
const PROGRESS_EMPTY = 0;
const PROGRESS_FULL = 1;

/** Maps 0 to 100 values onto sparkline coordinates. */
export function toSparklinePoints(values: readonly number[]): string[] {
  const lastIndex = Math.max(values.length - 1, 1);
  return values.map((value, index) => {
    const x = (index / lastIndex) * SPARKLINE_WIDTH;
    const y = SPARKLINE_HEIGHT - (value / PERCENT_SCALE_MAX) * SPARKLINE_HEIGHT;
    return `${x.toFixed(SPARKLINE_COORDINATE_PRECISION)},${y.toFixed(SPARKLINE_COORDINATE_PRECISION)}`;
  });
}

export function linePath(values: readonly number[]): string {
  return `M${toSparklinePoints(values).join(" L")}`;
}

export function areaPath(values: readonly number[]): string {
  return `${linePath(values)} L${SPARKLINE_WIDTH},${SPARKLINE_HEIGHT} L0,${SPARKLINE_HEIGHT} Z`;
}

/**
 * The clip for a given draw progress. Every frame produces the same shape of
 * string (four insets, one `calc`), so nothing ever snaps between formats.
 * At 0 the right inset covers the full width plus the bleed; at 1 it is the
 * bleed outside the right edge.
 */
export function drawClip(progress: number): string {
  const remaining = PROGRESS_FULL - progress;
  const rightPercent = remaining * PERCENT_SCALE_MAX;
  const rightPx = remaining * 2 * STROKE_BLEED_PX - STROKE_BLEED_PX;
  return `inset(-${STROKE_BLEED_PX}px calc(${rightPercent}% + ${rightPx}px) -${STROKE_BLEED_PX}px -${STROKE_BLEED_PX}px)`;
}

/** Values part-way between two series of the same length. */
export function blendSeries(
  from: readonly number[],
  to: readonly number[],
  amount: number,
): number[] {
  return to.map((value, index) => {
    const start = from[index] ?? value;
    return start + (value - start) * amount;
  });
}

/** The value under the tip of a line drawn to `progress` (0 to 1). */
export function valueAtProgress(
  values: readonly number[],
  progress: number,
): number {
  const position = progress * (values.length - 1);
  const index = Math.floor(position);
  const next = Math.min(index + 1, values.length - 1);
  return values[index] + (values[next] - values[index]) * (position - index);
}

/**
 * Where the tip of a line drawn to `progress` sits, in percent of the plot
 * box (x from the left, y from the top). The points are evenly spaced in x,
 * so this is exactly on the polyline that `linePath` draws, and at progress 1
 * it is the last point.
 */
export function tipPosition(
  values: readonly number[],
  progress: number,
): { xPercent: number; yPercent: number } {
  return {
    xPercent: progress * PERCENT_SCALE_MAX,
    yPercent: PERCENT_SCALE_MAX - valueAtProgress(values, progress),
  };
}

interface SparklineProps {
  /** Points on a 0 to 100 scale. A new series of the same length morphs in. */
  values: readonly number[];
  /**
   * True draws the line in (left to right, once). False fades the whole chart
   * out and rewinds it while invisible, ready to draw again.
   */
  isDrawn?: boolean;
  className?: string;
}

/**
 * Emerald line with a soft area fill and a glowing tip. Decorative.
 *
 * One `progress` value drives the clip (line and fill reveal together, so
 * they can never misalign) and the tip dot. One `morph` value blends old and
 * new series, so a changed `values` glides into place instead of swapping.
 * The SVG never re-mounts.
 *
 * The draw is a clip wipe, not a `pathLength` dash animation: the stroke uses
 * `vector-effect: non-scaling-stroke` in a stretched SVG, and dash lengths are
 * then measured in screen pixels while `pathLength` normalizes in user units,
 * which breaks the line into segments.
 */
export function Sparkline({
  values,
  isDrawn = true,
  className,
}: SparklineProps) {
  const fillId = useId();
  const valuesKey = values.join(",");

  const progress = useMotionValue(isDrawn ? PROGRESS_FULL : PROGRESS_EMPTY);
  const opacity = useMotionValue(PROGRESS_FULL);
  const fromValues = useMotionValue<readonly number[]>(values);
  const toValues = useMotionValue<readonly number[]>(values);
  const morph = useMotionValue(PROGRESS_FULL);

  // Function form: re-computes whenever any motion value it reads changes.
  const shown = useTransform(() =>
    blendSeries(fromValues.get(), toValues.get(), morph.get()),
  );
  const line = useTransform(shown, linePath);
  const area = useTransform(shown, areaPath);
  const clipPath = useTransform(progress, drawClip);
  // The tip reads the same progress and the same (morphing) series as the
  // stroke, every frame, so it rides the line instead of tweening on its own.
  const tipX = useTransform(
    () => tipPosition(shown.get(), progress.get()).xPercent,
  );
  const tipY = useTransform(
    () => tipPosition(shown.get(), progress.get()).yPercent,
  );

  useEffect(() => {
    if (isDrawn) {
      opacity.set(PROGRESS_FULL);
      const controls = animate(progress, PROGRESS_FULL, {
        duration: SHOWCASE_DRAW_S,
        ease: "easeInOut",
      });
      return () => controls.stop();
    }
    const controls = animate(opacity, PROGRESS_EMPTY, {
      duration: SHOWCASE_FADE_S,
      onComplete: () => progress.set(PROGRESS_EMPTY),
    });
    return () => controls.stop();
  }, [isDrawn, opacity, progress]);

  useEffect(() => {
    if (toValues.get().join(",") === valuesKey) return;
    fromValues.set(shown.get());
    toValues.set(valuesKey.split(",").map(Number));
    morph.set(PROGRESS_EMPTY);
    const controls = animate(morph, PROGRESS_FULL, {
      duration: SPARKLINE_MORPH_S,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [valuesKey, fromValues, toValues, morph, shown]);

  return (
    <motion.div
      data-drawn={isDrawn}
      className={cn("[container-type:size] relative", className)}
      style={{
        opacity,
        ["--tip-x" as string]: tipX,
        ["--tip-y" as string]: tipY,
      }}
    >
      {/* Only the plot is clipped; the tip dot sits outside the clip. */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <svg
          viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopOpacity={SPARKLINE_FILL_OPACITY}
                className="[stop-color:var(--color-emerald-400)]"
              />
              <stop
                offset="100%"
                stopOpacity={0}
                className="[stop-color:var(--color-emerald-400)]"
              />
            </linearGradient>
          </defs>
          <motion.path d={area} fill={`url(#${fillId})`} />
          <motion.path
            d={line}
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="stroke-emerald-300 [stroke-width:2]"
          />
        </svg>
      </motion.div>
      {/* Tip: follows the end of the line while it draws, then rests on it. */}
      <span
        data-sparkline-tip=""
        className="absolute top-0 left-0 size-2 rounded-full bg-emerald-300 shadow-glow-emerald"
        style={{
          transform:
            "translate(calc(var(--tip-x) * 1cqw - 50%), calc(var(--tip-y) * 1cqh - 50%))",
        }}
      />
    </motion.div>
  );
}

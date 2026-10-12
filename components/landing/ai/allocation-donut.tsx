"use client";

import { motion } from "motion/react";

import { SHOWCASE_DRAW_S } from "@/lib/ai-showcase-motion";
import { PERCENT_SCALE_MAX } from "@/lib/scale";

/** Drawing space and ring thickness, in SVG units. */
const DONUT_SIZE = 64;
const DONUT_STROKE = 8;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CENTER = DONUT_SIZE / 2;

interface AllocationDonutProps {
  /** Share of the ring to fill, 0 to 100. */
  percent: number;
  /** False empties the ring (it draws itself in when this turns true). */
  isDrawn: boolean;
}

/** Ring chart with the percentage in the middle. Decorative. */
export function AllocationDonut({ percent, isDrawn }: AllocationDonutProps) {
  return (
    <div className="relative mx-auto size-16">
      <svg
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        className="size-full -rotate-90"
      >
        <circle
          cx={DONUT_CENTER}
          cy={DONUT_CENTER}
          r={DONUT_RADIUS}
          fill="none"
          strokeWidth={DONUT_STROKE}
          className="stroke-white/10"
        />
        <motion.circle
          cx={DONUT_CENTER}
          cy={DONUT_CENTER}
          r={DONUT_RADIUS}
          fill="none"
          strokeWidth={DONUT_STROKE}
          strokeLinecap="round"
          className="stroke-indigo-400"
          initial={false}
          animate={{ pathLength: isDrawn ? percent / PERCENT_SCALE_MAX : 0 }}
          transition={{ duration: SHOWCASE_DRAW_S, ease: "easeInOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white tabular-nums">
        {percent}%
      </span>
    </div>
  );
}

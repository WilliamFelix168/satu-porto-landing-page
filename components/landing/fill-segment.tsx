"use client";

import { motion } from "motion/react";

import { FILL_S } from "@/lib/card-motion";
import { cn } from "@/lib/utils";

interface FillSegmentProps {
  /** Final width, 0 to 100 percent of the track. */
  percent: number;
  /** Filled; false collapses it to the left edge. */
  isFilled: boolean;
  /** Stagger delay when filling. */
  delayS?: number;
  className?: string;
}

/**
 * A bar segment that fills from the left. Animates `scaleX` (a transform),
 * never `width`, so it stays cheap with many visuals on the page.
 */
export function FillSegment({
  percent,
  isFilled,
  delayS = 0,
  className,
}: FillSegmentProps) {
  return (
    <motion.span
      style={{ width: `${percent}%` }}
      className={cn("block h-full origin-left", className)}
      initial={false}
      animate={{ scaleX: isFilled ? 1 : 0 }}
      transition={
        isFilled ? { duration: FILL_S, delay: delayS } : { duration: 0 }
      }
    />
  );
}

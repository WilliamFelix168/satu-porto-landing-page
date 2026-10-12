"use client";

import { motion } from "motion/react";

import {
  msToSeconds,
  SCAN_BEAM_OPACITY,
  SHOWCASE_START_DELAY_MS,
} from "@/lib/ai-showcase-motion";
import { cn } from "@/lib/utils";

/** The beam starts one full parent-height above, so it enters from the top. */
const BEAM_START_Y = "-100%";
const BEAM_END_Y = "0%";

interface ScanBeamProps {
  /** Changes on every loop so the sweep restarts. */
  cycle: number;
  /** Wait before the sweep starts. Defaults to the showcase start delay. */
  delayS?: number;
  /** Time to travel from the top edge to the bottom edge. */
  durationS: number;
  className?: string;
}

/**
 * Glowing emerald line that sweeps once from top to bottom of its
 * (relatively positioned, clipped) parent. The parent-sized layer moves with
 * a transform, never `top`, and the line rides its bottom edge.
 */
export function ScanBeam({
  cycle,
  delayS = msToSeconds(SHOWCASE_START_DELAY_MS),
  durationS,
  className,
}: ScanBeamProps) {
  return (
    <motion.span
      key={cycle}
      aria-hidden="true"
      data-scan-beam=""
      className={cn(
        "pointer-events-none absolute inset-0 z-10 block",
        className,
      )}
      initial={{ y: BEAM_START_Y, opacity: 0 }}
      animate={{ y: BEAM_END_Y, opacity: SCAN_BEAM_OPACITY }}
      transition={{ delay: delayS, duration: durationS, ease: "linear" }}
    >
      <span className="absolute inset-x-0 bottom-0 block h-10 max-h-full bg-gradient-to-b from-transparent to-emerald-400/25 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-emerald-300 after:shadow-glow-emerald" />
    </motion.span>
  );
}

/**
 * Timing for a sweep that must finish inside a sequence's first step (step 0
 * lasts `SHOWCASE_START_DELAY_MS`): it starts immediately and spans the
 * whole window.
 */
export function stepZeroScanTiming(): { delayS: number; durationS: number } {
  return { delayS: 0, durationS: msToSeconds(SHOWCASE_START_DELAY_MS) };
}

/**
 * A scan that plays during step 0 of a `useShowcaseCycle` sequence, while it
 * is mounted (the default `ScanBeam` delay would start it just as step 0
 * ends and it unmounts).
 */
export function StepZeroScan({ cycle }: { cycle: number }) {
  return <ScanBeam cycle={cycle} {...stepZeroScanTiming()} />;
}

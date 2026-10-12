"use client";

import { motion } from "motion/react";

import {
  LIVE_DOT_PULSE_OPACITY,
  LIVE_DOT_PULSE_S,
  LIVE_DOT_PULSE_SCALE,
} from "@/lib/card-motion";

/** Emerald status dot; its halo pulses while `isPulsing` (in view only). */
export function LiveDot({ isPulsing }: { isPulsing: boolean }) {
  return (
    <span className="relative flex size-2">
      {isPulsing ? (
        <motion.span
          className="absolute inline-flex size-full rounded-full bg-emerald-400"
          animate={{
            scale: LIVE_DOT_PULSE_SCALE,
            opacity: LIVE_DOT_PULSE_OPACITY,
          }}
          transition={{ duration: LIVE_DOT_PULSE_S, repeat: Infinity }}
        />
      ) : null}
      <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
    </span>
  );
}

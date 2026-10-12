"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { SHOWCASE_PULSE_S } from "@/lib/ai-showcase-motion";
import { cn } from "@/lib/utils";

/** Outline opacity keyframes for one pulse: dim, bright, dim. */
const PULSE_OPACITY = [0.45, 1, 0.45];

interface DetectedFieldProps {
  children: ReactNode;
  /** Shows the outline once the scanner has read this field. */
  isDetected: boolean;
  /** Pulses the outline while the sequence plays; static otherwise. */
  isPulsing: boolean;
  className?: string;
}

/** Wraps a receipt field in an emerald bounding box once it is detected. */
export function DetectedField({
  children,
  isDetected,
  isPulsing,
  className,
}: DetectedFieldProps) {
  return (
    <span className={cn("relative block min-w-0", className)}>
      <motion.span
        className="pointer-events-none absolute -inset-1 rounded-md border border-emerald-400/80 bg-emerald-400/[0.06]"
        initial={false}
        animate={{
          opacity: !isDetected ? 0 : isPulsing ? PULSE_OPACITY : 1,
        }}
        transition={
          isDetected && isPulsing
            ? { duration: SHOWCASE_PULSE_S, repeat: Infinity }
            : undefined
        }
      />
      {children}
    </span>
  );
}

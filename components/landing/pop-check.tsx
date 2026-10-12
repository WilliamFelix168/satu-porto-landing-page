"use client";

import { motion } from "motion/react";

import { CheckBadge } from "@/components/landing/check-badge";
import { SHOWCASE_SPRING } from "@/lib/ai-showcase-motion";
import { cn } from "@/lib/utils";

/** A check badge that springs in when `isShown` turns true. */
export function PopCheck({
  isShown,
  className,
}: {
  isShown: boolean;
  className?: string;
}) {
  return (
    <motion.span
      className={cn("inline-flex", className)}
      initial={false}
      animate={{ scale: isShown ? 1 : 0 }}
      transition={SHOWCASE_SPRING}
    >
      <CheckBadge />
    </motion.span>
  );
}

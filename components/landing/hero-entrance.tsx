import type { ReactNode } from "react";

import { heroEntranceStyle } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HeroEntranceProps {
  /** Position in the hero; each step starts a little later than the last. */
  index: number;
  children: ReactNode;
  className?: string;
}

/**
 * Staggered slide-up for above-the-fold content, done in CSS so it needs no
 * JavaScript and never hides content. Skipped entirely under reduced motion.
 */
export function HeroEntrance({
  index,
  children,
  className,
}: HeroEntranceProps) {
  return (
    <div
      style={heroEntranceStyle(index)}
      className={cn("motion-safe:animate-hero-rise", className)}
    >
      {children}
    </div>
  );
}

"use client";

import { Pause, Play } from "lucide-react";
import { useState, type ReactNode } from "react";

import { focusRingClassName } from "@/components/landing/button-styles";
import { marqueeContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface PausableMarqueeProps {
  /** The section heading, shown next to the pause/play toggle. */
  heading: ReactNode;
  /** The ticker tracks. */
  children: ReactNode;
}

/**
 * Ticker frame with a pause/play toggle (WCAG 2.2.2). The tracks also pause
 * while the pointer is over them. The toggle is hidden when the visitor
 * prefers reduced motion, because the ticker does not move then.
 */
export function PausableMarquee({ heading, children }: PausableMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const Icon = isPaused ? Play : Pause;

  return (
    <div>
      <div className="mb-6 flex items-center justify-center gap-2">
        {heading}
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={
            isPaused ? marqueeContent.playLabel : marqueeContent.pauseLabel
          }
          className={cn(
            // 32px visual, with the hit area grown to 44px.
            "relative inline-flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors after:absolute after:-inset-1.5 hover:bg-white/[0.06] hover:text-white motion-reduce:hidden",
            focusRingClassName,
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </button>
      </div>
      {/*
        The "ticker" group is only the track viewport, not the toggle, so
        hovering or focusing the toggle never holds the ticker paused.
      */}
      <div
        data-paused={isPaused}
        className="group/ticker flex overflow-clip mask-fade-x"
      >
        {children}
      </div>
    </div>
  );
}

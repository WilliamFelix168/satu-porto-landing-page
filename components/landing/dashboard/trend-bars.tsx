"use client";

import { motion } from "motion/react";

import { dashboardContent as dashboard } from "@/lib/content";
import {
  BAR_GROW_S,
  BAR_STAGGER_S,
  LATEST_BAR_PULSE_OPACITY,
  LATEST_BAR_PULSE_S,
} from "@/lib/dashboard-motion";
import { cn } from "@/lib/utils";

interface TrendBarsProps {
  /** Bars stand at full height; false collapses them to the baseline. */
  isRevealed: boolean;
  /** The latest bar pulses gently while the card's loop runs. */
  isLooping: boolean;
}

/** Monthly net-worth bars that grow from the baseline, one after another. */
export function TrendBars({ isRevealed, isLooping }: TrendBarsProps) {
  const lastIndex = dashboard.trend.length - 1;
  return (
    <div>
      <p className="text-xs text-zinc-400">{dashboard.trendLabel}</p>
      <div className="mt-4 flex h-32 items-end gap-1.5 sm:h-40 sm:gap-2">
        {dashboard.trend.map((point, index) => {
          const isLatest = index === lastIndex;
          const shouldPulse = isLatest && isLooping;
          return (
            <div
              key={point.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <motion.div
                style={{ height: `${point.relativeHeight}%` }}
                className={cn(
                  "w-full origin-bottom rounded-t-md bg-gradient-to-t",
                  isLatest
                    ? "from-emerald-500/70 to-emerald-300 shadow-glow-emerald"
                    : "from-indigo-500/20 to-emerald-400/50",
                )}
                initial={false}
                animate={{
                  scaleY: isRevealed ? 1 : 0,
                  opacity: shouldPulse ? LATEST_BAR_PULSE_OPACITY : 1,
                }}
                transition={
                  isRevealed
                    ? {
                        scaleY: {
                          duration: BAR_GROW_S,
                          delay: index * BAR_STAGGER_S,
                        },
                        opacity: shouldPulse
                          ? { duration: LATEST_BAR_PULSE_S, repeat: Infinity }
                          : undefined,
                      }
                    : { duration: 0 }
                }
              />
              <span className="hidden text-2xs text-zinc-400 sm:block">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

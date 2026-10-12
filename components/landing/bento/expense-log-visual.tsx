"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { FeatureVisualPanel } from "@/components/landing/feature-visual-panel";
import { FillSegment } from "@/components/landing/fill-segment";
import { LegendDot } from "@/components/landing/legend-dot";
import { MockChip } from "@/components/landing/mock-chip";
import { SHOWCASE_FADE_S, SHOWCASE_SPRING } from "@/lib/ai-showcase-motion";
import type { ExpenseLogDisplay } from "@/lib/card-display";
import {
  EXPENSE_LOG_STEP_MS,
  EXPENSE_SLOTS,
  EXPENSE_TOTAL_COUNT_UP_STEP_MS,
  FILL_STAGGER_S,
} from "@/lib/card-motion";
import { featuresContent as features } from "@/lib/content";
import { useCountUp } from "@/lib/use-count-up";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

/** Legend dot and bar colour for each category, in breakdown order. */
const CATEGORY_COLOR_CLASS_NAMES = [
  "bg-emerald-400",
  "bg-indigo-400",
  "bg-amber-300",
];

/** The category bar fills on the first push. */
enum ExpenseStep {
  BarsFilled = 1,
}

/** A row slides in from above its slot (fully, by its own height). */
const SLOT_ENTER_Y = "-100%";

/**
 * Smart Expense card: the monthly total counts up while new entries push in
 * at the top of exactly three fixed rows (height never changes), and the
 * category breakdown bar fills segment by segment.
 */
export function ExpenseLogVisual({ display }: { display: ExpenseLogDisplay }) {
  const ref = useRef<HTMLDivElement>(null);
  const pushCount = display.entries.length - EXPENSE_SLOTS;
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: pushCount,
    stepMs: EXPENSE_LOG_STEP_MS,
  });
  const total = useCountUp(display.totalCountUp, {
    isActive: isPlaying,
    stepMs: EXPENSE_TOTAL_COUNT_UP_STEP_MS,
    restartKey: cycle,
  });
  // The latest three entries after `step` pushes, newest on top.
  const slots = display.entries.slice(step, step + EXPENSE_SLOTS).reverse();

  return (
    <div ref={ref}>
      <FeatureVisualPanel>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-zinc-400">
            {features.expenseLog.monthLabel}
          </span>
          <span className="text-base font-semibold tracking-tight text-white tabular-nums">
            {total.text}
          </span>
        </div>

        <ul className="space-y-2">
          {slots.map((entry, slot) => (
            <li
              key={slot}
              data-expense-slot=""
              className="h-11 overflow-clip rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <motion.div
                key={entry.label}
                className="flex h-full items-center justify-between gap-3 px-3"
                initial={isPlaying ? { y: SLOT_ENTER_Y, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: SHOWCASE_FADE_S }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs text-white">
                    {entry.label}
                  </span>
                  <motion.span
                    className="mt-0.5 inline-flex origin-left"
                    initial={isPlaying && slot === 0 ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={SHOWCASE_SPRING}
                  >
                    <MockChip className="px-1.5 py-0 text-2xs">
                      {entry.category}
                    </MockChip>
                  </motion.span>
                </span>
                <span className="shrink-0 text-xs text-rose-300 tabular-nums">
                  {entry.amount}
                </span>
              </motion.div>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className="flex h-2 gap-0.5 overflow-clip rounded-full bg-white/[0.06]">
            {features.expenseCategories.map((category, index) => (
              <FillSegment
                key={category.label}
                percent={category.percent}
                isFilled={step >= ExpenseStep.BarsFilled}
                delayS={index * FILL_STAGGER_S}
                className={CATEGORY_COLOR_CLASS_NAMES[index]}
              />
            ))}
          </div>
          <ul className="mt-2.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-2xs text-zinc-400">
            {features.expenseCategories.map((category, index) => (
              <li key={category.label} className="flex items-center gap-1.5">
                <LegendDot className={CATEGORY_COLOR_CLASS_NAMES[index]} />
                {category.label}
                <span className="text-zinc-200 tabular-nums">
                  {category.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FeatureVisualPanel>
    </div>
  );
}

"use client";

import {
  ArrowUp,
  ChartPie,
  PiggyBank,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { AllocationDonut } from "@/components/landing/ai/allocation-donut";
import { chatBubbleClassName } from "@/components/landing/chat-bubble";
import { IconTile, IconTileSize } from "@/components/landing/icon-tile";
import { Sparkline } from "@/components/landing/sparkline";
import { TypingDots } from "@/components/landing/typing-dots";
import { INSIGHTS_STEP_MS, showcaseReveal } from "@/lib/ai-showcase-motion";
import { aiContent, InsightTone } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const { insightsPanel } = aiContent;
/** Each insight takes two steps: "typing", then the bubble. */
const STEPS_PER_INSIGHT = 2;
const STEP_COUNT = insightsPanel.insights.length * STEPS_PER_INSIGHT;
/** The charts draw in on the first step. */
const CHARTS_STEP = 1;

const insightIcon: Record<InsightTone, LucideIcon> = {
  [InsightTone.Spending]: TrendingUp,
  [InsightTone.Savings]: PiggyBank,
  [InsightTone.Allocation]: ChartPie,
};

const insightIconClassName: Record<InsightTone, string> = {
  [InsightTone.Spending]: "text-rose-300",
  [InsightTone.Savings]: "text-emerald-300",
  [InsightTone.Allocation]: "text-indigo-300",
};

/** Assistant panel: insight bubbles typed out one by one, plus two charts. */
export function InsightsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying } = useShowcaseCycle(ref, {
    stepCount: STEP_COUNT,
    stepMs: INSIGHTS_STEP_MS,
  });
  const areChartsDrawn = step >= CHARTS_STEP;

  return (
    <div ref={ref} aria-hidden="true" className="p-5 sm:p-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <IconTile
          size={IconTileSize.Small}
          className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
        >
          <Sparkles className="size-4" />
        </IconTile>
        <p className="text-sm font-medium text-white">
          {insightsPanel.assistantName}
        </p>
        <span className="ml-auto size-2 rounded-full bg-emerald-400 shadow-glow-emerald-soft" />
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <ul className="min-w-0 flex-1 space-y-3">
          {insightsPanel.insights.map((insight, index) => {
            const typingStep = index * STEPS_PER_INSIGHT + 1;
            const isTyping = isPlaying && step === typingStep;
            const isShown = step > typingStep;
            const Icon = insightIcon[insight.tone];
            return (
              <li key={insight.tone} className="relative">
                {isTyping ? (
                  <span className="absolute top-0 left-0">
                    <TypingDots />
                  </span>
                ) : null}
                <motion.p
                  {...showcaseReveal(isShown)}
                  className={cn(
                    chatBubbleClassName,
                    "flex items-start gap-2.5 text-sm text-zinc-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      insightIconClassName[insight.tone],
                    )}
                  />
                  {insight.text}
                </motion.p>
              </li>
            );
          })}
        </ul>

        <div className="grid grid-cols-2 gap-3 sm:w-40 sm:grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <AllocationDonut
              percent={insightsPanel.allocation.percent}
              isDrawn={areChartsDrawn}
            />
            <p className="mt-2 text-center text-2xs text-zinc-400">
              {insightsPanel.allocation.label}{" "}
              {insightsPanel.allocation.caption}
            </p>
          </div>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-2xs text-zinc-400">
              {insightsPanel.savings.label}
            </p>
            <Sparkline
              values={insightsPanel.savings.trend}
              isDrawn={areChartsDrawn}
              className="mt-2 h-12 flex-1"
            />
            <p className="mt-2 text-2xs font-medium text-emerald-300">
              {insightsPanel.savings.caption}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-1.5 pl-4">
        <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">
          {insightsPanel.composerPlaceholder}
        </span>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-zinc-950">
          <ArrowUp className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

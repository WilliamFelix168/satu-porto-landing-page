"use client";

import { Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { ChangePill } from "@/components/landing/change-pill";
import { HoldingRow } from "@/components/landing/dashboard/holding-row";
import { TrendBars } from "@/components/landing/dashboard/trend-bars";
import { showcaseReveal } from "@/lib/ai-showcase-motion";
import { dashboardContent as dashboard } from "@/lib/content";
import type { DashboardDisplay } from "@/lib/dashboard-display";
import { ROW_STAGGER_S } from "@/lib/dashboard-motion";
import { useLiveDashboard } from "@/lib/use-live-dashboard";

/**
 * The hero card's content. Starts from the static, server-formatted values
 * and animates only on the client (see `useLiveDashboard`).
 */
export function LiveDashboard({ display }: { display: DashboardDisplay }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLiveDashboard(ref, {
    frameCount: display.frames.length,
    countUp: display.countUp,
  });
  const frame = display.frames[live.frameIndex];

  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div>
          <p className="text-xs text-zinc-400">{dashboard.netWorthLabel}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-bold tracking-tighter text-white tabular-nums sm:text-4xl">
              {live.countUpText ?? frame.netWorth}
            </p>
            <ChangePill
              value={display.netWorthChange}
              isGain={display.isNetWorthGain}
              suffix={dashboard.netWorthChangeLabel}
            />
          </div>
        </div>
        <TrendBars isRevealed={live.isRevealed} isLooping={live.isLooping} />
      </div>

      <div className="lg:col-span-2">
        <p className="text-xs text-zinc-400">{dashboard.assetsTitle}</p>
        <ul className="mt-1 divide-y divide-white/5">
          {frame.assets.map((asset, index) => (
            <HoldingRow
              key={asset.symbol}
              asset={asset}
              isRevealed={live.isRevealed}
              delayS={index * ROW_STAGGER_S}
              flashKey={
                live.tickCount > 0 && frame.tickedSymbol === asset.symbol
                  ? live.tickCount
                  : null
              }
              isFlashUp={frame.isTickUp}
            />
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10 pt-5 lg:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-zinc-400">{dashboard.expensesTitle}</p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Wallet aria-hidden="true" className="size-3.5" />
            {dashboard.monthlySpendLabel}
            <span className="font-medium text-white tabular-nums">
              {display.monthlySpend}
            </span>
          </p>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {display.expenses.map((expense, index) => (
            <motion.li
              key={expense.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
              {...showcaseReveal(live.isRevealed, {
                delayS: (frame.assets.length + index) * ROW_STAGGER_S,
                hideInstantly: true,
              })}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-white">
                  {expense.label}
                </span>
                <span className="block text-xs text-zinc-400">
                  {expense.category}
                </span>
              </span>
              <span className="shrink-0 text-sm font-medium text-rose-300 tabular-nums">
                {expense.amount}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

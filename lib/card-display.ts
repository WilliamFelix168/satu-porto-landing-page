import {
  EXPENSE_SLOTS,
  EXPENSE_TOTAL_COUNT_UP_STEPS,
  NET_WORTH_COUNT_UP_STEPS,
} from "@/lib/card-motion";
import {
  dashboardContent,
  featuresContent,
  howItWorksContent,
} from "@/lib/content";
import { buildCountUp, netWorthCountUpStart } from "@/lib/count-up";
import { formatIdr, formatPercentChange } from "@/lib/format";

/**
 * Display-ready values for the animated card visuals. Built on the server and
 * passed to the client visuals as plain strings (no `Intl` in the browser).
 */

export interface DisplayExpenseEntry {
  label: string;
  category: string;
  amount: string;
}

export interface AssetSyncDisplay {
  portfolioValue: string;
}

export interface ExpenseLogDisplay {
  /** Oldest first, as in content. */
  entries: DisplayExpenseEntry[];
  /** Monthly total counting up from month-to-date to the final total. */
  totalCountUp: string[];
}

export interface NetWorthSplitDisplay {
  netWorthCountUp: string[];
  monthlyChange: string;
  isMonthlyGain: boolean;
  totalAssets: string;
  spentThisMonth: string;
}

export interface StepReceiptDisplay {
  amount: string;
}

export function getAssetSyncDisplay(): AssetSyncDisplay {
  return { portfolioValue: formatIdr(featuresContent.assetSyncValueIdr) };
}

export function getExpenseLogDisplay(): ExpenseLogDisplay {
  const { entries, monthToDateIdr } = featuresContent.expenseLog;
  // The first slots' worth of entries are already in the month-to-date
  // total; the ones pushed in during the loop add to it.
  const pushed = entries.slice(EXPENSE_SLOTS);
  const totalIdr =
    monthToDateIdr + pushed.reduce((sum, entry) => sum + entry.amountIdr, 0);
  return {
    entries: entries.map((entry) => ({
      label: entry.label,
      category: entry.category,
      amount: formatIdr(-entry.amountIdr),
    })),
    totalCountUp: buildCountUp(totalIdr, EXPENSE_TOTAL_COUNT_UP_STEPS, {
      startIdr: monthToDateIdr,
    }),
  };
}

export function getNetWorthSplitDisplay(): NetWorthSplitDisplay {
  return {
    netWorthCountUp: buildCountUp(
      dashboardContent.netWorthIdr,
      NET_WORTH_COUNT_UP_STEPS,
      { startIdr: netWorthCountUpStart(dashboardContent.netWorthIdr) },
    ),
    monthlyChange: formatPercentChange(dashboardContent.netWorthChangePercent),
    isMonthlyGain: dashboardContent.netWorthChangePercent >= 0,
    totalAssets: formatIdr(featuresContent.netWorthSplit.totalAssetsIdr),
    spentThisMonth: formatIdr(dashboardContent.monthlySpendIdr),
  };
}

export function getStepReceiptDisplay(): StepReceiptDisplay {
  return { amount: formatIdr(howItWorksContent.visuals.receipt.amountIdr) };
}

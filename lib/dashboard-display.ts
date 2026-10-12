import {
  dashboardContent,
  type AssetClass,
  type PriceTick,
} from "@/lib/content";
import { buildCountUp, netWorthCountUpStart } from "@/lib/count-up";
import { COUNT_UP_STEPS } from "@/lib/dashboard-motion";
import { formatIdr, formatPercentChange } from "@/lib/format";

/**
 * Display-ready values for the hero dashboard. Built on the server and passed
 * to the client card as plain strings, so no `Intl` call runs in the browser
 * and server and client text always match.
 */

export interface DisplayAsset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  value: string;
  change: string;
  isGain: boolean;
}

/** The whole card at one point of the price-tick loop. */
export interface DashboardFrame {
  netWorth: string;
  assets: DisplayAsset[];
  /**
   * Holding whose tick led to this frame. For frame 0 that is the last tick,
   * which brings the loop back to the start.
   */
  tickedSymbol: string | null;
  /** Whether that move was up (green flash) or down (red flash). */
  isTickUp: boolean;
}

export interface DisplayExpense {
  label: string;
  category: string;
  amount: string;
}

export interface DashboardDisplay {
  /** Net worth from zero up to the real value; the last entry is exact. */
  countUp: string[];
  /** Frame 0 is the real (static) state; later frames follow the ticks. */
  frames: DashboardFrame[];
  netWorthChange: string;
  isNetWorthGain: boolean;
  monthlySpend: string;
  expenses: DisplayExpense[];
}

interface AssetState {
  valueIdr: number;
  changePercent: number;
}

function toFrame(
  states: Map<string, AssetState>,
  tick: PriceTick | null,
): DashboardFrame {
  const assets = dashboardContent.assets.map((asset) => {
    const state = states.get(asset.symbol) ?? asset;
    return {
      symbol: asset.symbol,
      name: asset.name,
      assetClass: asset.assetClass,
      value: formatIdr(state.valueIdr),
      change: formatPercentChange(state.changePercent),
      isGain: state.changePercent >= 0,
    };
  });
  const netWorthDelta = dashboardContent.assets.reduce(
    (sum, asset) =>
      sum +
      ((states.get(asset.symbol)?.valueIdr ?? asset.valueIdr) - asset.valueIdr),
    0,
  );
  return {
    netWorth: formatIdr(dashboardContent.netWorthIdr + netWorthDelta),
    assets,
    tickedSymbol: tick?.symbol ?? null,
    isTickUp: (tick?.deltaIdr ?? 0) >= 0,
  };
}

/** Applies the ticks in order; frame k shows the card after k ticks. */
export function buildFrames(): DashboardFrame[] {
  const states = new Map<string, AssetState>(
    dashboardContent.assets.map((asset) => [
      asset.symbol,
      { valueIdr: asset.valueIdr, changePercent: asset.changePercent },
    ]),
  );
  const frames = [toFrame(states, dashboardContent.ticks.at(-1) ?? null)];
  // The last tick brings every holding back to frame 0, which the loop
  // returns to, so it is not stored as a frame of its own.
  for (const tick of dashboardContent.ticks.slice(0, -1)) {
    const current = states.get(tick.symbol);
    if (!current) continue;
    states.set(tick.symbol, {
      valueIdr: current.valueIdr + tick.deltaIdr,
      changePercent: tick.changePercent,
    });
    frames.push(toFrame(states, tick));
  }
  return frames;
}

export function getDashboardDisplay(): DashboardDisplay {
  return {
    countUp: buildCountUp(dashboardContent.netWorthIdr, COUNT_UP_STEPS, {
      startIdr: netWorthCountUpStart(dashboardContent.netWorthIdr),
    }),
    frames: buildFrames(),
    netWorthChange: formatPercentChange(dashboardContent.netWorthChangePercent),
    isNetWorthGain: dashboardContent.netWorthChangePercent >= 0,
    monthlySpend: formatIdr(dashboardContent.monthlySpendIdr),
    expenses: dashboardContent.expenses.map((expense) => ({
      label: expense.label,
      category: expense.category,
      amount: formatIdr(-expense.amountIdr),
    })),
  };
}

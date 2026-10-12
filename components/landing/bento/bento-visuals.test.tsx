import { act, render } from "@testing-library/react";
import { useInView } from "motion/react";
import { describe, expect, it, vi } from "vitest";

import {
  ASSET_SYNC_STEP_COUNT,
  AssetSyncVisual,
  chartWindow,
} from "@/components/landing/bento/asset-sync-visual";
import { ExpenseLogVisual } from "@/components/landing/bento/expense-log-visual";
import {
  NetWorthSplitVisual,
  SplitStep,
} from "@/components/landing/bento/net-worth-split-visual";
import { SHOWCASE_START_DELAY_MS } from "@/lib/ai-showcase-motion";
import {
  getAssetSyncDisplay,
  getExpenseLogDisplay,
  getNetWorthSplitDisplay,
} from "@/lib/card-display";
import {
  ASSET_SYNC_STEP_MS,
  EXPENSE_LOG_STEP_MS,
  EXPENSE_TOTAL_COUNT_UP_STEP_MS,
  NET_WORTH_COUNT_UP_STEP_MS,
  NET_WORTH_SPLIT_STEP_MS,
  EXPENSE_SLOTS,
  VISIBLE_TICKER_CHIPS,
} from "@/lib/card-motion";
import { featuresContent } from "@/lib/content";
import { PERCENT_SCALE_MAX } from "@/lib/scale";
import {
  describeAnimatedVisual,
  plain,
  sequenceMs,
} from "@/test/animated-visual-suite";
import { stubMatchMedia } from "@/test/media-query";

/** Whether the sparkline is drawn (or fading out to redraw). */
function isChartDrawn(container: HTMLElement): boolean {
  return (
    container.querySelector("[data-drawn]")?.getAttribute("data-drawn") ===
    "true"
  );
}
const expenseDisplay = getExpenseLogDisplay();
const assetSyncDisplay = getAssetSyncDisplay();
const netWorthDisplay = getNetWorthSplitDisplay();

function activeBadges(container: HTMLElement) {
  return container.querySelectorAll('[data-active="true"]');
}

function slotLabels(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll("[data-expense-slot]"),
    (slot) => slot.textContent ?? "",
  );
}

const assetSyncSequenceMs = sequenceMs(
  ASSET_SYNC_STEP_COUNT,
  ASSET_SYNC_STEP_MS,
);
const pushCount = expenseDisplay.entries.length - EXPENSE_SLOTS;

describeAnimatedVisual({
  name: "AssetSyncVisual",
  renderVisual: () => <AssetSyncVisual display={assetSyncDisplay} />,
  // One chart step plus one per visible ticker badge.
  sequenceMs: assetSyncSequenceMs,
  startsHidden: false,
  expectFinished: (container) => {
    expect(isChartDrawn(container)).toBe(true);
    // Finished: no badge is mid-sync, and none is ever dimmed.
    expect(activeBadges(container)).toHaveLength(0);
    expect(container).toHaveTextContent(plain(assetSyncDisplay.portfolioValue));
  },
  expectStarted: (container) => {
    expect(isChartDrawn(container)).toBe(false);
  },
});

describe("AssetSyncVisual sync highlight", () => {
  it("highlights exactly one ticker badge at a time while syncing", async () => {
    vi.useFakeTimers();
    stubMatchMedia(false);
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(
      <AssetSyncVisual display={assetSyncDisplay} />,
    );

    // Chart step, then the first badge.
    await act(async () => {
      vi.advanceTimersByTime(SHOWCASE_START_DELAY_MS + ASSET_SYNC_STEP_MS);
    });
    expect(activeBadges(container)).toHaveLength(1);

    await act(async () => {
      vi.advanceTimersByTime(ASSET_SYNC_STEP_MS);
    });
    expect(activeBadges(container)).toHaveLength(1);
  });

  it("collapses the rest of the tickers into a +N badge", () => {
    const { container } = render(
      <AssetSyncVisual display={assetSyncDisplay} />,
    );
    expect(container).toHaveTextContent(
      `+${featuresContent.assetSyncSymbols.length - VISIBLE_TICKER_CHIPS}`,
    );
  });
});

describeAnimatedVisual({
  name: "ExpenseLogVisual",
  renderVisual: () => <ExpenseLogVisual display={expenseDisplay} />,
  sequenceMs: Math.max(
    sequenceMs(pushCount, EXPENSE_LOG_STEP_MS),
    (expenseDisplay.totalCountUp.length - 1) * EXPENSE_TOTAL_COUNT_UP_STEP_MS,
  ),
  expectFinished: (container) => {
    expect(container).toHaveTextContent(
      plain(expenseDisplay.totalCountUp.at(-1) ?? ""),
    );
    const newestFirst = expenseDisplay.entries.slice(-EXPENSE_SLOTS).reverse();
    const labels = slotLabels(container);
    expect(labels).toHaveLength(EXPENSE_SLOTS);
    newestFirst.forEach((entry, index) => {
      expect(labels[index]).toContain(entry.label);
    });
  },
  expectStarted: (container) => {
    expect(container).toHaveTextContent(plain(expenseDisplay.totalCountUp[0]));
    const labels = slotLabels(container);
    expect(labels).toHaveLength(EXPENSE_SLOTS);
    expect(labels[0]).toContain(
      expenseDisplay.entries[EXPENSE_SLOTS - 1].label,
    );
  },
});

describe("ExpenseLogVisual slots", () => {
  it("always shows exactly three rows, so the card never changes height", async () => {
    vi.useFakeTimers();
    stubMatchMedia(false);
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<ExpenseLogVisual display={expenseDisplay} />);

    for (let step = 0; step <= pushCount; step += 1) {
      expect(slotLabels(container)).toHaveLength(EXPENSE_SLOTS);
      await act(async () => {
        vi.advanceTimersByTime(EXPENSE_LOG_STEP_MS);
      });
    }
  });
});

describeAnimatedVisual({
  name: "NetWorthSplitVisual",
  renderVisual: () => <NetWorthSplitVisual display={netWorthDisplay} />,
  sequenceMs: Math.max(
    sequenceMs(SplitStep.Updated, NET_WORTH_SPLIT_STEP_MS),
    (netWorthDisplay.netWorthCountUp.length - 1) * NET_WORTH_COUNT_UP_STEP_MS,
  ),
  expectFinished: (container) => {
    expect(container).toHaveTextContent(
      plain(netWorthDisplay.netWorthCountUp.at(-1) ?? ""),
    );
    expect(container).toHaveTextContent(
      featuresContent.netWorthSplit.updatedLabel,
    );
  },
  expectStarted: (container) => {
    expect(container).toHaveTextContent(
      plain(netWorthDisplay.netWorthCountUp[0]),
    );
  },
});

describe("chartWindow", () => {
  it("starts on the original trend and peaks at the top of the scale", () => {
    const window = chartWindow(0);
    expect(window).toHaveLength(featuresContent.assetSyncTrend.length);
    expect(Math.max(...window)).toBe(PERCENT_SCALE_MAX);
  });

  it("slides one point further each loop", () => {
    const series = [
      ...featuresContent.assetSyncTrend,
      ...featuresContent.assetSyncExtension,
    ];
    const window = chartWindow(1);
    const peak = Math.max(...series.slice(1, 1 + window.length));
    expect(window.at(-1)).toBeCloseTo(
      (series[window.length] / peak) * PERCENT_SCALE_MAX,
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  getReceiptScanDisplay,
  getSnapImportDisplay,
} from "@/lib/ai-showcase-display";
import { aiContent, InsightTone } from "@/lib/content";
import { formatIdr } from "@/lib/format";

describe("AI showcase display values", () => {
  it("formats every holding and the screenshot total", () => {
    const display = getSnapImportDisplay();
    const { holdings } = aiContent.snapImport;

    expect(display.holdings.map((holding) => holding.value)).toEqual(
      holdings.map((holding) => formatIdr(holding.valueIdr)),
    );
    expect(display.totalValue).toBe(
      formatIdr(holdings.reduce((sum, holding) => sum + holding.valueIdr, 0)),
    );
  });

  it("formats every receipt line and a total that adds up", () => {
    const display = getReceiptScanDisplay();
    const { items } = aiContent.receiptScan;

    expect(display.items.map((item) => item.price)).toEqual(
      items.map((item) => formatIdr(item.priceIdr)),
    );
    expect(display.total).toBe(
      formatIdr(items.reduce((sum, item) => sum + item.priceIdr, 0)),
    );
  });

  it("keeps the pre-formatted savings amount in the insight copy in sync", () => {
    const savingsAmountIdr = 1_500_000;
    const savings = aiContent.insightsPanel.insights.find(
      (insight) => insight.tone === InsightTone.Savings,
    );
    expect(savings?.text).toContain(formatIdr(savingsAmountIdr));
  });
});

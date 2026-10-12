import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { dashboardContent } from "@/lib/content";
import { formatIdr, formatPercentChange } from "@/lib/format";

/**
 * `toHaveTextContent` collapses the no-break space inside rupiah amounts to a
 * regular space, so expectations are collapsed the same way.
 */
function idr(amount: number): string {
  return formatIdr(amount).replace(/\s/gu, " ");
}

function getPreview() {
  return screen.getByRole("img", { name: dashboardContent.accessibleLabel });
}

describe("DashboardPreview", () => {
  it("is announced once, as a labelled image", () => {
    render(<DashboardPreview />);
    expect(getPreview()).toBeInTheDocument();
  });

  it("shows the net worth in rupiah with its monthly change", () => {
    render(<DashboardPreview />);
    const preview = getPreview();

    expect(preview).toHaveTextContent(idr(dashboardContent.netWorthIdr));
    expect(preview).toHaveTextContent(
      formatPercentChange(dashboardContent.netWorthChangePercent),
    );
  });

  it("never lets its content widen the card on narrow phones", () => {
    // An implicit `auto` grid track grows to its widest content (the holding
    // rows), which pushed the card 13px past a 320px screen.
    const { container } = render(<DashboardPreview />);
    const grid = container.querySelector(".grid");

    expect(grid).toHaveClass("grid-cols-1");
  });

  it("stacks the expense tiles until there is room for three", () => {
    render(<DashboardPreview />);
    const firstExpense = within(getPreview()).getByText(
      dashboardContent.expenses[0].label,
    );
    const tiles = firstExpense.closest("ul");

    // Three-up at `sm` truncated the Indonesian labels ("Belanja dapur").
    expect(tiles).toHaveClass("md:grid-cols-3");
    expect(tiles).not.toHaveClass("sm:grid-cols-3");
  });

  it("draws one bar per trend point", () => {
    render(<DashboardPreview />);
    for (const point of dashboardContent.trend) {
      expect(within(getPreview()).getByText(point.label)).toBeInTheDocument();
    }
  });

  it("lists every holding with its value and change", () => {
    render(<DashboardPreview />);
    const preview = getPreview();

    for (const asset of dashboardContent.assets) {
      expect(preview).toHaveTextContent(asset.name);
      expect(preview).toHaveTextContent(idr(asset.valueIdr));
      expect(preview).toHaveTextContent(
        formatPercentChange(asset.changePercent),
      );
    }
  });

  it("includes the GoTo stock from the IDX", () => {
    render(<DashboardPreview />);
    expect(getPreview()).toHaveTextContent("GOTO");
  });

  it("lists each expense as a negative rupiah amount", () => {
    render(<DashboardPreview />);
    const preview = getPreview();

    for (const expense of dashboardContent.expenses) {
      expect(preview).toHaveTextContent(expense.label);
      expect(preview).toHaveTextContent(idr(-expense.amountIdr));
    }
  });

  it("colours losses differently from gains", () => {
    render(<DashboardPreview />);
    const loss = dashboardContent.assets.find(
      (asset) => asset.changePercent < 0,
    );
    const gain = dashboardContent.assets.find(
      (asset) => asset.changePercent > 0,
    );

    expect(loss).toBeDefined();
    expect(gain).toBeDefined();
    expect(
      within(getPreview()).getByText(
        formatPercentChange(loss?.changePercent ?? 0),
      ),
    ).toHaveClass("text-rose-300");
    expect(
      within(getPreview()).getAllByText(
        formatPercentChange(gain?.changePercent ?? 0),
      )[0],
    ).toHaveClass("text-emerald-300");
  });
});

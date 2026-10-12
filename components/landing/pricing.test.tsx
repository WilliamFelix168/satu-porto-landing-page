import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pricing } from "@/components/landing/pricing";
import { pricingContent } from "@/lib/content";
import { REVEAL_ATTRIBUTE } from "@/lib/motion";

describe("Pricing", () => {
  it("shows the plan badge with the shimmering border", () => {
    const { container } = render(<Pricing />);
    expect(screen.getByText(pricingContent.plan.badge)).toBeInTheDocument();
    expect(container.querySelector(".bg-shimmer-border")).toHaveClass(
      "motion-safe:animate-shimmer",
    );
  });

  it("pops in a check mark for every perk, visible without JavaScript", () => {
    render(<Pricing />);
    for (const perk of pricingContent.plan.perks) {
      const item = screen.getByText(perk).closest("li");
      const pop = item?.querySelector(`[${REVEAL_ATTRIBUTE}]`);
      expect(pop, perk).not.toBeNull();
      expect(pop?.querySelector("svg")).not.toBeNull();
    }
  });
});

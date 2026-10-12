import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturesBento } from "@/components/landing/features-bento";
import { featuresContent } from "@/lib/content";

describe("feature card anatomy", () => {
  it("puts every bento visual in the same shared panel", () => {
    const { container } = render(<FeaturesBento />);
    const cards = container.querySelectorAll("article");
    expect(cards).toHaveLength(featuresContent.features.length);

    const panelClassNames = new Set<string>();
    for (const card of cards) {
      const panels = card.querySelectorAll("[data-feature-panel]");
      expect(panels).toHaveLength(1);
      panelClassNames.add(panels[0].className);
    }
    // Identical styling and height in all three cards.
    expect(panelClassNames.size).toBe(1);
    expect([...panelClassNames][0]).toMatch(/md:h-\d+/);
  });

  it("does not stretch the visual to fill the card (no empty void above it)", () => {
    const { container } = render(<FeaturesBento />);
    for (const card of container.querySelectorAll("article")) {
      const html = card.innerHTML;
      expect(html).not.toMatch(/\bmt-auto\b[^"]*"[^>]*data-feature-panel/);
      const visualWrapper = card.querySelector("[aria-hidden='true'] > div");
      expect(visualWrapper?.className ?? "").not.toMatch(/flex-1|justify-end/);
      expect(card.lastElementChild?.className ?? "").not.toMatch(
        /flex-1|justify-end|mt-auto/,
      );
    }
  });

  it("reserves the same description height in every card", () => {
    const { container } = render(<FeaturesBento />);
    const classNames = new Set(
      Array.from(
        container.querySelectorAll("article h3 + p"),
        (p) => p.className,
      ),
    );
    expect(classNames.size).toBe(1);
    expect([...classNames][0]).toMatch(/min-h-\[\d+lh\]/);
  });
});

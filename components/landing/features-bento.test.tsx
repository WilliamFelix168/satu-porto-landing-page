import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturesBento } from "@/components/landing/features-bento";
import { featuresContent, HeadingId, SectionId } from "@/lib/content";

describe("FeaturesBento", () => {
  it("is the #features section, labelled by its title", () => {
    render(<FeaturesBento />);
    const section = screen.getByRole("region", { name: featuresContent.title });

    expect(section).toHaveAttribute("id", SectionId.Features);
    expect(section).toHaveAttribute("aria-labelledby", HeadingId.Features);
  });

  it("renders a card per feature with its description", () => {
    render(<FeaturesBento />);

    for (const feature of featuresContent.features) {
      const card = screen
        .getByRole("heading", { level: 3, name: feature.title })
        .closest("article");
      expect(card).not.toBeNull();
      expect(
        within(card as HTMLElement).getByText(feature.description),
      ).toBeInTheDocument();
    }
  });

  it("stacks on mobile, pairs on tablets and shows three equal columns from lg", () => {
    render(<FeaturesBento />);
    const cells = featuresContent.features.map(
      (feature) =>
        screen
          .getByRole("heading", { level: 3, name: feature.title })
          .closest("article")?.parentElement,
    );
    const grid = cells[0]?.parentElement;

    expect(grid).toHaveClass("grid", "md:grid-cols-2", "lg:grid-cols-3");
    expect(grid?.className).not.toMatch(/(^|\s)grid-cols-|grid-rows|row-span/);
    // No card spans more than one column on desktop.
    for (const cell of cells) {
      expect(cell?.className).not.toMatch(/lg:col-span-[2-9]|row-span/);
    }
    // The odd card out runs full width on tablets only.
    expect(cells.at(-1)).toHaveClass("md:col-span-2", "lg:col-span-1");
  });

  it("uses glass cards with a brighter border on hover", () => {
    render(<FeaturesBento />);
    for (const card of screen.getAllByRole("article")) {
      expect(card).toHaveClass(
        "border-white/10",
        "bg-white/[0.02]",
        "hover:border-white/20",
      );
    }
  });

  it("hides the decorative flourishes and icons from screen readers", () => {
    const { container } = render(<FeaturesBento />);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });
});

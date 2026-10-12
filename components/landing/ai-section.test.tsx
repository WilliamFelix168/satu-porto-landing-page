import { act, render, screen, within } from "@testing-library/react";
import { useInView } from "motion/react";
import { describe, expect, it, vi } from "vitest";

import { AiSection } from "@/components/landing/ai-section";
import {
  SHOWCASE_START_DELAY_MS,
  SNAP_IMPORT_STEP_MS,
} from "@/lib/ai-showcase-motion";
import * as content from "@/lib/content";
import { aiContent, HeadingId, SectionId } from "@/lib/content";
import { formatIdr } from "@/lib/format";
import { stubMatchMedia } from "@/test/media-query";

/** `toHaveTextContent` collapses the no-break space inside rupiah amounts. */
function idr(amount: number): string {
  return formatIdr(amount).replace(/\s/gu, " ");
}

const receiptTotal = aiContent.receiptScan.items.reduce(
  (sum, item) => sum + item.priceIdr,
  0,
);

function getSection() {
  return screen.getByRole("region", {
    name: `${aiContent.title} ${aiContent.titleHighlight}`,
  });
}

/** The three decorative visual roots, one per feature row. */
function getVisuals(section: HTMLElement) {
  return Array.from(
    section.querySelectorAll<HTMLElement>(
      ':scope li > div:last-child [aria-hidden="true"]',
    ),
  ).filter(
    (element) =>
      element.parentElement?.closest('[aria-hidden="true"]') === null &&
      (element.textContent ?? "").trim() !== "",
  );
}

describe("AiSection", () => {
  it("is the #ai anchor, labelled by its gradient heading", () => {
    render(<AiSection />);
    const section = getSection();

    expect(section).toHaveAttribute("id", SectionId.Ai);
    expect(section).toHaveAttribute("aria-labelledby", HeadingId.Ai);
    expect(screen.getByText(aiContent.titleHighlight)).toHaveClass(
      "bg-clip-text",
    );
    // The pill is visible to everyone (the assistant name inside the mock is not).
    expect(
      screen
        .getAllByText(aiContent.badge)
        .filter((node) => node.closest('[aria-hidden="true"]') === null),
    ).toHaveLength(1);
  });

  it("renders every feature's title, description and benefit bullets", () => {
    render(<AiSection />);

    for (const feature of aiContent.features) {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: feature.title,
      });
      const row = heading.closest("li");
      expect(row).not.toBeNull();
      const scope = within(row as HTMLElement);
      expect(scope.getByText(feature.description)).toBeInTheDocument();
      for (const bullet of feature.bullets) {
        expect(scope.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it("shows the not-financial-advice disclaimer", () => {
    render(<AiSection />);
    expect(within(getSection()).getByText(aiContent.disclaimer)).toHaveClass(
      "text-zinc-400",
    );
  });

  it("never phrases copy as advice, recommendations or promised returns (OJK)", () => {
    // FAQ questions are the visitor's voice (e.g. "does it give investment
    // advice?") and are checked below; every other string is our claim.
    const ourClaims = {
      ...content,
      faqContent: content.faqContent.items.map((item) => item.answer),
    };
    const copy = JSON.stringify(ourClaims).toLowerCase();
    for (const banned of [
      // Indonesian (the live copy)
      "rekomendasi beli",
      "rekomendasi jual",
      "pasti untung",
      "jaminan return",
      "saran investasi",
      "dijamin",
      "sebaiknya beli",
      "sebaiknya jual",
      // English, in case any copy is reintroduced
      "you should buy",
      "you should sell",
      "guaranteed",
      "recommend",
      "investment advice",
    ]) {
      expect(copy, banned).not.toContain(banned);
    }
  });

  it("answers the investment-advice FAQ with a clear no", () => {
    const adviceQuestion = content.faqContent.items.find((item) =>
      item.question.toLowerCase().includes("saran investasi"),
    );

    expect(adviceQuestion?.answer).toMatch(/^Tidak\./);
    expect(adviceQuestion?.answer).toContain(
      content.FINANCIAL_ADVICE_DISCLAIMER,
    );
  });

  it("hides each visual from assistive technology", () => {
    render(<AiSection />);
    const visuals = getVisuals(getSection());

    expect(visuals).toHaveLength(aiContent.features.length);
    // Nothing inside the visuals is reachable by role.
    for (const visual of visuals) {
      expect(
        within(visual).queryAllByRole("listitem", { hidden: false }),
      ).toHaveLength(0);
    }
  });

  it("renders the finished state on the server and while out of view", () => {
    render(<AiSection />);
    const section = getSection();

    expect(section).toHaveTextContent(aiContent.snapImport.imported);
    expect(section).toHaveTextContent(aiContent.receiptScan.toast);
    expect(section).toHaveTextContent(idr(receiptTotal));
    for (const insight of aiContent.insightsPanel.insights) {
      expect(section).toHaveTextContent(insight.text.replace(/\s/gu, " "));
    }
  });

  describe("with reduced motion", () => {
    it("shows the completed visuals in view, without scanning or looping", async () => {
      vi.useFakeTimers();
      stubMatchMedia(true);
      vi.mocked(useInView).mockReturnValue(true);
      const { container } = render(<AiSection />);

      expect(getSection()).toHaveTextContent(aiContent.snapImport.imported);
      expect(getSection()).toHaveTextContent(idr(receiptTotal));
      for (const holding of aiContent.snapImport.holdings) {
        expect(getSection()).toHaveTextContent(holding.quantity);
      }
      expect(getSection()).toHaveTextContent(
        aiContent.insightsPanel.insights[0].text,
      );
      // No scan beams and no timers queued.
      expect(container.querySelector(".after\\:bg-emerald-300")).toBeNull();
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("in view, with motion allowed", () => {
    it("plays the screenshot import from empty to imported", async () => {
      vi.useFakeTimers();
      stubMatchMedia(false);
      vi.mocked(useInView).mockReturnValue(true);
      render(<AiSection />);
      const total = aiContent.snapImport.holdings.length;

      expect(getSection()).toHaveTextContent(
        aiContent.snapImport.importing(0, total),
      );

      await act(async () => {
        vi.advanceTimersByTime(
          SHOWCASE_START_DELAY_MS + total * SNAP_IMPORT_STEP_MS,
        );
      });

      expect(getSection()).toHaveTextContent(aiContent.snapImport.imported);
    });
  });
});

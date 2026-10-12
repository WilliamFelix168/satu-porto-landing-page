import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FaqSection } from "@/components/landing/faq-section";
import { faqContent, HeadingId, SectionId } from "@/lib/content";

/** Enough questions to be useful, few enough to scan. */
const MIN_FAQ_ITEMS = 5;
const MAX_FAQ_ITEMS = 7;

function getSection() {
  return screen.getByRole("region", { name: faqContent.title });
}

describe("FaqSection", () => {
  it("has a scannable number of questions", () => {
    expect(faqContent.items.length).toBeGreaterThanOrEqual(MIN_FAQ_ITEMS);
    expect(faqContent.items.length).toBeLessThanOrEqual(MAX_FAQ_ITEMS);
  });

  it("is the #faq section, labelled by its h2", () => {
    render(<FaqSection />);
    const section = getSection();
    const heading = within(section).getByRole("heading", {
      level: 2,
      name: faqContent.title,
    });

    expect(section).toHaveAttribute("id", SectionId.Faq);
    expect(heading).toHaveAttribute("id", HeadingId.Faq);
  });

  it("renders every question as a native disclosure with its answer in the DOM", () => {
    const { container } = render(<FaqSection />);
    const disclosures = container.querySelectorAll("details");

    expect(disclosures).toHaveLength(faqContent.items.length);
    faqContent.items.forEach((item, index) => {
      const disclosure = disclosures[index] as HTMLDetailsElement;
      const summary = disclosure.querySelector("summary");

      expect(disclosure.open).toBe(false);
      expect(summary).toHaveTextContent(item.question);
      // Present (and crawlable) even while collapsed.
      expect(disclosure).toHaveTextContent(item.answer);
    });
  });

  it("marks each question as an h3 under the section heading", () => {
    render(<FaqSection />);
    const questions = within(getSection()).getAllByRole("heading", {
      level: 3,
    });

    expect(questions.map((question) => question.textContent)).toEqual(
      faqContent.items.map((item) => item.question),
    );
  });

  it("reaches each question by Tab and toggles it open and closed", async () => {
    // Enter/Space on <summary> is native browser behaviour (checked in the
    // browser); jsdom only implements the click activation.
    const user = userEvent.setup();
    const { container } = render(<FaqSection />);
    const disclosures = Array.from(container.querySelectorAll("details"));

    for (const disclosure of disclosures) {
      await user.tab();
      expect(disclosure.querySelector("summary")).toHaveFocus();
    }

    const [first] = disclosures;
    const summary = first.querySelector("summary") as HTMLElement;
    await user.click(summary);
    expect(first.open).toBe(true);
    await user.click(summary);
    expect(first.open).toBe(false);
  });

  it("hides the chevron from assistive technology", () => {
    const { container } = render(<FaqSection />);
    for (const icon of container.querySelectorAll("summary svg")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});

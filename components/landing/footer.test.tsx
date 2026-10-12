import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/landing/footer";
import {
  footerContent,
  footerLinks,
  navLinks,
  SectionId,
  sectionHref,
} from "@/lib/content";

function getCredit() {
  return screen.getByRole("link", {
    name: `${footerContent.credit.label} ${footerContent.credit.newTabHint}`,
  });
}

describe("Footer", () => {
  it("credits Nusa Techno Jaya with a link that opens safely in a new tab", () => {
    render(<Footer />);
    const credit = getCredit();

    expect(credit).toHaveTextContent("Powered by Nusa Techno Jaya");
    expect(credit).toHaveAttribute("href", "https://www.nuteja.biz.id");
    expect(credit).toHaveAttribute("target", "_blank");
    expect(credit).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("tells screen reader users the credit opens a new tab", () => {
    render(<Footer />);
    expect(
      within(getCredit()).getByText(footerContent.credit.newTabHint),
    ).toHaveClass("sr-only");
  });

  it("styles the credit like the other footer links", () => {
    render(<Footer />);
    expect(getCredit()).toHaveClass("hover:text-white");
  });

  it("repeats the section links and adds the FAQ", () => {
    render(<Footer />);
    expect(footerLinks).toEqual(expect.arrayContaining([...navLinks]));
    expect(footerLinks.map((link) => link.href)).toContain(
      sectionHref(SectionId.Faq),
    );
    for (const link of footerLinks) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });

  it("uses AA-contrast text for its content", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer > div")).toHaveClass(
      "text-zinc-400",
    );
    expect(container.querySelector(".text-zinc-500")).toBeNull();
  });
});

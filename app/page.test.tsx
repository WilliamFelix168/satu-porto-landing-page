import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import {
  ctaContent,
  dashboardContent,
  featuresContent,
  heroContent,
  howItWorksContent,
  aiContent,
  brand,
  faqContent,
  footerContent,
  pricingContent,
  SectionId,
  sectionHref,
  waitlistFormContent,
} from "@/lib/content";

function renderPage() {
  return render(<Home />);
}

/** Strips the leading "#" from an in-page href. */
function targetIdOf(href: string): string {
  return href.slice(1);
}

describe("Home page", () => {
  it("renders exactly one h1, holding the hero headline", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(
      `${heroContent.headline.lead} ${heroContent.headline.highlight}${heroContent.headline.trail}`,
    );
  });

  it("uses the SatuPorto brand everywhere, with no trace of the old name", () => {
    const { container } = renderPage();
    expect(container).toHaveTextContent(brand.name);
    expect(container.innerHTML).not.toMatch(/one\s?-?porto/i);
    expect(brand).toMatchObject({
      name: "SatuPorto",
      domain: "SatuPorto.biz.id",
    });
  });

  it("leaves no English UI copy behind (the site is in Indonesian)", () => {
    const { container } = renderPage();
    const attributes = Array.from(
      container.querySelectorAll("[aria-label], [placeholder], [alt], [title]"),
      (element) =>
        ["aria-label", "placeholder", "alt", "title"]
          .map((name) => element.getAttribute(name) ?? "")
          .join(" "),
    );
    const visibleAndSpoken = `${container.textContent} ${attributes.join(" ")}`;

    for (const leftover of [
      "Join Waitlist",
      "Get Early Access",
      "How it Works",
      "Features",
      "Pricing",
      "Supported assets",
      "Updated just now",
      "not financial advice",
      "Pause ticker",
      "Open menu",
      "this month",
      "All rights reserved",
      "opens in a new tab",
    ]) {
      expect(visibleAndSpoken, leftover).not.toContain(leftover);
    }
    // KBBI spelling in the copy; "import" lives only in the search keywords.
    expect(visibleAndSpoken).not.toMatch(/\bimport\b/i);
    expect(visibleAndSpoken).toMatch(/\bimpor\b/i);
    // English on purpose, approved by the client (see lib/content.ts).
    for (const approved of [
      featuresContent.assetSyncLabel,
      footerContent.credit.label,
    ]) {
      expect(visibleAndSpoken).toContain(approved);
    }
    expect(featuresContent.assetSyncLabel).toBe("Live sync");
    expect(footerContent.credit.label).toBe("Powered by Nusa Techno Jaya");
  });

  it("never skips a heading level", () => {
    renderPage();
    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(levels[0]).toBe(1);
    levels.forEach((level, index) => {
      if (index === 0) return;
      expect(
        level - levels[index - 1],
        `h${levels[index - 1]} is followed by h${level}`,
      ).toBeLessThanOrEqual(1);
    });
  });

  it("sizes the hero headline and badge to fit a 320px screen", () => {
    // Measured in the browser: at 48px "Pengeluaranmu." alone is wider than
    // a 320px screen, and the badge needs the smaller text to stay on one line.
    renderPage();
    const headline = screen.getByRole("heading", { level: 1 });
    const badge = screen.getByText(heroContent.badge.label);

    expect(headline).toHaveClass("text-4xl", "sm:text-5xl", "md:text-6xl");
    expect(badge).toHaveClass("text-xs", "sm:text-sm");
  });

  it("puts the gradient on the highlighted part of the headline only", () => {
    renderPage();
    const highlight = screen.getByText(heroContent.headline.highlight);

    expect(highlight).toHaveClass("bg-clip-text", "text-transparent");
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveClass(
      "text-transparent",
    );
  });

  it("points every in-page link at a section that exists (no dead anchors)", () => {
    const { container } = renderPage();
    const hrefs = new Set(
      Array.from(
        container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
        (anchor) => anchor.getAttribute("href") ?? "",
      ),
    );

    // Every nav link and every section id is linked from somewhere.
    expect([...hrefs].sort()).toEqual(
      Object.values(SectionId).map(sectionHref).sort(),
    );
    for (const href of hrefs) {
      expect(
        document.getElementById(targetIdOf(href))?.tagName,
        `missing <section> for ${href}`,
      ).toBe("SECTION");
    }
  });

  it("labels every section with a heading via aria-labelledby", () => {
    const { container } = renderPage();
    const sections = Array.from(container.querySelectorAll("section"));

    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      const labelId = section.getAttribute("aria-labelledby");
      expect(labelId, "section without aria-labelledby").toBeTruthy();
      const label = document.getElementById(labelId ?? "");
      expect(label?.tagName).toMatch(/^H[1-6]$/);
      expect(section).toContainElement(label);
    }
  });

  it("uses unique ids across the whole page", () => {
    const { container } = renderPage();
    const ids = Array.from(container.querySelectorAll("[id]")).map(
      (element) => element.id,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("renders the page landmarks", () => {
    renderPage();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a waitlist form in the hero and in the closing call to action", () => {
    renderPage();

    expect(
      screen.getAllByLabelText(waitlistFormContent.inputLabel),
    ).toHaveLength(2);

    const cta = document.getElementById(SectionId.Waitlist);
    expect(cta).not.toBeNull();
    expect(
      within(cta as HTMLElement).getByLabelText(waitlistFormContent.inputLabel),
    ).toBeInTheDocument();
    expect(
      within(cta as HTMLElement).getByRole("heading", {
        name: ctaContent.title,
      }),
    ).toBeInTheDocument();
  });

  it("exposes the dashboard mock as one labelled image", () => {
    renderPage();
    expect(
      screen.getByRole("img", { name: dashboardContent.accessibleLabel }),
    ).toBeInTheDocument();
  });

  it("renders the features bento with one card per feature", () => {
    renderPage();
    const features = document.getElementById(SectionId.Features);
    const scope = within(features as HTMLElement);

    expect(
      scope.getByRole("heading", { level: 2, name: featuresContent.title }),
    ).toBeInTheDocument();
    expect(scope.getAllByRole("article")).toHaveLength(
      featuresContent.features.length,
    );
    for (const feature of featuresContent.features) {
      expect(
        scope.getByRole("heading", { level: 3, name: feature.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders the how it works steps as an ordered list", () => {
    renderPage();
    const section = within(
      document.getElementById(SectionId.HowItWorks) as HTMLElement,
    );

    expect(section.getAllByRole("listitem")).toHaveLength(
      howItWorksContent.steps.length,
    );
  });

  it("renders the early access pricing card with a link to the waitlist", () => {
    renderPage();
    const section = within(
      document.getElementById(SectionId.Pricing) as HTMLElement,
    );

    expect(section.getByText(pricingContent.plan.summary)).toBeInTheDocument();
    expect(
      section.getByRole("link", { name: pricingContent.plan.ctaLabel }),
    ).toHaveAttribute("href", sectionHref(SectionId.Waitlist));
  });

  it("clips every section without making it a scroll container", () => {
    // overflow-hidden boxes can still be scrolled by focus, which used to
    // shift the hero sideways to reveal an off-screen glow.
    const { container } = renderPage();
    for (const section of container.querySelectorAll("section")) {
      expect(section).toHaveClass("overflow-clip");
      expect(section).not.toHaveClass("overflow-hidden");
    }
  });

  it("places the AI section between the features and how it works", () => {
    const { container } = renderPage();
    const order = Array.from(
      container.querySelectorAll("section[id]"),
      (s) => s.id,
    );

    expect(order.indexOf(SectionId.Ai)).toBe(
      order.indexOf(SectionId.Features) + 1,
    );
    expect(order.indexOf(SectionId.HowItWorks)).toBe(
      order.indexOf(SectionId.Ai) + 1,
    );
    expect(
      within(document.getElementById(SectionId.Ai) as HTMLElement).getByText(
        aiContent.disclaimer,
      ),
    ).toBeInTheDocument();
  });

  it("places the FAQ right before the closing call to action", () => {
    const { container } = renderPage();
    const order = Array.from(
      container.querySelectorAll("section[id]"),
      (s) => s.id,
    );

    expect(order.indexOf(SectionId.Waitlist)).toBe(
      order.indexOf(SectionId.Faq) + 1,
    );
  });

  it("embeds JSON-LD whose FAQ matches the rendered FAQ", () => {
    const { container } = renderPage();
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const raw = script?.innerHTML ?? "";
    const data = JSON.parse(raw);
    const faqPage = data["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "FAQPage",
    );
    const faq = document.getElementById(SectionId.Faq) as HTMLElement;
    const rendered = Array.from(faq.querySelectorAll("details"), (details) => ({
      question: details.querySelector("summary")?.textContent,
      answer: details.querySelector("p")?.textContent,
    }));

    expect(raw).not.toMatch(/<\/script/i);
    expect(raw).not.toMatch(/aggregateRating/);
    expect(rendered).toEqual(faqContent.items);
    expect(
      faqPage.mainEntity.map(
        (entity: { name: string; acceptedAnswer: { text: string } }) => ({
          question: entity.name,
          answer: entity.acceptedAnswer.text,
        }),
      ),
    ).toEqual(rendered);
  });

  it("labels the primary navigation", () => {
    renderPage();
    expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
    for (const nav of screen.getAllByRole("navigation")) {
      expect(nav).toHaveAccessibleName();
    }
  });

  it("credits Nusa Techno Jaya in the footer", () => {
    renderPage();
    const credit = within(screen.getByRole("contentinfo")).getByRole("link", {
      name: new RegExp(footerContent.credit.label),
    });

    expect(credit).toHaveAttribute("href", footerContent.credit.href);
  });

  it("hides decorative glows from assistive technology", () => {
    const { container } = renderPage();
    const glows = container.querySelectorAll(
      ".bg-glow-emerald, .bg-glow-indigo",
    );

    expect(glows.length).toBeGreaterThan(0);
    for (const glow of glows) {
      expect(glow.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });
});

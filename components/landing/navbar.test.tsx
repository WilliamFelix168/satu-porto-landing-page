import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Navbar } from "@/components/landing/navbar";
import { navbarContent, navLinks, SectionId, sectionHref } from "@/lib/content";
import { captureAnimationFrames } from "@/test/animation-frames";

function getMenuToggle() {
  return screen.getByRole("button", {
    name: new RegExp(
      `${navbarContent.openMenuLabel}|${navbarContent.closeMenuLabel}`,
    ),
  });
}

function getMobileMenu() {
  const menuId = getMenuToggle().getAttribute("aria-controls") ?? "";
  const menu = document.getElementById(menuId);
  if (!menu) throw new Error(`No element with id "${menuId}"`);
  return menu;
}

describe("Navbar", () => {
  it("renders inside a labelled navigation landmark", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("navigation", { name: navbarContent.primaryNavLabel }),
    ).toBeInTheDocument();
  });

  it("links the logo back to the top of the page", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: navbarContent.homeLabel }),
    ).toHaveAttribute("href", sectionHref(SectionId.Top));
  });

  it.each(navLinks.map((link) => [link.label, link.href]))(
    "links %s to %s",
    (label, href) => {
      render(<Navbar />);
      // Only the desktop copy is exposed while the mobile menu is closed.
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    },
  );

  it("renders each section link exactly once while the mobile menu is closed", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", {
      name: navbarContent.primaryNavLabel,
    });
    const sectionLinks = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href) => navLinks.some((navLink) => navLink.href === href));

    expect(sectionLinks).toEqual(navLinks.map((link) => link.href));
  });

  it("points Join Waitlist at the waitlist section", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: navbarContent.joinWaitlistLabel }),
    ).toHaveAttribute("href", sectionHref(SectionId.Waitlist));
  });

  describe("mobile menu", () => {
    it("starts closed, with the toggle wired to the menu", () => {
      render(<Navbar />);
      const toggle = getMenuToggle();

      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveAccessibleName(navbarContent.openMenuLabel);
      expect(getMobileMenu()).not.toBeVisible();
    });

    it("opens and closes from the toggle, updating aria-expanded", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.click(getMenuToggle());
      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "true");
      expect(getMenuToggle()).toHaveAccessibleName(
        navbarContent.closeMenuLabel,
      );
      expect(getMobileMenu()).toBeVisible();

      await user.click(getMenuToggle());
      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "false");
      expect(getMobileMenu()).not.toBeVisible();
    });

    it("lists every nav link and the waitlist button when open", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.click(getMenuToggle());
      const menu = within(getMobileMenu());

      for (const link of navLinks) {
        expect(menu.getByRole("link", { name: link.label })).toHaveAttribute(
          "href",
          link.href,
        );
      }
      expect(
        menu.getByRole("link", { name: navbarContent.joinWaitlistLabel }),
      ).toHaveAttribute("href", sectionHref(SectionId.Waitlist));
    });

    it("closes when a link is chosen", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.click(getMenuToggle());
      await user.click(
        within(getMobileMenu()).getByRole("link", { name: navLinks[0].label }),
      );

      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes when Join Waitlist is chosen", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.click(getMenuToggle());
      await user.click(
        within(getMobileMenu()).getByRole("link", {
          name: navbarContent.joinWaitlistLabel,
        }),
      );

      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape and returns focus to the toggle", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.click(getMenuToggle());
      await user.tab();
      expect(getMenuToggle()).not.toHaveFocus();

      await user.keyboard("{Escape}");

      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "false");
      expect(getMenuToggle()).toHaveFocus();
    });

    it("ignores Escape while closed", async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.keyboard("{Escape}");

      expect(getMenuToggle()).toHaveAttribute("aria-expanded", "false");
      expect(getMenuToggle()).not.toHaveFocus();
    });
  });

  describe("Join Waitlist", () => {
    it("moves focus into the waitlist email input after the anchor jump", async () => {
      const user = userEvent.setup();
      const frames = captureAnimationFrames();
      render(
        <>
          <Navbar />
          <section id={SectionId.Waitlist}>
            <input aria-label="Waitlist email" />
          </section>
        </>,
      );

      await user.click(
        screen.getByRole("link", { name: navbarContent.joinWaitlistLabel }),
      );

      expect(screen.getByLabelText("Waitlist email")).not.toHaveFocus();
      frames.flush();
      expect(screen.getByLabelText("Waitlist email")).toHaveFocus();
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AssetMarquee } from "@/components/landing/asset-marquee";
import { HeadingId, marqueeContent } from "@/lib/content";

describe("AssetMarquee", () => {
  it("is a section labelled by its heading", () => {
    render(<AssetMarquee />);
    const heading = screen.getByRole("heading", { name: marqueeContent.label });

    expect(heading).toHaveAttribute("id", HeadingId.Marquee);
    expect(
      screen.getByRole("region", { name: marqueeContent.label }),
    ).toBeInTheDocument();
  });

  it("exposes each asset to assistive technology exactly once", () => {
    render(<AssetMarquee />);

    for (const asset of [...marqueeContent.assets, marqueeContent.more]) {
      expect(screen.getAllByText(asset)).toHaveLength(2);
      expect(
        screen
          .getAllByText(asset)
          .filter((node) => node.closest('[aria-hidden="true"]') === null),
      ).toHaveLength(1);
    }
  });

  it("renders two identical tracks so the loop is seamless", () => {
    const { container } = render(<AssetMarquee />);
    const tracks = container.querySelectorAll("ul");

    expect(tracks).toHaveLength(2);
    expect(tracks[0].textContent).toBe(tracks[1].textContent);
    expect(tracks[0]).not.toHaveAttribute("aria-hidden");
    expect(tracks[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("lists the brief's assets by ticker, including the 10,000+ more line", () => {
    render(<AssetMarquee />);
    const list = screen.getByRole("list");

    for (const ticker of ["BTC", "ETH", "AAPL", "TSLA", "GOTO"]) {
      expect(list).toHaveTextContent(ticker);
    }
    expect(list).toHaveTextContent(marqueeContent.more);
  });

  it("shows tickers only, never full asset names", () => {
    render(<AssetMarquee />);
    const list = screen.getByRole("list");

    for (const name of ["Bitcoin", "Ethereum", "Apple", "Tesla", "Telkom"]) {
      expect(list).not.toHaveTextContent(name);
    }
  });

  it("only animates when motion is allowed", () => {
    const { container } = render(<AssetMarquee />);
    expect(container.querySelector("ul")).toHaveClass(
      "motion-safe:animate-marquee",
    );
  });

  /** The element that clips the tracks and carries the pause state. */
  function getTickerViewport(container: HTMLElement) {
    const viewport = container.querySelector("ul")?.parentElement;
    if (!viewport) throw new Error("No ticker viewport");
    return viewport;
  }

  it("scopes the pause to the track viewport, never to the toggle", () => {
    const { container } = render(<AssetMarquee />);
    const viewport = getTickerViewport(container);
    const toggle = screen.getByRole("button", {
      name: marqueeContent.pauseLabel,
    });

    expect(viewport).toHaveClass("group/ticker");
    expect(viewport).toHaveAttribute("data-paused", "false");
    // Hovering or focusing the toggle must not count as hovering the ticker.
    expect(viewport).not.toContainElement(toggle);
    expect(toggle.closest(".group")).toBeNull();
  });

  it("pauses the tracks on hover and when toggled off, via the ticker group only", () => {
    const { container } = render(<AssetMarquee />);
    for (const track of container.querySelectorAll("ul")) {
      expect(track).toHaveClass(
        "group-hover/ticker:[animation-play-state:paused]",
        "group-data-[paused=true]/ticker:[animation-play-state:paused]",
      );
      // No unscoped or focus-based pause that the toggle could trigger.
      expect(track.className).not.toMatch(/group-focus-within/);
      expect(track.className).not.toMatch(/(^|\s)group-hover:/);
      expect(track.className).not.toMatch(/(^|\s)group-data-\[paused=true\]:/);
    }
  });

  it("has a pause/play toggle that stops and restarts the ticker (WCAG 2.2.2)", async () => {
    const user = userEvent.setup();
    const { container } = render(<AssetMarquee />);
    const viewport = getTickerViewport(container);

    await user.click(
      screen.getByRole("button", { name: marqueeContent.pauseLabel }),
    );
    expect(viewport).toHaveAttribute("data-paused", "true");

    // Resuming with the keyboard, while the toggle keeps focus.
    await user.keyboard(" ");
    expect(viewport).toHaveAttribute("data-paused", "false");
    expect(
      screen.getByRole("button", { name: marqueeContent.pauseLabel }),
    ).toHaveFocus();
  });

  it("hides the toggle when reduced motion already stops the ticker", () => {
    render(<AssetMarquee />);
    expect(
      screen.getByRole("button", { name: marqueeContent.pauseLabel }),
    ).toHaveClass("motion-reduce:hidden");
  });

  it("clips the ticker so it can never cause horizontal scroll", () => {
    const { container } = render(<AssetMarquee />);

    expect(container.querySelector("section")).toHaveClass("overflow-clip");
    expect(container.querySelector("ul")?.parentElement).toHaveClass(
      "overflow-clip",
    );
  });
});

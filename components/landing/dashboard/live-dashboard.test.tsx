import { render } from "@testing-library/react";
import { useInView } from "motion/react";
import { describe, expect, it, vi } from "vitest";

import { LiveDashboard } from "@/components/landing/dashboard/live-dashboard";
import { getDashboardDisplay } from "@/lib/dashboard-display";
import {
  DASHBOARD_INTRO_WINDOW_MS,
  TICK_INTERVAL_MS,
} from "@/lib/dashboard-motion";
import { INTRO_DURATION_MS } from "@/lib/use-live-dashboard";
import {
  advanceTimers as advance,
  countHidden,
  plain,
} from "@/test/animated-visual-suite";
import { stubMatchMedia } from "@/test/media-query";

const display = getDashboardDisplay();
const finalNetWorth = display.frames[0].netWorth;

/** The intro starts on the next task, then runs for its full duration. */
async function playIntro() {
  await advance(0);
  await advance(INTRO_DURATION_MS);
}

/** In view, motion allowed, page hydrated `nowMs` after navigation. */
function renderPlaying(nowMs = 0) {
  vi.useFakeTimers();
  stubMatchMedia(false);
  vi.spyOn(performance, "now").mockReturnValue(nowMs);
  vi.mocked(useInView).mockReturnValue(true);
  return render(<LiveDashboard display={display} />);
}

describe("LiveDashboard", () => {
  it("renders the static, final values on the server and out of view", () => {
    const { container } = render(<LiveDashboard display={display} />);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);
    expect(container.querySelector("[data-tick-flash]")).toBeNull();
  });

  it("renders the final state under reduced motion, with no timers", () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<LiveDashboard display={display} />);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("counts the net worth up from near its value to the exact final value", async () => {
    const { container } = renderPlaying();

    expect(container).toHaveTextContent(plain(display.countUp[0]));
    expect(countHidden(container)).toBeGreaterThan(0);

    await playIntro();

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);
  });

  it("then ticks through the price frames and loops back to the start", async () => {
    const { container } = renderPlaying();
    await playIntro();

    for (let index = 1; index < display.frames.length; index += 1) {
      await advance(TICK_INTERVAL_MS);
      expect(container).toHaveTextContent(
        plain(display.frames[index].netWorth),
      );
      expect(container.querySelector("[data-tick-flash]")).not.toBeNull();
    }

    // The last tick returns to the start, and flashes like the others.
    await advance(TICK_INTERVAL_MS);
    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(container.querySelector("[data-tick-flash]")).not.toBeNull();
  });

  it("skips the intro when the page hydrated late, and just ticks", async () => {
    const { container } = renderPlaying(DASHBOARD_INTRO_WINDOW_MS);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);

    await advance(TICK_INTERVAL_MS);
    expect(container).toHaveTextContent(plain(display.frames[1].netWorth));
  });

  it("stops ticking and shows the static values when it leaves view", async () => {
    const { container, rerender } = renderPlaying();
    await playIntro();
    await advance(TICK_INTERVAL_MS);
    expect(container).toHaveTextContent(plain(display.frames[1].netWorth));

    vi.mocked(useInView).mockReturnValue(false);
    rerender(<LiveDashboard display={display} />);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not replay the intro when it comes back into view", async () => {
    const { container, rerender } = renderPlaying();
    await playIntro();
    vi.mocked(useInView).mockReturnValue(false);
    rerender(<LiveDashboard display={display} />);
    vi.mocked(useInView).mockReturnValue(true);
    rerender(<LiveDashboard display={display} />);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);
  });

  it("treats an interrupted intro as played (once per page load)", async () => {
    const { container, rerender } = renderPlaying();
    await advance(0);
    await advance(INTRO_DURATION_MS / 2);
    expect(container).not.toHaveTextContent(plain(finalNetWorth));

    vi.mocked(useInView).mockReturnValue(false);
    rerender(<LiveDashboard display={display} />);
    await advance(0);
    vi.mocked(useInView).mockReturnValue(true);
    rerender(<LiveDashboard display={display} />);

    expect(container).toHaveTextContent(plain(finalNetWorth));
    expect(countHidden(container)).toBe(0);
  });

  it("never shows less than the count-up's starting value", () => {
    const { container } = renderPlaying();
    expect(container).toHaveTextContent(plain(display.countUp[0]));
    expect(container).not.toHaveTextContent(/Rp\s0\b/);
  });

  it("leaves no timers behind when it unmounts", async () => {
    const { unmount } = renderPlaying();
    await playIntro();
    await advance(TICK_INTERVAL_MS);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("contains nothing focusable", () => {
    const { container } = render(<LiveDashboard display={display} />);
    expect(container.querySelector("a, button, input, [tabindex]")).toBeNull();
  });
});

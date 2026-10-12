import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WaitlistLink } from "@/components/landing/waitlist-link";
import { SectionId, sectionHref } from "@/lib/content";
import { captureAnimationFrames } from "@/test/animation-frames";

function renderWithWaitlist(onNavigate = vi.fn()) {
  render(
    <>
      <WaitlistLink onNavigate={onNavigate}>Join</WaitlistLink>
      <section id={SectionId.Waitlist}>
        <input aria-label="Email" />
      </section>
    </>,
  );
  return { onNavigate, link: screen.getByRole("link", { name: "Join" }) };
}

describe("WaitlistLink", () => {
  it("links to the waitlist section", () => {
    render(<WaitlistLink>Join</WaitlistLink>);
    expect(screen.getByRole("link", { name: "Join" })).toHaveAttribute(
      "href",
      sectionHref(SectionId.Waitlist),
    );
  });

  it("runs onNavigate, then focuses the input only after the anchor jump", async () => {
    const user = userEvent.setup();
    const frames = captureAnimationFrames();
    const { onNavigate, link } = renderWithWaitlist();

    await user.click(link);

    expect(onNavigate).toHaveBeenCalledTimes(1);
    // Focusing synchronously would be undone by the fragment navigation.
    expect(screen.getByLabelText("Email")).not.toHaveFocus();

    frames.flush();

    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it.each([
    ["Ctrl", { ctrlKey: true }],
    ["Cmd", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["Alt", { altKey: true }],
    ["middle-button", { button: 1 }],
  ])("leaves focus alone on a %s click (opens elsewhere)", (_label, init) => {
    const frames = captureAnimationFrames();
    const { onNavigate, link } = renderWithWaitlist();

    fireEvent.click(link, init);
    frames.flush();

    expect(onNavigate).not.toHaveBeenCalled();
    expect(frames.requested).toBe(0);
    expect(screen.getByLabelText("Email")).not.toHaveFocus();
  });
});

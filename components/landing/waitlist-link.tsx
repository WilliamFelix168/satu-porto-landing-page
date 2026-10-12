"use client";

import type { MouseEvent, ReactNode } from "react";

import { SectionId, sectionHref } from "@/lib/content";

/**
 * Moves keyboard focus to the waitlist email input once the browser has
 * handled the anchor jump (fragment navigation resets focus, so focusing
 * synchronously in the click handler would be undone). `preventScroll` keeps
 * it from cutting the browser's own smooth scroll short.
 */
export function focusWaitlistInput() {
  requestAnimationFrame(() => {
    document
      .getElementById(SectionId.Waitlist)
      ?.querySelector<HTMLInputElement>("input")
      ?.focus({ preventScroll: true });
  });
}

/** `MouseEvent.button` value of the primary (usually left) button. */
const PRIMARY_MOUSE_BUTTON = 0;

/**
 * True for clicks that open the link elsewhere (new tab or window, download),
 * where the page itself does not jump and focus should stay put.
 */
function opensElsewhere(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button !== PRIMARY_MOUSE_BUTTON ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

interface WaitlistLinkProps {
  children: ReactNode;
  className?: string;
  /** Runs before focus moves, e.g. to close a menu. */
  onNavigate?: () => void;
}

/** Jumps to the bottom waitlist form and puts the cursor in its input. */
export function WaitlistLink({
  children,
  className,
  onNavigate,
}: WaitlistLinkProps) {
  return (
    <a
      href={sectionHref(SectionId.Waitlist)}
      className={className}
      onClick={(event) => {
        if (opensElsewhere(event)) return;
        onNavigate?.();
        focusWaitlistInput();
      }}
    >
      {children}
    </a>
  );
}

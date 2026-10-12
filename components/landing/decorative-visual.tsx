import type { ReactNode } from "react";

/**
 * Wrapper for mock UI inside a card. Hidden from assistive technology: the
 * card's own heading and description carry the meaning.
 */
export function DecorativeVisual({ children }: { children: ReactNode }) {
  return <div aria-hidden="true">{children}</div>;
}

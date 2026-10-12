import type { ReactNode } from "react";

import type { SectionId } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Shared max width and side gutters for every full-width band of the page. */
export const pageContainerClassName = "mx-auto w-full max-w-6xl px-4 sm:px-6";

interface LandingSectionProps {
  /** Anchor target. Omit for sections nothing links to. */
  id?: SectionId;
  /** Id of the heading that names this section. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /** Classes for the inner, width-constrained container. */
  containerClassName?: string;
}

/**
 * Page section with the shared vertical rhythm, gutters, max width,
 * sticky-nav scroll offset and clipping for decorative glows. Padding can be
 * overridden through `className`.
 *
 * `overflow-clip` rather than `overflow-hidden`: a hidden-overflow box is
 * still a scroll container, so focusing the form could shift the whole
 * section sideways to reveal an off-screen glow.
 */
export function LandingSection({
  id,
  labelledBy,
  children,
  className,
  containerClassName,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate scroll-mt-navbar overflow-clip py-20 sm:py-28",
        className,
      )}
    >
      <div className={cn(pageContainerClassName, containerClassName)}>
        {children}
      </div>
    </section>
  );
}

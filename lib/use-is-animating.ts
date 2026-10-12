import { useInView } from "motion/react";
import type { RefObject } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * True while a decorative animation may run: the element is in view and the
 * visitor has not asked for reduced motion. Always false on the server.
 */
export function useIsAnimating(
  ref: RefObject<Element | null>,
  inViewAmount: number,
): boolean {
  const isInView = useInView(ref, { amount: inViewAmount });
  const prefersReducedMotion = usePrefersReducedMotion();
  return isInView && !prefersReducedMotion;
}

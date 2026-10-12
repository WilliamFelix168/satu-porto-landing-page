"use client";

import { motion, MotionConfig } from "motion/react";
import { useRef, type ReactNode } from "react";

import {
  fadeInUp,
  FLOAT_IN_VIEW_AMOUNT,
  floatKeyframes,
  floatRest,
  floatTransition,
  popIn,
  REVEAL_ATTRIBUTE,
  revealInViewProps,
  revealStagger,
} from "@/lib/motion";
import { useIsAnimating } from "@/lib/use-is-animating";

/** Spread onto every element that starts hidden for a reveal. */
const revealMarker = { [REVEAL_ATTRIBUTE]: "" };

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Applies the visitor's reduced-motion preference to every `motion`
 * animation on the page: transforms (the float, the reveal slide) are
 * skipped and only opacity fades remain. Using the config instead of
 * per-component `useReducedMotion` swaps keeps server and client markup
 * identical, so there is no hydration mismatch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Below-the-fold container: animates its `StaggerItem` children in once the
 * group scrolls into view.
 */
export function RevealStagger({ children, className }: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      variants={revealStagger}
      {...revealInViewProps}
      {...revealMarker}
    >
      {children}
    </motion.div>
  );
}

/** A child of `RevealStagger`. */
export function StaggerItem({ children, className }: MotionWrapperProps) {
  return (
    <motion.div className={className} variants={fadeInUp} {...revealMarker}>
      {children}
    </motion.div>
  );
}

/** A child of `RevealStagger` that pops in (scales up) instead of sliding. */
export function StaggerPop({ children, className }: MotionWrapperProps) {
  return (
    <motion.span className={className} variants={popIn} {...revealMarker}>
      {children}
    </motion.span>
  );
}

/** A standalone block that fades in up once it scrolls into view. */
export function Reveal({ children, className }: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      {...revealInViewProps}
      {...revealMarker}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slowly bobs its content up and down while it is on screen. Holds still
 * (at rest) off screen and under reduced motion.
 */
export function Float({ children, className }: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isAnimating = useIsAnimating(ref, FLOAT_IN_VIEW_AMOUNT);
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={isAnimating ? floatKeyframes : floatRest}
      transition={isAnimating ? floatTransition : undefined}
    >
      {children}
    </motion.div>
  );
}

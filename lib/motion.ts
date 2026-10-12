import type { CSSProperties } from "react";
import type { Transition, Variants } from "motion/react";

import { SHOWCASE_SPRING } from "@/lib/ai-showcase-motion";

/** Vertical offset entrance animations start from. */
export const FADE_IN_UP_OFFSET_PX = 20;
/** Duration of a single entrance animation. */
export const FADE_IN_DURATION_S = 0.6;
/** Delay between staggered hero children. */
export const HERO_STAGGER_S = 0.12;
/** Pause before the first hero child animates. */
export const HERO_DELAY_CHILDREN_S = 0.1;
/** Delay between staggered children revealed on scroll. */
export const REVEAL_STAGGER_S = 0.08;
/** Shrinks the viewport so reveals start once content is properly in view. */
export const REVEAL_VIEWPORT_MARGIN = "0px 0px -80px 0px";
/** How far the dashboard preview drifts up from its resting position. */
export const FLOAT_AMPLITUDE_PX = 12;
/** One full up-and-down float cycle. */
export const FLOAT_DURATION_S = 6;
/** Soft ease-out curve shared by every entrance animation. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export enum MotionState {
  Hidden = "hidden",
  Visible = "visible",
}

/* -------------------------------------------------------------------------- */
/* Below the fold: `motion` reveals on scroll                                 */
/* -------------------------------------------------------------------------- */

/**
 * The brief's entrance, `{ opacity: 0, y: 20 }` to `{ opacity: 1, y: 0 }`.
 * Under `MotionConfig reducedMotion="user"` motion drops the `y` part and
 * keeps only the fade.
 */
export const fadeInUp: Variants = {
  [MotionState.Hidden]: { opacity: 0, y: FADE_IN_UP_OFFSET_PX },
  [MotionState.Visible]: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_IN_DURATION_S, ease: EASE_OUT_EXPO },
  },
};

/** Small marks (check badges) popping in, on the same spring as the mocks. */
export const popIn: Variants = {
  [MotionState.Hidden]: { scale: 0 },
  [MotionState.Visible]: { scale: 1, transition: SHOWCASE_SPRING },
};

export const revealStagger: Variants = {
  [MotionState.Hidden]: {},
  [MotionState.Visible]: {
    transition: { staggerChildren: REVEAL_STAGGER_S },
  },
};

/**
 * Marks elements that start hidden for a scroll reveal, so the no-JavaScript
 * override in the root layout can show them.
 */
export const REVEAL_ATTRIBUTE = "data-reveal";

/**
 * Without JavaScript the reveals never run, so their server-rendered
 * `opacity: 0` would hide the content for good. Injected in a `<noscript>`.
 */
export const NO_SCRIPT_REVEAL_CSS = `[${REVEAL_ATTRIBUTE}]{opacity:1!important;transform:none!important}`;

/** Shared props that play a reveal once, when the element scrolls into view. */
export const revealInViewProps = {
  initial: MotionState.Hidden,
  whileInView: MotionState.Visible,
  viewport: { once: true, margin: REVEAL_VIEWPORT_MARGIN },
} as const;

/* -------------------------------------------------------------------------- */
/* Floating dashboard                                                         */
/* -------------------------------------------------------------------------- */

/** Keyframes for the floating dashboard: rest, drift up, rest. */
export const floatKeyframes = { y: [0, -FLOAT_AMPLITUDE_PX, 0] };
/** Where the dashboard settles while the float is paused. */
export const floatRest = { y: 0 };
/** Share of the dashboard that must be on screen for it to float. */
export const FLOAT_IN_VIEW_AMOUNT = 0.1;

export const floatTransition: Transition = {
  duration: FLOAT_DURATION_S,
  ease: "easeInOut",
  repeat: Infinity,
};

/* -------------------------------------------------------------------------- */
/* Above the fold: CSS entrance                                               */
/* -------------------------------------------------------------------------- */

/**
 * The hero uses the CSS "hero-rise" keyframe (see globals.css) rather than
 * `motion`, so it plays on first paint without waiting for hydration and
 * the content is never server-rendered invisible. It only slides, it never
 * fades from zero. These custom properties feed the keyframe the same timing
 * constants the scroll reveals use.
 */
/** Inline style that also carries CSS custom properties. */
export type CustomPropertyStyle = CSSProperties & Record<`--${string}`, string>;

export function heroEntranceStyle(index: number): CustomPropertyStyle {
  const delay = HERO_DELAY_CHILDREN_S + index * HERO_STAGGER_S;
  return {
    "--entrance-offset": `${FADE_IN_UP_OFFSET_PX}px`,
    "--entrance-duration": `${FADE_IN_DURATION_S}s`,
    "--entrance-delay": `${delay}s`,
    "--entrance-ease": `cubic-bezier(${EASE_OUT_EXPO.join(", ")})`,
  };
}

import { describe, expect, it } from "vitest";

import {
  EASE_OUT_EXPO,
  FADE_IN_DURATION_S,
  FADE_IN_UP_OFFSET_PX,
  fadeInUp,
  FLOAT_AMPLITUDE_PX,
  floatKeyframes,
  floatTransition,
  HERO_DELAY_CHILDREN_S,
  HERO_STAGGER_S,
  heroEntranceStyle,
  MotionState,
  REVEAL_STAGGER_S,
  REVEAL_VIEWPORT_MARGIN,
  revealInViewProps,
  revealStagger,
} from "@/lib/motion";

describe("fadeInUp", () => {
  it("starts transparent and offset, ends opaque and in place", () => {
    expect(fadeInUp[MotionState.Hidden]).toEqual({
      opacity: 0,
      y: FADE_IN_UP_OFFSET_PX,
    });
    expect(fadeInUp[MotionState.Visible]).toMatchObject({
      opacity: 1,
      y: 0,
      transition: { duration: FADE_IN_DURATION_S, ease: EASE_OUT_EXPO },
    });
  });
});

describe("revealStagger", () => {
  it("staggers revealed children", () => {
    expect(revealStagger[MotionState.Visible]).toEqual({
      transition: { staggerChildren: REVEAL_STAGGER_S },
    });
  });
});

describe("revealInViewProps", () => {
  it("plays once, from hidden to visible, with the shared viewport margin", () => {
    expect(revealInViewProps).toEqual({
      initial: MotionState.Hidden,
      whileInView: MotionState.Visible,
      viewport: { once: true, margin: REVEAL_VIEWPORT_MARGIN },
    });
  });
});

describe("float", () => {
  it("drifts up by the amplitude and back to rest, forever", () => {
    expect(floatKeyframes.y).toEqual([0, -FLOAT_AMPLITUDE_PX, 0]);
    expect(floatTransition.repeat).toBe(Infinity);
  });
});

describe("heroEntranceStyle", () => {
  it("feeds the CSS keyframe the shared timing constants", () => {
    expect(heroEntranceStyle(0)).toEqual({
      "--entrance-offset": `${FADE_IN_UP_OFFSET_PX}px`,
      "--entrance-duration": `${FADE_IN_DURATION_S}s`,
      "--entrance-delay": `${HERO_DELAY_CHILDREN_S}s`,
      "--entrance-ease": `cubic-bezier(${EASE_OUT_EXPO.join(", ")})`,
    });
  });

  it("delays each later step by one stagger interval", () => {
    const step = 3;
    const delay = (heroEntranceStyle(step) as Record<string, string>)[
      "--entrance-delay"
    ];
    expect(Number.parseFloat(delay)).toBeCloseTo(
      HERO_DELAY_CHILDREN_S + step * HERO_STAGGER_S,
    );
  });

  it("never sets opacity, so the hero is never rendered invisible", () => {
    expect(heroEntranceStyle(0)).not.toHaveProperty("opacity");
  });
});

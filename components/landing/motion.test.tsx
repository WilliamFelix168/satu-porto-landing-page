import { render, screen } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import { describe, expect, it, vi } from "vitest";

import { HeroEntrance } from "@/components/landing/hero-entrance";
import {
  Float,
  MotionProvider,
  Reveal,
  RevealStagger,
  StaggerItem,
} from "@/components/landing/motion";
import { FADE_IN_UP_OFFSET_PX, REVEAL_ATTRIBUTE } from "@/lib/motion";

describe("MotionProvider", () => {
  it("applies the visitor's reduced-motion preference to every animation", () => {
    render(
      <MotionProvider>
        <p>content</p>
      </MotionProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(vi.mocked(MotionConfig)).toHaveBeenCalledWith(
      expect.objectContaining({ reducedMotion: "user" }),
      undefined,
    );
  });
});

describe("motion wrappers", () => {
  it.each([
    ["Reveal", Reveal],
    ["RevealStagger", RevealStagger],
    ["StaggerItem", StaggerItem],
    ["Float", Float],
  ])("%s renders its children with the given class", (_name, Wrapper) => {
    render(<Wrapper className="custom">child</Wrapper>);
    expect(screen.getByText("child")).toHaveClass("custom");
  });
});

describe("reveal markers", () => {
  it.each([
    ["Reveal", Reveal],
    ["RevealStagger", RevealStagger],
    ["StaggerItem", StaggerItem],
  ])("%s marks itself for the no-JavaScript override", (_name, Wrapper) => {
    render(<Wrapper>child</Wrapper>);
    expect(screen.getByText("child")).toHaveAttribute(REVEAL_ATTRIBUTE, "");
  });

  it("does not mark the always-visible float", () => {
    render(<Float>child</Float>);
    expect(screen.getByText("child")).not.toHaveAttribute(REVEAL_ATTRIBUTE);
  });
});

describe("HeroEntrance", () => {
  it("animates with CSS, only when motion is allowed", () => {
    render(<HeroEntrance index={0}>hero</HeroEntrance>);
    expect(screen.getByText("hero")).toHaveClass(
      "motion-safe:animate-hero-rise",
    );
  });

  it("is never server-rendered invisible", () => {
    render(<HeroEntrance index={2}>hero</HeroEntrance>);
    const element = screen.getByText("hero");

    expect(element.style.opacity).toBe("");
    expect(element.style.getPropertyValue("--entrance-offset")).toBe(
      `${FADE_IN_UP_OFFSET_PX}px`,
    );
  });
});

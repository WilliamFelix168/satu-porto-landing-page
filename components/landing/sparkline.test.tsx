import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  blendSeries,
  drawClip,
  Sparkline,
  tipPosition,
  toSparklinePoints,
  valueAtProgress,
} from "@/components/landing/sparkline";

const VALUES = [22, 30, 26, 38, 34, 47, 100];
const NEXT_VALUES = [30, 26, 38, 34, 47, 100, 92];

function getLine(container: HTMLElement) {
  const strokes = Array.from(container.querySelectorAll("path")).filter(
    (path) => path.getAttribute("fill") === "none",
  );
  expect(strokes).toHaveLength(1);
  return strokes[0];
}

describe("Sparkline", () => {
  it("draws the line as one continuous path through every point", () => {
    const { container } = render(<Sparkline values={VALUES} />);
    const d = getLine(container).getAttribute("d") ?? "";

    expect(d.match(/M/g)).toHaveLength(1);
    expect(d.match(/L/g)).toHaveLength(VALUES.length - 1);
    for (const point of toSparklinePoints(VALUES)) {
      expect(d).toContain(point);
    }
  });

  it("never dash-animates a non-scaling stroke (that breaks the line into segments)", () => {
    const { container } = render(<Sparkline values={VALUES} isDrawn={false} />);
    const line = getLine(container);

    expect(line).toHaveAttribute("vector-effect", "non-scaling-stroke");
    expect(line).not.toHaveAttribute("pathLength");
    expect(line).not.toHaveAttribute("stroke-dasharray");
    expect(line).not.toHaveAttribute("stroke-dashoffset");
  });

  it("keeps the same SVG and path elements across draw states and new series", () => {
    const { container, rerender } = render(
      <Sparkline values={VALUES} isDrawn={false} />,
    );
    const svg = container.querySelector("svg");
    const line = getLine(container);

    rerender(<Sparkline values={VALUES} isDrawn />);
    rerender(<Sparkline values={NEXT_VALUES} isDrawn />);
    rerender(<Sparkline values={NEXT_VALUES} isDrawn={false} />);

    expect(container.querySelector("svg")).toBe(svg);
    expect(getLine(container)).toBe(line);
  });

  it("closes the area fill along the bottom edge", () => {
    const { container } = render(<Sparkline values={VALUES} />);
    const area = Array.from(container.querySelectorAll("path")).find(
      (path) => path.getAttribute("fill") !== "none",
    );
    expect(area?.getAttribute("d")).toMatch(/Z$/);
  });

  it("puts the tip dot outside the clipped plot, so it is never cut off", () => {
    const { container } = render(<Sparkline values={VALUES} />);
    const tip = container.querySelector("[data-sparkline-tip]");
    const clipped = container.querySelector("svg")?.parentElement;

    expect(tip).not.toBeNull();
    expect(clipped).not.toContainElement(tip as HTMLElement);
  });

  it("gives each instance its own gradient id", () => {
    const { container } = render(
      <>
        <Sparkline values={VALUES} />
        <Sparkline values={VALUES} />
      </>,
    );
    const ids = Array.from(
      container.querySelectorAll("linearGradient"),
      (gradient) => gradient.id,
    );
    expect(new Set(ids).size).toBe(2);
  });
});

describe("drawClip", () => {
  it("produces the same shape of clip at every progress, so it never snaps", () => {
    const shape = (clip: string) => clip.replace(/-?\d+(\.\d+)?/g, "#");
    const steps = [0, 0.25, 0.5, 0.75, 1];
    const shapes = new Set(steps.map((step) => shape(drawClip(step))));
    expect(shapes.size).toBe(1);
  });

  it("hides everything at 0 and shows everything (with bleed) at 1", () => {
    expect(drawClip(0)).toMatch(/calc\(100% \+ 4px\)/);
    expect(drawClip(1)).toMatch(/calc\(0% \+ -4px\)/);
  });

  it("reveals monotonically as progress grows", () => {
    const rightPercent = (clip: string) =>
      Number(clip.match(/calc\(([\d.]+)%/)?.[1]);
    let previous = Number.POSITIVE_INFINITY;
    for (let step = 0; step <= 10; step += 1) {
      const current = rightPercent(drawClip(step / 10));
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }
  });
});

describe("series helpers", () => {
  it("blends two series point by point", () => {
    expect(blendSeries([0, 10], [10, 20], 0.5)).toEqual([5, 15]);
  });

  it("finds the value under the tip by interpolating between points", () => {
    expect(valueAtProgress([0, 10, 20], 0)).toBe(0);
    expect(valueAtProgress([0, 10, 20], 0.25)).toBe(5);
    expect(valueAtProgress([0, 10, 20], 1)).toBe(20);
  });
});

describe("tipPosition", () => {
  /** The polyline's y (percent from the top) at x percent, from its points. */
  function lineYAt(values: readonly number[], xPercent: number): number {
    const segment = 100 / (values.length - 1);
    const index = Math.min(Math.floor(xPercent / segment), values.length - 2);
    const t = (xPercent - index * segment) / segment;
    const value = values[index] + (values[index + 1] - values[index]) * t;
    return 100 - value;
  }

  it("is the first point at progress 0 and exactly the last point at 1", () => {
    expect(tipPosition(VALUES, 0)).toEqual({
      xPercent: 0,
      yPercent: 100 - VALUES[0],
    });
    expect(tipPosition(VALUES, 1)).toEqual({
      xPercent: 100,
      yPercent: 100 - (VALUES.at(-1) ?? 0),
    });
  });

  it("stays on the polyline at every progress in between", () => {
    for (let step = 0; step <= 100; step += 1) {
      const { xPercent, yPercent } = tipPosition(VALUES, step / 100);
      expect(yPercent).toBeCloseTo(lineYAt(VALUES, xPercent), 6);
    }
  });

  it("follows a morphing series (blended values) the same way", () => {
    const blended = blendSeries(VALUES, NEXT_VALUES, 0.4);
    const { yPercent } = tipPosition(blended, 1);
    expect(yPercent).toBeCloseTo(100 - (blended.at(-1) ?? 0), 6);
  });
});

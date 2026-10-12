import { describe, expect, it } from "vitest";

import { dashboardContent } from "@/lib/content";
import {
  buildCountUp,
  COUNT_UP_ROUND_IDR,
  NET_WORTH_COUNT_UP_START_RATIO,
  netWorthCountUpStart,
} from "@/lib/count-up";
import { buildFrames, getDashboardDisplay } from "@/lib/dashboard-display";
import { formatIdr, formatPercentChange } from "@/lib/format";

describe("dashboard display", () => {
  const display = getDashboardDisplay();

  it("starts the tick loop on the real, static values", () => {
    const [first] = display.frames;
    // Frame 0 is reached by the last tick, so the wrap-around flashes too.
    expect(first.tickedSymbol).toBe(dashboardContent.ticks.at(-1)?.symbol);
    expect(first.netWorth).toBe(formatIdr(dashboardContent.netWorthIdr));
    expect(first.assets.map((asset) => asset.value)).toEqual(
      dashboardContent.assets.map((asset) => formatIdr(asset.valueIdr)),
    );
    expect(first.assets.map((asset) => asset.change)).toEqual(
      dashboardContent.assets.map((asset) =>
        formatPercentChange(asset.changePercent),
      ),
    );
  });

  it("ends the count-up on exactly the real net worth", () => {
    expect(display.countUp.at(-1)).toBe(display.frames[0].netWorth);
    // Starts near the real value, so the card never drops towards zero.
    expect(display.countUp[0]).toBe(
      formatIdr(netWorthCountUpStart(dashboardContent.netWorthIdr)),
    );
    expect(netWorthCountUpStart(dashboardContent.netWorthIdr)).toBeGreaterThan(
      dashboardContent.netWorthIdr * NET_WORTH_COUNT_UP_START_RATIO -
        COUNT_UP_ROUND_IDR,
    );
  });

  it("counts up without ever going down", () => {
    const steps = 10;
    const finalIdr = 1_000_000;
    const frames = buildCountUp(finalIdr, steps);
    const values = frames.map((frame) => Number(frame.replace(/\D/g, "")));
    for (let index = 1; index < values.length; index += 1) {
      expect(values[index]).toBeGreaterThanOrEqual(values[index - 1]);
    }
  });

  it("has one frame per tick, the last tick looping back to the start", () => {
    expect(buildFrames()).toHaveLength(dashboardContent.ticks.length);
  });

  it("returns every holding to its starting value and change over a cycle", () => {
    for (const asset of dashboardContent.assets) {
      const ticks = dashboardContent.ticks.filter(
        (tick) => tick.symbol === asset.symbol,
      );
      const totalDelta = ticks.reduce((sum, tick) => sum + tick.deltaIdr, 0);
      expect(totalDelta, asset.symbol).toBe(0);
      if (ticks.length > 0) {
        expect(ticks.at(-1)?.changePercent, asset.symbol).toBe(
          asset.changePercent,
        );
      }
    }
  });

  it("only ticks holdings that exist on the card", () => {
    const symbols = dashboardContent.assets.map((asset) => asset.symbol);
    for (const tick of dashboardContent.ticks) {
      expect(symbols).toContain(tick.symbol);
    }
  });

  it("moves exactly one holding per frame, and keeps the total in sync", () => {
    const frames = display.frames;
    for (let index = 1; index < frames.length; index += 1) {
      const tick = dashboardContent.ticks[index - 1];
      expect(frames[index].tickedSymbol).toBe(tick.symbol);
      expect(frames[index].isTickUp).toBe(tick.deltaIdr >= 0);
      const changed = frames[index].assets.filter(
        (asset, position) =>
          asset.value !== frames[index - 1].assets[position].value,
      );
      expect(changed.map((asset) => asset.symbol)).toEqual([tick.symbol]);
      expect(frames[index].netWorth).not.toBe(frames[index - 1].netWorth);
    }
  });
});

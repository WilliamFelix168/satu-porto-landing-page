import { describe, expect, it } from "vitest";

import { formatIdr, formatPercentChange } from "@/lib/format";

const NBSP = " ";

describe("formatIdr", () => {
  it("uses dots as thousands separators and no decimals", () => {
    expect(formatIdr(142_380_000)).toBe(`Rp${NBSP}142.380.000`);
  });

  it("rounds fractional rupiah", () => {
    expect(formatIdr(1_234.6)).toBe(`Rp${NBSP}1.235`);
  });

  it("formats zero", () => {
    expect(formatIdr(0)).toBe(`Rp${NBSP}0`);
  });

  it("prefixes negative amounts with a minus sign", () => {
    expect(formatIdr(-412_500)).toBe(`-Rp${NBSP}412.500`);
  });

  it("keeps the currency and amount together with a no-break space", () => {
    expect(formatIdr(1)).not.toMatch(/ /);
  });
});

describe("formatPercentChange", () => {
  it("adds a plus sign and a decimal comma to gains", () => {
    expect(formatPercentChange(3.2)).toBe("+3,2%");
  });

  it("keeps the minus sign on losses", () => {
    expect(formatPercentChange(-0.8)).toBe("-0,8%");
  });

  it("always shows one decimal place", () => {
    expect(formatPercentChange(12)).toBe("+12,0%");
    expect(formatPercentChange(4.56)).toBe("+4,6%");
  });
});

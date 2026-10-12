import { describe, expect, it } from "vitest";

import {
  aiContent,
  dashboardContent,
  featuresContent,
  marqueeContent,
  navLinks,
  SectionId,
  sectionHref,
  waitlistFormContent,
} from "@/lib/content";
import { PERCENT_SCALE_MAX } from "@/lib/scale";
import { WaitlistError } from "@/lib/waitlist";

describe("content", () => {
  it("builds section hrefs from section ids", () => {
    expect(sectionHref(SectionId.Pricing)).toBe("#pricing");
  });

  it("has unique nav link targets", () => {
    const hrefs = navLinks.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("has a message for every waitlist error", () => {
    for (const error of Object.values(WaitlistError)) {
      expect(waitlistFormContent.errors[error]).toBeTruthy();
    }
  });

  it("puts the address in the success message", () => {
    expect(waitlistFormContent.successBody("budi@satuporto.biz.id")).toContain(
      "budi@satuporto.biz.id",
    );
  });

  it("has three feature cards, one per bento column", () => {
    const columns = 3;
    expect(featuresContent.features).toHaveLength(columns);
  });

  it("keeps every chart bar between 0 and 100 percent, ending on the peak", () => {
    const heights = dashboardContent.trend.map((point) => point.relativeHeight);
    for (const height of heights) {
      expect(height).toBeGreaterThan(0);
      expect(height).toBeLessThanOrEqual(PERCENT_SCALE_MAX);
    }
    expect(heights.at(-1)).toBe(Math.max(...heights));
  });

  it("keeps the flourish percentages within range", () => {
    const categoryTotal = featuresContent.expenseCategories.reduce(
      (total, category) => total + category.percent,
      0,
    );
    expect(categoryTotal).toBeLessThanOrEqual(PERCENT_SCALE_MAX);
    expect(featuresContent.netWorthSplit.ownedPercent).toBeLessThanOrEqual(
      PERCENT_SCALE_MAX,
    );
  });

  it("lists holdings that add up to less than the total net worth", () => {
    const holdings = dashboardContent.assets.reduce(
      (total, asset) => total + asset.valueIdr,
      0,
    );
    expect(holdings).toBeLessThan(dashboardContent.netWorthIdr);
  });

  it("never lets the AI section promise returns or give advice", () => {
    expect(aiContent.disclaimer).toBe(
      "Insight hanya bersifat informasi, bukan nasihat keuangan.",
    );
  });

  it("gives every AI feature two or three benefit bullets", () => {
    const minBullets = 2;
    const maxBullets = 3;
    for (const feature of aiContent.features) {
      expect(feature.bullets.length).toBeGreaterThanOrEqual(minBullets);
      expect(feature.bullets.length).toBeLessThanOrEqual(maxBullets);
    }
  });

  it("has unique marquee entries, so React keys stay stable", () => {
    const items = [...marqueeContent.assets, marqueeContent.more];
    expect(new Set(items).size).toBe(items.length);
  });

  describe("Indonesian dates", () => {
    const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    it("puts the right Indonesian weekday on the receipt date", () => {
      const { date, dateIso } = aiContent.receiptScan;
      const day = new Date(`${dateIso}T12:00:00`);
      expect(date).toBe(
        `${WEEKDAYS[day.getDay()]}, ${day.getDate()} ${MONTHS[day.getMonth()]}`,
      );
    });

    it("labels the trend bars with Indonesian month names, in order", () => {
      const labels = dashboardContent.trend.map((point) => point.label);
      const start = MONTHS.indexOf(labels[0]);
      expect(start).toBeGreaterThanOrEqual(0);
      labels.forEach((label, index) => {
        expect(label).toBe(MONTHS[(start + index) % MONTHS.length]);
      });
    });
  });
});

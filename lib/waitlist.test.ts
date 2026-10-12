import { describe, expect, it } from "vitest";

import {
  EMAIL_PATTERN,
  MAX_EMAIL_LENGTH,
  normalizeEmail,
  validateEmail,
  WaitlistError,
  WaitlistStatus,
} from "@/lib/waitlist";

/** Builds a syntactically valid address of exactly `length` characters. */
function emailOfLength(length: number): string {
  const domain = "@example.com";
  return `${"a".repeat(length - domain.length)}${domain}`;
}

describe("normalizeEmail", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  user@example.com \n\t")).toBe("user@example.com");
  });

  it("lowercases the whole address", () => {
    expect(normalizeEmail("User.Name@Example.COM")).toBe(
      "user.name@example.com",
    );
  });

  it("leaves inner characters alone", () => {
    expect(normalizeEmail("first+tag@sub.example.co.id")).toBe(
      "first+tag@sub.example.co.id",
    );
  });
});

describe("validateEmail", () => {
  describe("accepts", () => {
    it.each([
      "user@example.com",
      "first.last@example.co.id",
      "first+tag@example.com",
      "user_name-1@sub.domain.example.org",
      "a@b.io",
      "budi@satuporto.biz.id",
    ])("%s", (email) => {
      expect(validateEmail(email)).toEqual({
        status: WaitlistStatus.Success,
        email,
      });
    });

    it("normalizes before returning the address", () => {
      expect(validateEmail("  Budi@SatuPorto.Biz.ID  ")).toEqual({
        status: WaitlistStatus.Success,
        email: "budi@satuporto.biz.id",
      });
    });

    it("accepts an address exactly at the maximum length", () => {
      const email = emailOfLength(MAX_EMAIL_LENGTH);
      expect(email).toHaveLength(MAX_EMAIL_LENGTH);
      expect(validateEmail(email).status).toBe(WaitlistStatus.Success);
    });

    it("measures the length after trimming", () => {
      const padded = `   ${emailOfLength(MAX_EMAIL_LENGTH)}   `;
      expect(validateEmail(padded).status).toBe(WaitlistStatus.Success);
    });
  });

  describe("rejects as empty", () => {
    it.each([
      ["an empty string", ""],
      ["spaces", "   "],
      ["tabs and newlines", "\t\n  \r\n"],
    ])("%s", (_label, raw) => {
      expect(validateEmail(raw)).toEqual({
        status: WaitlistStatus.Invalid,
        error: WaitlistError.Empty,
      });
    });
  });

  describe("rejects as too long", () => {
    it("one character over the maximum", () => {
      expect(validateEmail(emailOfLength(MAX_EMAIL_LENGTH + 1))).toEqual({
        status: WaitlistStatus.Invalid,
        error: WaitlistError.TooLong,
      });
    });

    it("checks length before the pattern", () => {
      const longGarbage = "x".repeat(MAX_EMAIL_LENGTH + 1);
      expect(validateEmail(longGarbage)).toEqual({
        status: WaitlistStatus.Invalid,
        error: WaitlistError.TooLong,
      });
    });
  });

  describe("rejects as malformed", () => {
    it.each([
      ["no @", "user.example.com"],
      ["no local part", "@example.com"],
      ["no domain", "user@"],
      ["no top-level domain", "user@example"],
      ["one-letter top-level domain", "user@example.c"],
      ["numeric top-level domain", "user@example.123"],
      ["trailing dot", "user@example.com."],
      ["empty domain label", "user@example..com"],
      ["domain starting with a dot", "user@.example.com"],
      ["two @ signs", "user@@example.com"],
      ["an @ in the domain", "user@exa@mple.com"],
      ["inner whitespace", "us er@example.com"],
      ["whitespace in the domain", "user@exam ple.com"],
      ["plain text", "not an email"],
    ])("%s (%s)", (_label, raw) => {
      expect(validateEmail(raw)).toEqual({
        status: WaitlistStatus.Invalid,
        error: WaitlistError.Malformed,
      });
    });
  });
});

describe("EMAIL_PATTERN", () => {
  it("is case-insensitive", () => {
    expect(EMAIL_PATTERN.test("USER@EXAMPLE.COM")).toBe(true);
  });
});

/**
 * Waitlist email validation. Pure functions only, so the rules are easy to
 * test and can later be shared with a server-side handler.
 */

/** RFC 5321 caps a forward path at 254 characters. */
export const MAX_EMAIL_LENGTH = 254;

/**
 * Deliberately pragmatic: one "@", no whitespace, a dotted domain and a
 * top-level domain of at least two letters. The server stays the source of
 * truth once a backend exists.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;

export enum WaitlistStatus {
  Idle = "idle",
  Submitting = "submitting",
  Invalid = "invalid",
  Success = "success",
}

export enum WaitlistError {
  Empty = "empty",
  TooLong = "too-long",
  Malformed = "malformed",
  SubmitFailed = "submit-failed",
}

export type WaitlistResult =
  | { status: WaitlistStatus.Success; email: string }
  | { status: WaitlistStatus.Invalid; error: WaitlistError };

/** Trims surrounding whitespace and lowercases the address. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateEmail(raw: string): WaitlistResult {
  const email = normalizeEmail(raw);

  if (email.length === 0) {
    return { status: WaitlistStatus.Invalid, error: WaitlistError.Empty };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { status: WaitlistStatus.Invalid, error: WaitlistError.TooLong };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: WaitlistStatus.Invalid, error: WaitlistError.Malformed };
  }

  return { status: WaitlistStatus.Success, email };
}

import { vi } from "vitest";

/**
 * Stubs `window.matchMedia` (jsdom has none) so every query reports
 * `matches`. Restored by `vi.unstubAllGlobals` in the test setup.
 */
export function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

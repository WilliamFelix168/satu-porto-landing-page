import { vi } from "vitest";

/**
 * Replaces `requestAnimationFrame` with a queue the test flushes by hand, so
 * it can assert what happens before and after the next frame. The spy is
 * restored automatically (`restoreMocks` in vitest.config.mts).
 */
export function captureAnimationFrames() {
  const callbacks: FrameRequestCallback[] = [];
  let requested = 0;

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callbacks.push(callback);
    requested += 1;
    return requested;
  });

  return {
    /** Number of frames requested so far. */
    get requested() {
      return requested;
    },
    /** Runs every queued frame callback. */
    flush() {
      for (const callback of callbacks.splice(0)) {
        callback(performance.now());
      }
    },
  };
}

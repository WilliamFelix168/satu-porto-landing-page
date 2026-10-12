import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCountUp } from "@/lib/use-count-up";
import { useLoopIndex } from "@/lib/use-loop-index";

const FRAMES = ["0", "5", "9", "10"];
const STEP_MS = 50;
/** A start delay, so a restart is observable on its first frame. */
const START_DELAY_MS = 200;
const LOOP_COUNT = 3;
const INTERVAL_MS = 100;
const FULL_COUNT_MS = START_DELAY_MS + STEP_MS * FRAMES.length;

function CountProbe({
  isActive,
  restartKey = 0,
}: {
  isActive: boolean;
  restartKey?: number;
}) {
  const { text } = useCountUp(FRAMES, {
    isActive,
    stepMs: STEP_MS,
    startDelayMs: START_DELAY_MS,
    restartKey,
  });
  return <span data-testid="count">{text}</span>;
}

function LoopProbe({ isActive }: { isActive: boolean }) {
  const { index, advances } = useLoopIndex(LOOP_COUNT, {
    isActive,
    intervalMs: INTERVAL_MS,
  });
  return (
    <span data-testid="loop" data-advances={advances}>
      {index}
    </span>
  );
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

function countText() {
  return screen.getByTestId("count").textContent;
}

describe("useCountUp", () => {
  it("shows the final frame while inactive", () => {
    render(<CountProbe isActive={false} />);
    expect(countText()).toBe("10");
  });

  it("waits for the start delay, counts through every frame and stops", async () => {
    vi.useFakeTimers();
    render(<CountProbe isActive />);
    expect(countText()).toBe("0");

    await advance(START_DELAY_MS - 1);
    expect(countText()).toBe("0");
    await advance(1);
    expect(countText()).toBe("5");
    await advance(STEP_MS * FRAMES.length);
    expect(countText()).toBe("10");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("restarts from the first frame when the restart key changes", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<CountProbe isActive restartKey={0} />);
    await advance(FULL_COUNT_MS);
    expect(countText()).toBe("10");

    rerender(<CountProbe isActive restartKey={1} />);

    // Held on the first frame for the whole start delay, not the old value.
    expect(countText()).toBe("0");
    await advance(START_DELAY_MS - 1);
    expect(countText()).toBe("0");
  });

  it("restarts from the first frame after going inactive and active again", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<CountProbe isActive />);
    await advance(FULL_COUNT_MS);

    rerender(<CountProbe isActive={false} />);
    expect(countText()).toBe("10");
    rerender(<CountProbe isActive />);

    expect(countText()).toBe("0");
    await advance(START_DELAY_MS - 1);
    expect(countText()).toBe("0");
  });
});

describe("useLoopIndex", () => {
  it("cycles through the indexes, wraps around and counts every advance", async () => {
    vi.useFakeTimers();
    render(<LoopProbe isActive />);
    const seen = [screen.getByTestId("loop").textContent];
    for (let tick = 0; tick < LOOP_COUNT; tick += 1) {
      await advance(INTERVAL_MS);
      seen.push(screen.getByTestId("loop").textContent);
    }
    expect(seen).toEqual(["0", "1", "2", "0"]);
    expect(screen.getByTestId("loop")).toHaveAttribute(
      "data-advances",
      String(LOOP_COUNT),
    );
  });

  it("stops and resets to 0 when inactive", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<LoopProbe isActive />);
    await advance(INTERVAL_MS);
    rerender(<LoopProbe isActive={false} />);
    expect(screen.getByTestId("loop")).toHaveTextContent("0");
    expect(screen.getByTestId("loop")).toHaveAttribute("data-advances", "0");
    expect(vi.getTimerCount()).toBe(0);
  });
});

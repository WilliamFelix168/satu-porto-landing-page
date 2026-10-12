import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import {
  createElement,
  forwardRef,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  useState,
} from "react";
import { useInView } from "motion/react";
import { afterEach, vi } from "vitest";

/** Animation-only props that must not reach the DOM. */
const MOTION_PROPS = new Set([
  "animate",
  "exit",
  "initial",
  "layout",
  "transition",
  "variants",
  "viewport",
  "whileHover",
  "whileInView",
  "whileTap",
  "custom",
]);

type MotionMockProps = ComponentPropsWithRef<ElementType> &
  Record<string, unknown>;

function stripMotionProps(props: MotionMockProps): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !MOTION_PROPS.has(key)),
  );
}

const motionComponentCache = new Map<string, ElementType>();

/** `motion.div`, `motion.section`, ... render as their plain elements. */
function createMotionComponent(tag: string): ElementType {
  const cached = motionComponentCache.get(tag);
  if (cached) return cached;

  const Component = forwardRef<HTMLElement, MotionMockProps>(
    function MotionMock(props, ref) {
      // The animation targets are kept as a data attribute so tests can
      // assert what an element animates (e.g. never a dash-based pathLength).
      const animate = props.animate;
      return createElement(tag, {
        ...resolveMotionValues(stripMotionProps(props)),
        "data-motion-animate":
          animate === undefined ? undefined : JSON.stringify(animate),
        ref,
      });
    },
  );
  motionComponentCache.set(tag, Component);
  return Component;
}

/** Minimal stand-in for motion's MotionValue: holds a value, no animation. */
class MockMotionValue<T> {
  constructor(private value: T) {}
  get(): T {
    return this.value;
  }
  set(value: T) {
    this.value = value;
  }
}

/** Reads a motion value (or derived value) once, for static test markup. */
function readValue(value: unknown): unknown {
  return value instanceof MockMotionValue || value instanceof MockDerivedValue
    ? value.get()
    : value;
}

/** Resolves motion values in props and in the `style` object (one level). */
function resolveMotionValues(
  props: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      key === "style" && value && typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value).map(([name, entry]) => [
              name,
              readValue(entry),
            ]),
          )
        : readValue(value),
    ]),
  );
}

class MockDerivedValue<T> {
  constructor(private readonly compute: () => T) {}
  get(): T {
    return this.compute();
  }
}

type Readable = { get(): unknown };

vi.mock("motion/react", () => ({
  motion: new Proxy(
    {},
    { get: (_target, tag: string) => createMotionComponent(tag) },
  ),
  // A spy, so tests can assert the reduced-motion configuration.
  MotionConfig: vi.fn(({ children }: { children: ReactNode }) => children),
  // Out of view by default, so showcase visuals render their finished state.
  useInView: vi.fn(() => false),
  useMotionValue: <T,>(initial: T) =>
    useState(() => new MockMotionValue(initial))[0],
  useTransform: (
    input: Readable | Readable[] | (() => unknown),
    transform?: (value: unknown) => unknown,
  ) =>
    new MockDerivedValue(() => {
      if (typeof input === "function") return input();
      const value = Array.isArray(input)
        ? input.map((item) => item.get())
        : input.get();
      return transform ? transform(value) : value;
    }),
  // Animations complete instantly in tests.
  animate: (
    value: MockMotionValue<unknown>,
    target: unknown,
    options?: { onComplete?: () => void },
  ) => {
    value.set(target);
    options?.onComplete?.();
    return { stop: () => {} };
  },
}));

afterEach(() => {
  cleanup();
  vi.mocked(useInView).mockReturnValue(false);
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export enum MockChipTone {
  Emerald = "emerald",
  Indigo = "indigo",
  Neutral = "neutral",
}

const toneClassName: Record<MockChipTone, string> = {
  [MockChipTone.Emerald]:
    "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200",
  [MockChipTone.Indigo]:
    "border-indigo-300/20 bg-indigo-400/[0.08] text-indigo-200",
  [MockChipTone.Neutral]: "border-white/10 bg-white/[0.04] text-zinc-200",
};

interface MockChipProps {
  children: ReactNode;
  tone?: MockChipTone;
  className?: string;
}

/** Small rounded label used inside decorative product mocks. */
export function MockChip({
  children,
  tone = MockChipTone.Neutral,
  className,
}: MockChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        toneClassName[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

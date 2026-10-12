import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

/** Emerald for gains, rose for losses. */
export function changeClassName(isGain: boolean): string {
  return isGain ? "text-emerald-300" : "text-rose-300";
}

export enum ChangePillSize {
  Small = "small",
  Medium = "medium",
}

const sizeClassName: Record<ChangePillSize, { pill: string; icon: string }> = {
  [ChangePillSize.Small]: { pill: "text-2xs", icon: "size-3" },
  [ChangePillSize.Medium]: { pill: "text-xs", icon: "size-3.5" },
};

interface ChangePillProps {
  /** Pre-formatted change, e.g. "+12,4%". */
  value: string;
  isGain: boolean;
  /** Muted text after the value, e.g. "this month". */
  suffix?: string;
  size?: ChangePillSize;
  className?: string;
}

/** Rounded pill with a trend arrow, coloured by direction. */
export function ChangePill({
  value,
  isGain,
  suffix,
  size = ChangePillSize.Medium,
  className,
}: ChangePillProps) {
  const Icon = isGain ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-medium",
        sizeClassName[size].pill,
        changeClassName(isGain),
        className,
      )}
    >
      <Icon aria-hidden="true" className={sizeClassName[size].icon} />
      {value}
      {suffix ? <span className="text-zinc-400">{suffix}</span> : null}
    </span>
  );
}

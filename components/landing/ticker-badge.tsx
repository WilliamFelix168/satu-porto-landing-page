import { cn } from "@/lib/utils";

interface TickerBadgeProps {
  label: string;
  /** Glows to show it is the one syncing right now. */
  isActive?: boolean;
  className?: string;
}

/** Small round ticker badge, sized to fit a four-letter symbol. */
export function TickerBadge({
  label,
  isActive = false,
  className,
}: TickerBadgeProps) {
  return (
    <span
      data-active={isActive}
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full border bg-zinc-900 text-2xs leading-none font-semibold tracking-tighter transition-[border-color,box-shadow,color] duration-300",
        isActive
          ? "z-10 border-emerald-300 text-white shadow-glow-emerald"
          : "border-white/15 text-zinc-300",
        className,
      )}
    >
      {label}
    </span>
  );
}

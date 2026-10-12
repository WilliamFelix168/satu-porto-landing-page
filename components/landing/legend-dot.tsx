import { cn } from "@/lib/utils";

/** Small colour key for a chart legend; pass the colour as a `bg-*` class. */
export function LegendDot({ className }: { className: string }) {
  return <span className={cn("size-1.5 shrink-0 rounded-full", className)} />;
}

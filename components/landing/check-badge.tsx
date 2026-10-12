import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Small emerald circle with a check mark, for benefit lists and detected rows. */
export function CheckBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300",
        className,
      )}
    >
      <Check aria-hidden="true" className="size-3" />
    </span>
  );
}

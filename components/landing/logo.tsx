import { ChartPie } from "lucide-react";

import { brand } from "@/lib/content";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/** Brand mark: a glowing icon tile next to the wordmark. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg border border-emerald-300/30 bg-gradient-to-br from-emerald-400/25 to-indigo-500/25 shadow-glow-emerald-soft">
        <ChartPie aria-hidden="true" className="size-4 text-emerald-200" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">
        {brand.name}
      </span>
    </span>
  );
}

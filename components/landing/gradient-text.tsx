import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

/** The single source of the emerald-to-indigo clipped text gradient. */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-400 bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

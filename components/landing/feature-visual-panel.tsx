import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The inner glass panel every feature card's visual sits in. Same styling
 * and, from `md` (where cards sit side by side), the same fixed height in
 * every card, so the panels line up. On phones the height follows the
 * content. It is a size container, so visuals can adapt to its width.
 */
export const featureVisualPanelClassName =
  "@container flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 md:h-76 lg:max-xl:p-3";

interface FeatureVisualPanelProps {
  children: ReactNode;
  className?: string;
}

export function FeatureVisualPanel({
  children,
  className,
}: FeatureVisualPanelProps) {
  return (
    <div
      data-feature-panel=""
      className={cn(featureVisualPanelClassName, className)}
    >
      {children}
    </div>
  );
}

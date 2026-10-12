import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export enum IconTileSize {
  Small = "small",
  Medium = "medium",
}

const sizeClassName: Record<IconTileSize, string> = {
  [IconTileSize.Small]: "size-9",
  [IconTileSize.Medium]: "size-11",
};

interface IconTileProps {
  /** An icon (mark it `aria-hidden`) or a short label such as a ticker. */
  children: ReactNode;
  size?: IconTileSize;
  className?: string;
}

/** Rounded glass square that frames an icon or a ticker symbol. */
export function IconTile({
  children,
  size = IconTileSize.Medium,
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]",
        sizeClassName[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

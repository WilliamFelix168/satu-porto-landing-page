import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlassCardElement = "div" | "article" | "li";

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  /** Semantic element to render. Defaults to a plain div. */
  as?: GlassCardElement;
  /** Brightens the border on hover. Off for static, non-card surfaces. */
  interactive?: boolean;
}

/**
 * The glassmorphism surface shared by every card on the page. `isolate` keeps
 * decorative glows (which sit at `-z-10`) inside the card, behind its content.
 */
export function GlassCard({
  as: Element = "div",
  interactive = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <Element
      className={cn(
        "relative isolate overflow-clip rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl",
        interactive && "transition-colors duration-300 hover:border-white/20",
        className,
      )}
      {...props}
    />
  );
}

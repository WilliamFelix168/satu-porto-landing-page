import type { HTMLAttributes, ReactNode } from "react";

import { GlassCard } from "@/components/landing/glass-card";
import { Glow, GlowTone } from "@/components/landing/glow";
import { cn } from "@/lib/utils";

/** The soft light behind a showcase panel; place it in the panel's container. */
export function PanelGlow({ tone }: { tone: GlowTone }) {
  return <Glow tone={tone} className="-inset-8 opacity-70" />;
}

interface GradientBorderPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Colour of the soft light behind the panel. Leave it out when the panel
   * sits inside a fading (opacity-animated) wrapper and render the `Glow`
   * outside that wrapper instead: a large blur inside a fading layer is drawn
   * as a hard-edged rectangle while the fade runs.
   */
  glowTone?: GlowTone;
  /** Classes for the inner glass surface. */
  className?: string;
}

/**
 * Showcase surface: a dark card with an emerald-to-indigo gradient border
 * and an optional soft glow behind it. Used for the hero dashboard and the AI
 * section visuals. The surface is nearly opaque, so it skips the backdrop
 * blur: a backdrop filter under a fading ancestor samples only that layer and
 * flashes dark while the fade runs.
 */
export function GradientBorderPanel({
  children,
  glowTone,
  className,
  ...props
}: GradientBorderPanelProps) {
  return (
    <div className="relative isolate">
      {glowTone ? <PanelGlow tone={glowTone} /> : null}
      {/* Gradient border: a slightly larger, blurred gradient behind the card. */}
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-[calc(var(--radius-3xl)+1px)] bg-gradient-to-b from-emerald-400/40 via-white/10 to-indigo-500/40 blur-sm"
      />
      <GlassCard
        interactive={false}
        className={cn(
          "bg-zinc-950/90 shadow-2xl shadow-emerald-500/10 backdrop-blur-none",
          className,
        )}
        {...props}
      >
        {children}
      </GlassCard>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

interface ShimmerPillProps {
  label: string;
  icon: LucideIcon;
}

/**
 * Eyebrow pill with a gradient border that slowly sweeps around it (the
 * "shimmer" keyframe in globals.css, only when motion is allowed).
 */
export function ShimmerPill({ label, icon: Icon }: ShimmerPillProps) {
  return (
    <span className="inline-flex rounded-full bg-shimmer-border p-px shadow-glow-emerald-soft motion-safe:animate-shimmer">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/85 px-3.5 py-1 text-sm font-medium text-zinc-100">
        <Icon aria-hidden="true" className="size-4 text-emerald-300" />
        {label}
      </span>
    </span>
  );
}

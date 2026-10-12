import { cn } from "@/lib/utils";

export enum GlowTone {
  Emerald = "emerald",
  Indigo = "indigo",
}

const toneClassName: Record<GlowTone, string> = {
  [GlowTone.Emerald]: "bg-glow-emerald",
  [GlowTone.Indigo]: "bg-glow-indigo",
};

interface GlowProps {
  tone: GlowTone;
  /** Position and size, e.g. `left-1/2 top-0 size-[40rem] -translate-x-1/2`. */
  className?: string;
}

/**
 * Decorative radial light behind a section. The parent must be `relative`
 * and clip overflow so the glow never causes horizontal scroll.
 */
export function Glow({ tone, className }: GlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full blur-3xl",
        toneClassName[tone],
        className,
      )}
    />
  );
}

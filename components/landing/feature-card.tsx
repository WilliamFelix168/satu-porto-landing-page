import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { GlassCard } from "@/components/landing/glass-card";
import { Glow, GlowTone } from "@/components/landing/glow";
import { IconTile } from "@/components/landing/icon-tile";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Optional decorative visual shown under the description. */
  visual?: ReactNode;
  className?: string;
}

/**
 * Room for three lines of description wherever cards sit side by side, so
 * the visuals below start at the same height in every card of a row (the
 * longest description wraps to three lines in the narrowest column).
 */
const descriptionMinHeightClassName = "md:min-h-[3lh]";

/**
 * Glass card with an icon tile, a title, a description and a visual directly
 * underneath (no stretching, so no empty gap above the visual).
 */
export function FeatureCard({
  title,
  description,
  icon: Icon,
  visual,
  className,
}: FeatureCardProps) {
  return (
    <GlassCard
      as="article"
      className={cn(
        "group flex h-full flex-col gap-6 p-6 sm:p-8",
        // Three cards per row are at their narrowest between lg and xl.
        "lg:max-xl:p-6",
        className,
      )}
    >
      {/* Soft corner light that brightens on hover. */}
      <Glow
        tone={GlowTone.Emerald}
        className="-top-24 -right-24 size-56 opacity-40 transition-opacity duration-500 group-hover:opacity-80"
      />
      <div>
        <IconTile className="text-emerald-300">
          <Icon aria-hidden="true" className="size-5" />
        </IconTile>
        <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm text-pretty text-zinc-400 sm:text-base",
            descriptionMinHeightClassName,
          )}
        >
          {description}
        </p>
      </div>
      {visual}
    </GlassCard>
  );
}

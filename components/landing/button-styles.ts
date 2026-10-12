import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Visible keyboard focus ring for custom links and controls. */
export const focusRingClassName =
  "focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:outline-none";

/** Emerald call-to-action button with a soft glow. Used by every primary CTA. */
export const primaryGlowButtonClassName = cn(
  buttonVariants(),
  "h-12 rounded-full bg-emerald-400 px-6 text-base font-semibold text-zinc-950 shadow-glow-emerald transition-[background-color,box-shadow] hover:bg-emerald-300 hover:shadow-glow-emerald-strong focus-visible:ring-emerald-300/60 disabled:opacity-70",
);

/** Translucent outline button for secondary actions on the dark background. */
export const outlineGlassButtonClassName = cn(
  buttonVariants({ variant: "outline" }),
  "h-10 rounded-full border-white/15 bg-white/[0.03] px-4 text-white hover:border-white/30 hover:bg-white/[0.08] hover:text-white focus-visible:ring-emerald-300/60",
);

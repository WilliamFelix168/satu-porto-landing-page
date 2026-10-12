import { LandingSection } from "@/components/landing/landing-section";
import { PausableMarquee } from "@/components/landing/pausable-marquee";
import { HeadingId, marqueeContent as marquee } from "@/lib/content";
import { cn } from "@/lib/utils";

interface MarqueeTrackProps {
  /** The second copy only exists to make the loop seamless. */
  isDuplicate?: boolean;
}

function MarqueeTrack({ isDuplicate = false }: MarqueeTrackProps) {
  const items = [...marquee.assets, marquee.more];
  return (
    <ul
      aria-hidden={isDuplicate ? true : undefined}
      className={cn(
        "flex shrink-0 items-center gap-x-10 pr-10 motion-safe:animate-marquee",
        // Paused while the tracks are hovered, or when toggled off.
        "group-hover/ticker:[animation-play-state:paused] group-data-[paused=true]/ticker:[animation-play-state:paused]",
        "motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0",
        isDuplicate && "motion-reduce:hidden",
      )}
    >
      {items.map((item, index) => (
        <li
          key={item}
          className="flex items-center gap-x-10 text-lg font-medium whitespace-nowrap text-zinc-400 sm:text-xl"
        >
          {index > 0 ? (
            <span aria-hidden="true" className="text-emerald-400/60">
              •
            </span>
          ) : null}
          <span
            className={item === marquee.more ? "text-emerald-300" : undefined}
          >
            {item}
          </span>
        </li>
      ))}
      {/* Separator between the end of one copy and the start of the next. */}
      <li
        aria-hidden="true"
        className="text-emerald-400/60 motion-reduce:hidden"
      >
        •
      </li>
    </ul>
  );
}

/** Seamless CSS ticker of supported assets, with a pause/play toggle. */
export function AssetMarquee() {
  return (
    <LandingSection
      labelledBy={HeadingId.Marquee}
      className="border-y border-white/10 bg-white/[0.01] py-10 sm:py-12"
      containerClassName="max-w-7xl px-0 sm:px-0"
    >
      <PausableMarquee
        heading={
          <h2
            id={HeadingId.Marquee}
            className="text-center text-xs font-medium tracking-widest text-zinc-400 uppercase"
          >
            {marquee.label}
          </h2>
        }
      >
        <MarqueeTrack />
        <MarqueeTrack isDuplicate />
      </PausableMarquee>
    </LandingSection>
  );
}

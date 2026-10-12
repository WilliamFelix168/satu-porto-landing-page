import { Badge } from "@/components/ui/badge";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Glow, GlowTone } from "@/components/landing/glow";
import { GradientText } from "@/components/landing/gradient-text";
import { LandingSection } from "@/components/landing/landing-section";
import { HeroEntrance } from "@/components/landing/hero-entrance";
import { Float } from "@/components/landing/motion";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { HeadingId, heroContent as hero, SectionId } from "@/lib/content";

/** Order in which hero blocks rise into place. */
enum HeroStep {
  Badge,
  Headline,
  Subheadline,
  Form,
  Preview,
}

export function Hero() {
  return (
    <LandingSection
      id={SectionId.Top}
      labelledBy={HeadingId.Hero}
      className="pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      <Glow
        tone={GlowTone.Emerald}
        className="top-[-12rem] left-1/2 h-[36rem] w-[56rem] -translate-x-1/2"
      />
      <Glow
        tone={GlowTone.Indigo}
        className="top-[28rem] right-[-16rem] h-[32rem] w-[40rem]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-grid" />

      <div className="flex flex-col items-center text-center">
        <HeroEntrance index={HeroStep.Badge}>
          <span className="inline-flex rounded-full bg-gradient-to-r from-emerald-400/60 via-white/15 to-indigo-400/60 p-px shadow-glow-emerald-soft">
            <Badge
              variant="outline"
              className="h-auto gap-2 rounded-full border-0 bg-black/80 px-3.5 py-1 text-xs font-medium text-zinc-200 sm:text-sm"
            >
              <span aria-hidden="true">{hero.badge.emoji}</span>
              {hero.badge.label}
            </Badge>
          </span>
        </HeroEntrance>

        <HeroEntrance index={HeroStep.Headline}>
          <h1
            id={HeadingId.Hero}
            className="mt-8 max-w-5xl text-4xl leading-[1.02] font-bold tracking-tighter text-balance text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {hero.headline.lead}{" "}
            <GradientText className="lg:whitespace-nowrap">
              {hero.headline.highlight}
            </GradientText>
            {hero.headline.trail}
          </h1>
        </HeroEntrance>

        <HeroEntrance index={HeroStep.Subheadline}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-zinc-400 sm:text-xl">
            {hero.subheadline}
          </p>
        </HeroEntrance>

        <HeroEntrance
          index={HeroStep.Form}
          className="mt-10 flex w-full flex-col items-center"
        >
          <WaitlistForm />
          <p className="mt-4 text-sm text-zinc-400">{hero.formNote}</p>
        </HeroEntrance>

        <HeroEntrance
          index={HeroStep.Preview}
          className="mt-16 w-full max-w-5xl sm:mt-20"
        >
          <Float>
            <DashboardPreview />
          </Float>
        </HeroEntrance>
      </div>
    </LandingSection>
  );
}

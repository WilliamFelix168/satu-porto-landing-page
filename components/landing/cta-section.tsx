import { GlassCard } from "@/components/landing/glass-card";
import { Glow, GlowTone } from "@/components/landing/glow";
import { LandingSection } from "@/components/landing/landing-section";
import { Reveal } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/section-heading";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { ctaContent as content, HeadingId, SectionId } from "@/lib/content";

/** Closing call to action with the second waitlist form. */
export function CtaSection() {
  return (
    <LandingSection id={SectionId.Waitlist} labelledBy={HeadingId.Cta}>
      <Reveal>
        <GlassCard interactive={false} className="px-6 py-16 sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
          />
          <Glow
            tone={GlowTone.Emerald}
            className="top-0 left-1/2 h-[18rem] w-[30rem] -translate-x-1/2 -translate-y-1/2"
          />
          <Glow
            tone={GlowTone.Emerald}
            className="top-0 left-1/2 h-[26rem] w-[44rem] -translate-x-1/2 -translate-y-1/3"
          />
          <Glow
            tone={GlowTone.Indigo}
            className="right-[-10rem] bottom-[-14rem] h-[26rem] w-[34rem]"
          />
          <SectionHeading
            id={HeadingId.Cta}
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <WaitlistForm className="mx-auto mt-10" />
        </GlassCard>
      </Reveal>
    </LandingSection>
  );
}

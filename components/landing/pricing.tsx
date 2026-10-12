import { primaryGlowButtonClassName } from "@/components/landing/button-styles";
import { CheckBadge } from "@/components/landing/check-badge";
import { GlassCard } from "@/components/landing/glass-card";
import { Glow, GlowTone } from "@/components/landing/glow";
import { LandingSection } from "@/components/landing/landing-section";
import { Reveal, RevealStagger, StaggerPop } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/section-heading";
import { ShimmerPill } from "@/components/landing/shimmer-pill";
import { WaitlistLink } from "@/components/landing/waitlist-link";
import { HeadingId, pricingContent as content, SectionId } from "@/lib/content";
import { formatIdr } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { plan } = content;

  return (
    <LandingSection id={SectionId.Pricing} labelledBy={HeadingId.Pricing}>
      <Glow
        tone={GlowTone.Emerald}
        className="top-1/2 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 -translate-y-1/2"
      />
      <Reveal>
        <SectionHeading
          id={HeadingId.Pricing}
          eyebrow={content.eyebrow}
          title={content.title}
        />
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-md">
        <GlassCard as="article" className="p-8 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <ShimmerPill label={plan.badge} icon={plan.icon} />
          </div>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tighter text-white">
              {formatIdr(plan.priceIdr)}
            </span>
            <span className="text-zinc-400">{plan.period}</span>
          </p>
          <p className="mt-2 text-zinc-400">{plan.summary}</p>

          <RevealStagger className="mt-8">
            <ul className="space-y-3">
              {plan.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <StaggerPop className="mt-0.5 inline-flex">
                    <CheckBadge />
                  </StaggerPop>
                  {perk}
                </li>
              ))}
            </ul>
          </RevealStagger>

          <WaitlistLink
            className={cn(primaryGlowButtonClassName, "mt-10 w-full")}
          >
            {plan.ctaLabel}
          </WaitlistLink>
        </GlassCard>
      </Reveal>
    </LandingSection>
  );
}

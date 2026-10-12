import { Sparkles } from "lucide-react";

import { AiFeatureRow } from "@/components/landing/ai/ai-feature-row";
import { Glow, GlowTone } from "@/components/landing/glow";
import { LandingSection } from "@/components/landing/landing-section";
import { Reveal } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/section-heading";
import { ShimmerPill } from "@/components/landing/shimmer-pill";
import { aiContent as content, HeadingId, SectionId } from "@/lib/content";

/**
 * "SatuPorto AI" showcase: screenshot import, receipt scanning and insights,
 * each as a row with an animated visual.
 */
export function AiSection() {
  return (
    <LandingSection id={SectionId.Ai} labelledBy={HeadingId.Ai}>
      <Glow
        tone={GlowTone.Emerald}
        className="top-0 left-1/2 h-[28rem] w-[48rem] -translate-x-1/2 -translate-y-1/3"
      />
      <Reveal className="flex flex-col items-center">
        <ShimmerPill label={content.badge} icon={Sparkles} />
        <SectionHeading
          id={HeadingId.Ai}
          title={content.title}
          titleHighlight={content.titleHighlight}
          description={content.description}
          className="mt-6"
        />
      </Reveal>

      <ul className="mt-16 space-y-20 sm:mt-20 lg:space-y-28">
        {content.features.map((feature, index) => (
          <AiFeatureRow key={feature.title} feature={feature} index={index} />
        ))}
      </ul>

      <p className="mt-16 text-center text-sm text-zinc-400">
        {content.disclaimer}
      </p>
    </LandingSection>
  );
}

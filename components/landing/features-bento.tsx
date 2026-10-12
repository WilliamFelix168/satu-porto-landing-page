import { FeatureCard } from "@/components/landing/feature-card";
import { FeatureVisualFlourish } from "@/components/landing/feature-visuals";
import { Glow, GlowTone } from "@/components/landing/glow";
import { LandingSection } from "@/components/landing/landing-section";
import {
  Reveal,
  RevealStagger,
  StaggerItem,
} from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  threeUpGridClassName,
  threeUpItemClassName,
} from "@/components/landing/three-up-grid";
import {
  featuresContent as content,
  HeadingId,
  SectionId,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Three equal cards in one row from `lg`. At `md` two sit side by side and
 * the last runs full width below; under `md` everything stacks. Cards stretch
 * to the tallest in their row, and their visuals sit at the bottom.
 */
export function FeaturesBento() {
  return (
    <LandingSection id={SectionId.Features} labelledBy={HeadingId.Features}>
      <Glow
        tone={GlowTone.Indigo}
        className="top-1/3 left-[-18rem] h-[30rem] w-[36rem]"
      />
      <Reveal>
        <SectionHeading
          id={HeadingId.Features}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
      </Reveal>

      <RevealStagger className={cn("mt-14", threeUpGridClassName)}>
        {content.features.map((feature, index) => (
          <StaggerItem
            key={feature.title}
            className={threeUpItemClassName(index, content.features.length)}
          >
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              visual={<FeatureVisualFlourish visual={feature.visual} />}
            />
          </StaggerItem>
        ))}
      </RevealStagger>
    </LandingSection>
  );
}

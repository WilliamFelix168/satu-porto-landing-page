import { FeatureCard } from "@/components/landing/feature-card";
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
import { StepFlourish } from "@/components/landing/steps/step-visual";
import {
  HeadingId,
  howItWorksContent as content,
  SectionId,
} from "@/lib/content";

export function HowItWorks() {
  return (
    <LandingSection id={SectionId.HowItWorks} labelledBy={HeadingId.HowItWorks}>
      <Reveal>
        <SectionHeading
          id={HeadingId.HowItWorks}
          eyebrow={content.eyebrow}
          title={content.title}
        />
      </Reveal>

      <RevealStagger className="mt-14">
        <ol className={threeUpGridClassName}>
          {content.steps.map((step, index) => (
            <li
              key={step.title}
              className={threeUpItemClassName(index, content.steps.length)}
            >
              <StaggerItem className="h-full">
                <FeatureCard
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  visual={<StepFlourish visual={step.visual} index={index} />}
                />
              </StaggerItem>
            </li>
          ))}
        </ol>
      </RevealStagger>
    </LandingSection>
  );
}

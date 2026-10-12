import { ChevronDown } from "lucide-react";

import { focusRingClassName } from "@/components/landing/button-styles";
import { GlassCard } from "@/components/landing/glass-card";
import { LandingSection } from "@/components/landing/landing-section";
import { Reveal } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/section-heading";
import { faqContent as content, HeadingId, SectionId } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Frequently asked questions as native `<details>` disclosures: keyboard and
 * screen-reader friendly, works without JavaScript, and every answer is in
 * the HTML (crawlable) even while collapsed.
 */
export function FaqSection() {
  return (
    <LandingSection id={SectionId.Faq} labelledBy={HeadingId.Faq}>
      <Reveal>
        <SectionHeading
          id={HeadingId.Faq}
          eyebrow={content.eyebrow}
          title={content.title}
        />
      </Reveal>

      <Reveal className="mx-auto mt-12 max-w-3xl">
        <GlassCard
          as="div"
          interactive={false}
          className="divide-y divide-white/10"
        >
          {content.items.map((item) => (
            <details key={item.question} className="group px-5 sm:px-6">
              <summary
                className={cn(
                  "flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 text-left text-base font-medium text-white [&::-webkit-details-marker]:hidden",
                  focusRingClassName,
                )}
              >
                {/* The h3 stays inside <summary>: Chrome exposes it as a
                    heading (heading navigation works) while the summary keeps
                    its native, announced expanded state. */}
                <h3 className="text-pretty">{item.question}</h3>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-5 text-sm text-pretty text-zinc-400 sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </GlassCard>
      </Reveal>
    </LandingSection>
  );
}

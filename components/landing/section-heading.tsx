import { GradientText } from "@/components/landing/gradient-text";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Id of the heading, referenced by the section's aria-labelledby. */
  id: string;
  title: string;
  /** Optional words after the title, rendered with the brand gradient. */
  titleHighlight?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

/** Shared eyebrow, h2 and lead paragraph used by every below-the-fold section. */
export function SectionHeading({
  id,
  title,
  titleHighlight,
  eyebrow,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-emerald-300/90 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-3 text-4xl font-bold tracking-tighter text-balance text-white sm:text-5xl"
      >
        {title}
        {titleHighlight ? (
          <>
            {" "}
            <GradientText>{titleHighlight}</GradientText>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-pretty text-zinc-400 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

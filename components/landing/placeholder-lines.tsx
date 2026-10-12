import { cn } from "@/lib/utils";

interface PlaceholderLinesProps {
  /** Width of each line, in percent of the container. */
  widths: readonly number[];
  /** Colour classes for the lines. */
  className?: string;
}

/** Blurred-text stand-ins: short rounded bars in a column. */
export function PlaceholderLines({ widths, className }: PlaceholderLinesProps) {
  return (
    <span className="flex flex-col gap-1.5">
      {widths.map((width, index) => (
        <span
          key={`${width}-${index}`}
          style={{ width: `${width}%` }}
          className={cn("block h-1 rounded-full bg-white/20", className)}
        />
      ))}
    </span>
  );
}

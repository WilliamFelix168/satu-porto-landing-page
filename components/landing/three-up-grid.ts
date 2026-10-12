/**
 * Layout shared by the feature cards and the How it works steps: three equal
 * columns from `lg`; at `md` two side by side with the last card full width
 * below; one column on phones.
 */
export const threeUpGridClassName = "grid gap-4 md:grid-cols-2 lg:grid-cols-3";

/** Item classes; the last item spans the tablet row on its own. */
export function threeUpItemClassName(index: number, count: number): string {
  return index === count - 1
    ? "min-w-0 md:col-span-2 lg:col-span-1"
    : "min-w-0";
}

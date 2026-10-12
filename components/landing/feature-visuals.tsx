import type { JSX } from "react";

import { AssetSyncVisual } from "@/components/landing/bento/asset-sync-visual";
import { ExpenseLogVisual } from "@/components/landing/bento/expense-log-visual";
import { NetWorthSplitVisual } from "@/components/landing/bento/net-worth-split-visual";
import { DecorativeVisual } from "@/components/landing/decorative-visual";
import {
  getAssetSyncDisplay,
  getExpenseLogDisplay,
  getNetWorthSplitDisplay,
} from "@/lib/card-display";
import { FeatureVisual } from "@/lib/content";

/**
 * Rendered on the server, so rupiah amounts are formatted here and reach the
 * client visuals as plain strings.
 */
const visuals: Record<FeatureVisual, () => JSX.Element> = {
  [FeatureVisual.AssetSync]: () => (
    <AssetSyncVisual display={getAssetSyncDisplay()} />
  ),
  [FeatureVisual.ExpenseCategories]: () => (
    <ExpenseLogVisual display={getExpenseLogDisplay()} />
  ),
  [FeatureVisual.NetWorthSplit]: () => (
    <NetWorthSplitVisual display={getNetWorthSplitDisplay()} />
  ),
};

interface FeatureVisualProps {
  visual: FeatureVisual;
}

/** Animated decorative mock shown at the bottom of each feature card. */
export function FeatureVisualFlourish({ visual }: FeatureVisualProps) {
  const Visual = visuals[visual];
  return (
    <DecorativeVisual>
      <Visual />
    </DecorativeVisual>
  );
}

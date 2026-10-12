"use client";

import { motion } from "motion/react";

import { changeClassName } from "@/components/landing/change-pill";
import { IconTile, IconTileSize } from "@/components/landing/icon-tile";
import { showcaseReveal } from "@/lib/ai-showcase-motion";
import { AssetClass, assetClassLabels } from "@/lib/content";
import type { DisplayAsset } from "@/lib/dashboard-display";
import { TICK_FLASH_S } from "@/lib/dashboard-motion";
import { cn } from "@/lib/utils";

const assetClassBadgeClassName: Record<AssetClass, string> = {
  [AssetClass.Crypto]: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  [AssetClass.Stock]: "border-indigo-300/20 bg-indigo-300/10 text-indigo-200",
};

interface HoldingRowProps {
  asset: DisplayAsset;
  isRevealed: boolean;
  /** Stagger delay for the reveal. */
  delayS: number;
  /**
   * Set (to the tick's frame index) when this holding just moved; the value
   * flashes once per tick. Null when it did not move.
   */
  flashKey: number | null;
  /** Direction of that move: green flash when up, red when down. */
  isFlashUp: boolean;
}

/** One holding: ticker tile, name, asset class, value and change. */
export function HoldingRow({
  asset,
  isRevealed,
  delayS,
  flashKey,
  isFlashUp,
}: HoldingRowProps) {
  return (
    <motion.li
      className="flex items-center gap-3 py-2.5"
      {...showcaseReveal(isRevealed, { delayS, hideInstantly: true })}
    >
      <IconTile
        size={IconTileSize.Small}
        className="text-2xs font-semibold text-white"
      >
        {asset.symbol}
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">
          {asset.name}
        </span>
        <span
          className={cn(
            "mt-0.5 inline-block rounded-full border px-1.5 text-2xs leading-4",
            assetClassBadgeClassName[asset.assetClass],
          )}
        >
          {assetClassLabels[asset.assetClass]}
        </span>
      </span>
      <span className="relative text-right">
        {flashKey === null ? null : (
          <motion.span
            key={flashKey}
            data-tick-flash=""
            className={cn(
              "absolute -inset-x-1.5 -inset-y-0.5 rounded-md",
              isFlashUp ? "bg-emerald-400/20" : "bg-rose-400/20",
            )}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: TICK_FLASH_S }}
          />
        )}
        <span className="relative block text-sm font-medium text-white tabular-nums">
          {asset.value}
        </span>
        <span
          className={cn(
            "relative block text-xs tabular-nums",
            changeClassName(asset.isGain),
          )}
        >
          {asset.change}
        </span>
      </span>
    </motion.li>
  );
}

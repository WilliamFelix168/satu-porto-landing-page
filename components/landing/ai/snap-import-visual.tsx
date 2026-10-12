"use client";

import { Check, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { PopCheck } from "@/components/landing/pop-check";
import { IconTile, IconTileSize } from "@/components/landing/icon-tile";
import { MockChip, MockChipTone } from "@/components/landing/mock-chip";
import { ScanBeam } from "@/components/landing/scan-beam";
import {
  msToSeconds,
  showcaseReveal,
  SNAP_IMPORT_STEP_MS,
} from "@/lib/ai-showcase-motion";
import type {
  DisplayHolding,
  SnapImportDisplay,
} from "@/lib/ai-showcase-display";
import { aiContent } from "@/lib/content";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";

const { snapImport } = aiContent;
/** One step per holding, plus a final "Imported" step. */
const STEP_COUNT = snapImport.holdings.length + 1;

function ScreenRow({ holding }: { holding: DisplayHolding }) {
  return (
    <li className="flex items-center gap-2.5 py-2">
      <IconTile
        size={IconTileSize.Small}
        className="text-2xs font-semibold text-white"
      >
        {holding.symbol}
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-white">
          {holding.name}
        </span>
        <span className="block text-2xs text-zinc-400 tabular-nums">
          {holding.quantity}
        </span>
      </span>
      <span className="shrink-0 text-xs font-medium text-white tabular-nums">
        {holding.value}
      </span>
    </li>
  );
}

/** Phone showing a broker app screen, read row by row into holdings. */
export function SnapImportVisual({ display }: { display: SnapImportDisplay }) {
  const holdings = display.holdings;
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: STEP_COUNT,
    stepMs: SNAP_IMPORT_STEP_MS,
  });
  const detectedCount = Math.min(step, holdings.length);
  const isDone = step >= STEP_COUNT;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="flex flex-col items-center gap-8 p-5 sm:flex-row sm:p-8"
    >
      {/* Phone */}
      <div className="w-60 shrink-0 rounded-4xl border border-white/15 bg-zinc-950 p-2 shadow-2xl shadow-black/60">
        <div className="overflow-clip rounded-3xl bg-gradient-to-b from-zinc-900 to-black px-3.5 pt-2.5 pb-4">
          <span className="mx-auto block h-4 w-16 rounded-full bg-black" />
          <p className="mt-3 text-2xs text-zinc-400">
            {snapImport.screenTotalLabel}
          </p>
          <p className="text-base font-semibold tracking-tight text-white tabular-nums">
            {display.totalValue}
          </p>
          <p className="mt-3 text-2xs font-medium tracking-widest text-zinc-400 uppercase">
            {snapImport.screenTitle}
          </p>
          <div className="relative">
            <ul className="divide-y divide-white/5">
              {holdings.map((holding) => (
                <ScreenRow key={holding.symbol} holding={holding} />
              ))}
            </ul>
            {isPlaying ? (
              <ScanBeam
                cycle={cycle}
                durationS={msToSeconds(holdings.length * SNAP_IMPORT_STEP_MS)}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Detected holdings */}
      <div className="w-full min-w-0 flex-1">
        <MockChip tone={isDone ? MockChipTone.Emerald : MockChipTone.Indigo}>
          {isDone ? (
            <Check className="size-3.5" />
          ) : (
            <LoaderCircle className="size-3.5 motion-safe:animate-spin" />
          )}
          {isDone
            ? snapImport.imported
            : snapImport.importing(detectedCount, holdings.length)}
        </MockChip>
        <p className="mt-5 text-xs text-zinc-400">{snapImport.detectedLabel}</p>
        <ul className="mt-2 space-y-2">
          {holdings.map((holding, index) => {
            const isDetected = index < detectedCount;
            return (
              <motion.li
                key={holding.symbol}
                {...showcaseReveal(isDetected)}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <PopCheck isShown={isDetected} />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white">
                  {holding.symbol}
                </span>
                <span className="shrink-0 text-xs text-zinc-300 tabular-nums">
                  {holding.quantity}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

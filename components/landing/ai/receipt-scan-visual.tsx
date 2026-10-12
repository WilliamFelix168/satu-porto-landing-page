"use client";

import { CircleCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { DetectedField } from "@/components/landing/ai/detected-field";
import { MockChip, MockChipTone } from "@/components/landing/mock-chip";
import { ScanBeam } from "@/components/landing/scan-beam";
import {
  msToSeconds,
  RECEIPT_SCAN_STEP_MS,
  SHOWCASE_FADE_S,
  SHOWCASE_SPRING,
  showcaseReveal,
} from "@/lib/ai-showcase-motion";
import type { ReceiptScanDisplay } from "@/lib/ai-showcase-display";
import { aiContent } from "@/lib/content";
import { useShowcaseCycle } from "@/lib/use-showcase-cycle";
import { cn } from "@/lib/utils";

const { receiptScan } = aiContent;

/** Order in which the parsed expense fills in. */
enum ReceiptStep {
  Merchant = 1,
  Date,
  Category,
  Amount,
  Toast,
}
const STEP_COUNT = ReceiptStep.Toast;
/** The beam sweeps the receipt while the four fields are read. */
const SCANNED_FIELD_STEPS = ReceiptStep.Amount;
/** Toast starts slightly smaller and springs to full size. */
const TOAST_HIDDEN_SCALE = 0.85;

function DashedDivider() {
  return <span className="my-3 block border-t border-dashed border-white/15" />;
}

interface ParsedFieldProps {
  label: string;
  isFilled: boolean;
  children: ReactNode;
  className?: string;
}

/** A label with a skeleton bar that is replaced by the parsed value. */
function ParsedField({
  label,
  isFilled,
  children,
  className,
}: ParsedFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-2xs text-zinc-400">{label}</p>
      <div className="relative mt-1 min-h-6">
        <motion.span
          className="absolute inset-y-1 left-0 w-3/4 rounded bg-white/[0.07]"
          initial={false}
          animate={{ opacity: isFilled ? 0 : 1 }}
          transition={{ duration: SHOWCASE_FADE_S }}
        />
        <motion.div {...showcaseReveal(isFilled)}>{children}</motion.div>
      </div>
    </div>
  );
}

/** A dark paper receipt being scanned into a categorized expense. */
export function ReceiptScanVisual({
  display,
}: {
  display: ReceiptScanDisplay;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { step, isPlaying, cycle } = useShowcaseCycle(ref, {
    stepCount: STEP_COUNT,
    stepMs: RECEIPT_SCAN_STEP_MS,
  });
  const reached = (target: ReceiptStep) => step >= target;
  const amount = display.total;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "flex flex-col items-center gap-8 p-5 sm:flex-row sm:items-start sm:p-8",
        // lg to xl: the split column is at its narrowest, so tighten up to
        // leave the parsed-expense card room for two columns.
        "lg:gap-6 lg:p-6 xl:gap-8 xl:p-8",
      )}
    >
      {/* Receipt */}
      <div className="relative w-full max-w-60 min-w-0 shrink-0 sm:w-60 lg:w-52 xl:w-60">
        <div className="relative overflow-clip rounded-t-xl border border-white/5 bg-zinc-900 px-4 pt-4 torn-edge-bottom shadow-2xl shadow-black/60">
          <DetectedField
            isDetected={reached(ReceiptStep.Merchant)}
            isPulsing={isPlaying}
          >
            <p className="truncate text-sm font-semibold text-white">
              {receiptScan.merchant}
            </p>
            <p className="truncate text-2xs text-zinc-400">
              {receiptScan.branch}
            </p>
          </DetectedField>
          <DetectedField
            isDetected={reached(ReceiptStep.Date)}
            isPulsing={isPlaying}
            className="mt-2 w-fit"
          >
            <p className="text-2xs text-zinc-300">{receiptScan.date}</p>
          </DetectedField>

          <DashedDivider />
          <ul className="space-y-1.5">
            {display.items.map((item) => (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-3 text-xs"
              >
                <span className="min-w-0 truncate text-zinc-300">
                  {item.name}
                </span>
                <span className="shrink-0 text-zinc-200 tabular-nums">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
          <DashedDivider />

          <DetectedField
            isDetected={reached(ReceiptStep.Amount)}
            isPulsing={isPlaying}
          >
            <p className="flex items-baseline justify-between gap-3 text-sm font-semibold text-white">
              <span className="min-w-0 truncate">{receiptScan.totalLabel}</span>
              <span className="shrink-0 tabular-nums">{amount}</span>
            </p>
          </DetectedField>

          {isPlaying ? (
            <ScanBeam
              cycle={cycle}
              durationS={msToSeconds(
                SCANNED_FIELD_STEPS * RECEIPT_SCAN_STEP_MS,
              )}
            />
          ) : null}
        </div>
      </div>

      {/* Parsed expense */}
      <div className="w-full min-w-0 flex-1">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="flex items-center gap-2 text-xs font-medium text-zinc-200">
            <Sparkles className="size-3.5 text-emerald-300" />
            {receiptScan.parsedTitle}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <ParsedField
              label={receiptScan.fieldLabels.merchant}
              isFilled={reached(ReceiptStep.Merchant)}
              className="col-span-2"
            >
              <p className="truncate text-sm text-white">
                {receiptScan.merchant}
              </p>
            </ParsedField>
            <ParsedField
              label={receiptScan.fieldLabels.date}
              isFilled={reached(ReceiptStep.Date)}
            >
              <p className="truncate text-sm text-white">{receiptScan.date}</p>
            </ParsedField>
            <ParsedField
              label={receiptScan.fieldLabels.category}
              isFilled={reached(ReceiptStep.Category)}
            >
              <MockChip tone={MockChipTone.Emerald} className="py-0.5">
                {receiptScan.category}
              </MockChip>
            </ParsedField>
            <ParsedField
              label={receiptScan.fieldLabels.amount}
              isFilled={reached(ReceiptStep.Amount)}
              className="col-span-2 border-t border-white/10 pt-3"
            >
              <p className="truncate text-xl font-semibold tracking-tight text-white tabular-nums">
                {amount}
              </p>
            </ParsedField>
          </div>
        </div>

        <motion.div
          className="mt-3 flex justify-end"
          initial={false}
          animate={{
            opacity: reached(ReceiptStep.Toast) ? 1 : 0,
            scale: reached(ReceiptStep.Toast) ? 1 : TOAST_HIDDEN_SCALE,
          }}
          transition={SHOWCASE_SPRING}
        >
          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-100 shadow-glow-emerald-soft">
            <CircleCheck className="size-4 text-emerald-300" />
            {receiptScan.toast}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";

import { chatBubbleClassName } from "@/components/landing/chat-bubble";

import {
  TYPING_DOT_BOUNCE_PX,
  TYPING_DOT_CYCLE_S,
  TYPING_DOT_STAGGER_S,
} from "@/lib/ai-showcase-motion";
import { cn } from "@/lib/utils";

/** Number of dots in the indicator. */
const DOT_COUNT = 3;
const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => index);

/** Chat-style "typing…" indicator: three dots bouncing in turn. */
export function TypingDots() {
  return (
    <span
      className={cn(chatBubbleClassName, "inline-flex h-10 items-center gap-1")}
    >
      {DOTS.map((index) => (
        <motion.span
          key={index}
          className="size-1.5 rounded-full bg-zinc-300"
          animate={{ y: [0, -TYPING_DOT_BOUNCE_PX, 0] }}
          transition={{
            duration: TYPING_DOT_CYCLE_S,
            repeat: Infinity,
            delay: index * TYPING_DOT_STAGGER_S,
          }}
        />
      ))}
    </span>
  );
}

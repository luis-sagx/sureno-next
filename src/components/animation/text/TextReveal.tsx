"use client";

/**
 * TextReveal — the house wrapper around `spring-text-engine`.
 *
 * All animated text goes through here (or through TextEngine directly), never
 * through custom letter-span splitters. Two variants:
 *
 * - `"lines"`  — each line clips up into place behind a mask. Headings.
 * - `"words"`  — every word settles in independently. Short lead-ins, quotes.
 *
 * Two engine rules are baked in so call sites cannot trip over them:
 * the container is a wrapping flex row (so `justify-*` is always paired with
 * `text-*`), and `overflow` clips to the line-height box (so a leading floor
 * of 1.15 is applied unless the caller sets its own). Never `mode="manual"` —
 * only the declarative modes are accepted by the prop type.
 */

import TextEngine from "spring-text-engine";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/springs/presets";
import type { CSSProperties, ReactNode } from "react";

type TextRevealTag = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "blockquote";
type TextRevealMode = "once" | "forward" | "always";
type TextRevealAlign = "left" | "center" | "right";

const ALIGN: Record<TextRevealAlign, string> = {
  left: "text-left justify-start",
  center: "text-center justify-center",
  right: "text-right justify-end",
};

interface TextRevealProps {
  children: ReactNode;
  tag?: TextRevealTag;
  variant?: "lines" | "words";
  mode?: TextRevealMode;
  align?: TextRevealAlign;
  className?: string;
  style?: CSSProperties;
  /** ms between each line / word. */
  stagger?: number;
  /** ms before the reveal starts. */
  delay?: number;
}

export function TextReveal({
  children,
  tag = "div",
  variant = "lines",
  mode = "once",
  align = "left",
  className,
  style,
  stagger,
  delay,
}: TextRevealProps) {
  // Leading floor for clipped reveals; the caller's own leading-* wins.
  const leading = /(^|\s|:)leading-/.test(className ?? "") ? undefined : "leading-[1.15]";

  const motion =
    variant === "lines"
      ? {
          overflow: true,
          lineIn: { y: "0%", opacity: 1 },
          lineOut: { y: "112%", opacity: 0 },
          lineConfig: SPRING.entrance,
          lineStagger: stagger ?? 110,
        }
      : {
          overflow: true,
          wordIn: { y: 0, opacity: 1 },
          wordOut: { y: 26, opacity: 0 },
          wordConfig: SPRING.entrance,
          wordStagger: stagger ?? 38,
        };

  return (
    <TextEngine
      tag={tag}
      mode={mode}
      className={cn(ALIGN[align], leading, className)}
      style={style}
      delayIn={delay}
      {...motion}
    >
      {children}
    </TextEngine>
  );
}

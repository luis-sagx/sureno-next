import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** Draws a short gold rule before the label. */
  rule?: boolean;
  className?: string;
}

/**
 * The house eyebrow: a small uppercase label in gold, optionally opened by a
 * short rule. Marks the top of a section so headings never float unanchored.
 */
export function Eyebrow({ children, rule = false, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-label text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-secondary",
        className,
      )}
    >
      {rule && (
        <span
          aria-hidden="true"
          className="h-px w-7 shrink-0 bg-gradient-to-r from-transparent to-line-strong"
        />
      )}
      {children}
    </span>
  );
}

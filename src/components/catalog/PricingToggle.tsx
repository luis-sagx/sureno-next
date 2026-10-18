"use client";

import { cn } from "@/lib/utils";

interface PricingToggleProps {
  value: "retail" | "wholesale";
  onChange: (value: "retail" | "wholesale") => void;
  className?: string;
}

const OPTIONS = [
  { value: "retail", label: "Individual" },
  { value: "wholesale", label: "Mayoreo" },
] as const;

/**
 * Segmented control inside a single hairline frame — the selected segment
 * takes the gold plate, the other stays quiet until hovered.
 */
export function PricingToggle({
  value,
  onChange,
  className,
}: PricingToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tipo de precio"
      className={cn(
        "inline-flex items-stretch rounded border border-line bg-surface-container/60 p-0.5",
        className
      )}
    >
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded-sm px-4 py-2 font-label text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
              "transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
              active
                ? "bg-secondary text-on-secondary shadow-[inset_0_1px_0_var(--theme-inner-light)]"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

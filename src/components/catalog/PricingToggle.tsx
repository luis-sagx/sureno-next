"use client";

import { cn } from "@/lib/utils";

interface PricingToggleProps {
  value: "retail" | "wholesale";
  onChange: (value: "retail" | "wholesale") => void;
  className?: string;
}

export function PricingToggle({
  value,
  onChange,
  className,
}: PricingToggleProps) {
  return (
    <div className={cn("inline-flex rounded-md overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => onChange("retail")}
        className={cn(
          "px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
          value === "retail"
            ? "bg-secondary text-on-secondary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        )}
      >
        Individual
      </button>
      <button
        type="button"
        onClick={() => onChange("wholesale")}
        className={cn(
          "px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
          value === "wholesale"
            ? "bg-secondary text-on-secondary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        )}
      >
        Mayoreo
      </button>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * Wholesale-grade stepper: one hairline frame, three cells, large touch
 * targets — no nested boxes.
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  className,
}: QuantitySelectorProps) {
  function decrement() {
    if (value > min) onChange(Math.max(min, value - step));
  }

  function increment() {
    if (value < max) onChange(Math.min(max, value + step));
  }

  const decDisabled = value <= min;
  const incDisabled = value >= max;

  const buttonStyles = cn(
    "flex h-11 w-11 items-center justify-center text-on-surface-variant",
    "transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
    "hover:bg-surface-container-high hover:text-secondary",
    "disabled:pointer-events-none disabled:opacity-35"
  );

  return (
    <div
      className={cn(
        "inline-flex items-stretch divide-x divide-line overflow-hidden rounded border border-line bg-surface-container",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={decDisabled}
        className={buttonStyles}
        aria-label="Reducir cantidad"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className="grid h-11 min-w-14 place-items-center px-3 font-semibold text-sm text-on-surface tnum"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={incDisabled}
        className={buttonStyles}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

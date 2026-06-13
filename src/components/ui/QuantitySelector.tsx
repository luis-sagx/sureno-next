"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (value < max) onChange(value + 1);
  }

  const decDisabled = value <= min;
  const incDisabled = value >= max;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={decDisabled}
        className={cn(
          "w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label="Reducir cantidad"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 h-10 flex items-center justify-center bg-surface-container-high text-on-surface font-medium text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={incDisabled}
        className={cn(
          "w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

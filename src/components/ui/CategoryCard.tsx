import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Editorial category tile: icon, label, and a gold rule that lengthens on
 * hover / selection — no filled box in the resting state.
 */
export function CategoryCard({
  icon: Icon,
  label,
  selected = false,
  onClick,
  className,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full w-full min-h-28 flex-col items-center justify-center gap-3 rounded px-4 py-5",
        "transition-colors duration-[var(--theme-duration-normal)] ease-entrance",
        selected
          ? "bg-secondary/8 text-on-surface"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        className
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-colors duration-[var(--theme-duration-normal)] ease-entrance",
          selected
            ? "text-secondary"
            : "text-secondary/60 group-hover:text-secondary"
        )}
      />
      <span className="text-balance text-center text-sm leading-snug">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "h-px transition-all duration-[var(--theme-duration-normal)] ease-entrance",
          selected
            ? "w-10 bg-secondary"
            : "w-6 bg-line-strong group-hover:w-10 group-hover:bg-secondary"
        )}
      />
    </button>
  );
}

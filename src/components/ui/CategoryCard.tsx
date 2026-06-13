import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({
  icon: Icon,
  label,
  selected = false,
  onClick,
  className,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200",
        "bg-surface-container hover:bg-surface-container-high",
        "border-2 border-transparent",
        selected && "border-secondary bg-surface-container-high",
        className
      )}
    >
      <Icon
        className={cn(
          "w-6 h-6",
          selected ? "text-secondary" : "text-on-surface-variant"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium text-center",
          selected ? "text-on-surface" : "text-on-surface-variant"
        )}
      >
        {label}
      </span>
    </button>
  );
}

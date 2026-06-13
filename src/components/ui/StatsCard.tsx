import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container rounded-lg p-6 space-y-3",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <Icon className="w-5 h-5 text-secondary" />
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-medium",
              trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="font-headline text-3xl text-on-surface">{value}</p>
        <p className="text-sm text-on-surface-variant mt-1">{label}</p>
      </div>
    </div>
  );
}

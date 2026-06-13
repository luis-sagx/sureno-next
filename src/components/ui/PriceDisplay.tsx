import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  retailPrice: number;
  wholesalePrice?: number | null;
  showSavings?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  retailPrice,
  wholesalePrice,
  showSavings = true,
  size = "md",
  className,
}: PriceDisplayProps) {
  const sizeStyles = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const hasWholesale = wholesalePrice != null && wholesalePrice > 0;

  return (
    <div className={cn("space-y-1", className)}>
      <span
        className={cn(
          "font-headline font-semibold text-on-surface",
          sizeStyles[size]
        )}
      >
        {formatCurrency(retailPrice)}
      </span>

      {hasWholesale && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-on-surface-variant line-through">
            {formatCurrency(retailPrice)}
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Mayoreo: {formatCurrency(wholesalePrice)}
          </span>
        </div>
      )}

      {hasWholesale && showSavings && (
        <span className="text-xs text-green-600 dark:text-green-400 font-medium block">
          AHORRAS {formatCurrency(retailPrice - wholesalePrice)}
        </span>
      )}
    </div>
  );
}

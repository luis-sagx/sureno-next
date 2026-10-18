import { formatCurrency, cn } from "@/lib/utils";

interface PriceDisplayProps {
  retailPrice: number;
  wholesalePrice?: number | null;
  showSavings?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Editorial price block: the figure set in the serif with tabular numerals
 * (so rows of prices align), the wholesale line underneath in gold.
 */
export function PriceDisplay({
  retailPrice,
  wholesalePrice,
  showSavings = true,
  size = "md",
  className,
}: PriceDisplayProps) {
  const sizeStyles = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const hasWholesale = wholesalePrice != null && wholesalePrice > 0;

  return (
    <div className={cn("space-y-1", className)}>
      <span
        className={cn(
          "block font-headline font-semibold leading-none tracking-tight text-on-surface tnum",
          sizeStyles[size]
        )}
      >
        {formatCurrency(retailPrice)}
      </span>

      {hasWholesale && (
        <span className="block text-xs text-on-surface-variant">
          Mayoreo:{" "}
          <span className="font-medium text-secondary tnum">
            {formatCurrency(wholesalePrice)}
          </span>
        </span>
      )}

      {hasWholesale && showSavings && (
        <span className="block font-label text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-secondary">
          Ahorras{" "}
          <span className="tnum">
            {formatCurrency(retailPrice - wholesalePrice)}
          </span>
        </span>
      )}
    </div>
  );
}

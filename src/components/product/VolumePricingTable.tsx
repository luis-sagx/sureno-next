"use client";

import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { WholesaleTier } from "@prisma/client";
import { Crown } from "lucide-react";

interface VolumePricingTableProps {
  tiers: WholesaleTier[];
  retailPrice: number;
  className?: string;
}

export function VolumePricingTable({
  tiers,
  retailPrice,
  className,
}: VolumePricingTableProps) {
  if (!tiers.length) return null;

  // Find best value tier (lowest pricePerUnit)
  const sorted = [...tiers].sort(
    (a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit)
  );
  const bestTierId = sorted[0]?.id;

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-headline text-lg text-on-surface mb-4">
        Precios por Volumen
      </h3>
      <div className="space-y-2">
        {tiers.map((tier) => {
          const isBest = tier.id === bestTierId;
          const pricePerUnit = Number(tier.pricePerUnit);
          const savings = retailPrice - pricePerUnit;
          const savingsPercent = Math.round((savings / retailPrice) * 100);

          return (
            <div
              key={tier.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                isBest
                  ? "border-secondary bg-secondary/5"
                  : "border-outline-variant bg-surface-container"
              )}
            >
              <div className="flex items-center gap-3">
                {isBest && (
                  <Crown className="w-5 h-5 text-secondary flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {tier.label || `${tier.minQty}+ unids`}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {tier.maxQty
                      ? `${tier.minQty}–${tier.maxQty} unidades`
                      : `${tier.minQty}+ unidades`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-headline text-lg",
                    isBest ? "text-secondary" : "text-on-surface"
                  )}
                >
                  {formatPrice(pricePerUnit)}
                </p>
                {savings > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    AHORRAS {savingsPercent}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { WholesaleTier } from "../../generated/prisma/client";

interface VolumePricingTableProps {
  tiers: WholesaleTier[];
  retailPrice: number;
  className?: string;
}

/**
 * Volume ladder as a hairline table: units, price per unit, savings. The best
 * tier is marked with the house gold diamond instead of a filled row.
 */
export function VolumePricingTable({
  tiers,
  retailPrice,
  className,
}: VolumePricingTableProps) {
  if (!tiers.length) return null;

  const sorted = [...tiers].sort(
    (a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit)
  );
  const bestTierId = sorted[0]?.id;
  const markBest = tiers.length > 1;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-[1.4fr_1fr_auto] items-baseline gap-4 border-b border-line pb-3">
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Volumen
        </span>
        <span className="text-right font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Precio c/u
        </span>
        <span className="w-20 text-right font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant sm:w-24">
          Ahorro
        </span>
      </div>

      <ul className="divide-y divide-line">
        {tiers.map((tier) => {
          const isBest = markBest && tier.id === bestTierId;
          const pricePerUnit = Number(tier.pricePerUnit);
          const savings = retailPrice - pricePerUnit;
          const savingsPercent =
            retailPrice > 0 ? Math.round((savings / retailPrice) * 100) : 0;
          const range = tier.maxQty
            ? `${tier.minQty}–${tier.maxQty} unidades`
            : `${tier.minQty}+ unidades`;
          // The stored label sometimes repeats the range; only show it when it
          // adds information beyond it (e.g. names the channel). Compare on
          // letters and digits only — dash style and spacing differ.
          const plain = (value: string) =>
            value.toLowerCase().replace(/[^a-z0-9]/g, "");
          const extraLabel =
            tier.label &&
            plain(tier.label) !== plain(range) &&
            !plain(tier.label).startsWith(plain(range))
              ? tier.label
              : null;

          return (
            <li
              key={tier.id}
              className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-4 py-4"
            >
              <span className="flex items-center gap-3">
                {isBest && (
                  <span
                    aria-label="Mejor precio"
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-secondary"
                  />
                )}
                <span className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "font-headline text-lg leading-tight tnum",
                      isBest ? "text-secondary" : "text-on-surface"
                    )}
                  >
                    {range}
                  </span>
                  {extraLabel && (
                    <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                      {extraLabel}
                    </span>
                  )}
                </span>
              </span>

              <span
                className={cn(
                  "text-right font-headline text-xl tnum",
                  isBest ? "text-secondary" : "text-on-surface"
                )}
              >
                {formatPrice(pricePerUnit)}
              </span>

              <span className="w-20 text-right font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-on-surface-variant tnum sm:w-24">
                {savings > 0 ? `Ahorras ${savingsPercent}%` : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

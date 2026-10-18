"use client";

import { PricingToggle } from "@/components/catalog/PricingToggle";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { CAJA_SIZE, formatPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { Package, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface TierInfo {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

interface PurchasePanelProps {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantLabel: string;
  imageUrl: string | null;
  retailPrice: number;
  tiers: TierInfo[];
  minOrder?: number;
  stockStatus?: string;
  className?: string;
  mode?: "retail" | "wholesale";
  onModeChange?: (mode: "retail" | "wholesale") => void;
}

const stockConfig: Record<string, { label: string; dot: string; text: string }> = {
  HIGH: { label: "Stock alto", dot: "bg-secondary", text: "text-secondary" },
  MEDIUM: { label: "Stock medio", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  LOW: { label: "Stock bajo", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  OUT: { label: "Agotado", dot: "bg-red-500", text: "text-red-600 dark:text-red-400 line-through" },
};

function bestTierPrice(tiers: TierInfo[], units: number): number | null {
  const applicable = tiers.filter((t) => units >= t.minQty);
  if (applicable.length === 0) return null;
  return Math.min(...applicable.map((t) => t.pricePerUnit));
}

/**
 * The purchase block: mode switch, quantity, the applied-price note (a gold
 * hairline, never a filled box), the running total and the single CTA.
 */
export function PurchasePanel({
  variantId,
  productId,
  productName,
  productSlug,
  variantLabel,
  imageUrl,
  retailPrice,
  tiers,
  minOrder = 1,
  stockStatus = "HIGH",
  className,
  mode: controlledMode,
  onModeChange,
}: PurchasePanelProps) {
  const [internalMode, setInternalMode] = useState<"retail" | "wholesale">("retail");
  const [retailQty, setRetailQty] = useState(Math.max(minOrder, 1));
  const [boxes, setBoxes] = useState(1);

  const mode = controlledMode ?? internalMode;
  const setMode = onModeChange ?? setInternalMode;

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const hasTiers = tiers.length > 0;
  const isWholesale = mode === "wholesale" && hasTiers;
  const units = isWholesale ? boxes * CAJA_SIZE : retailQty;
  const autoWholesale = !isWholesale && hasTiers && retailQty >= CAJA_SIZE;
  const unitPrice = isWholesale
    ? bestTierPrice(tiers, units) ?? retailPrice
    : autoWholesale
    ? bestTierPrice(tiers, retailQty) ?? retailPrice
    : retailPrice;
  const savings =
    (isWholesale || autoWholesale) && unitPrice < retailPrice
      ? Math.round((1 - unitPrice / retailPrice) * 100)
      : 0;
  const isOut = stockStatus === "OUT";
  const stock = stockConfig[stockStatus] || stockConfig.HIGH;

  const handleAdd = () => {
    addItem({
      variantId,
      productId,
      productName,
      productSlug,
      variantLabel,
      imageUrl,
      unitPrice,
      type: isWholesale || autoWholesale ? "WHOLESALE" : "RETAIL",
      quantity: units,
    });
    openCart();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {hasTiers && <PricingToggle className="self-start" value={mode} onChange={setMode} />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          {isWholesale ? "Cajas (12 unidades c/u)" : "Cantidad"}
        </span>
        {isWholesale ? (
          <QuantitySelector value={boxes} onChange={setBoxes} min={1} max={40} />
        ) : (
          <QuantitySelector
            value={retailQty}
            onChange={setRetailQty}
            min={Math.max(minOrder, 1)}
            max={99}
          />
        )}
      </div>

      {(autoWholesale || isWholesale) && (
        <div className="flex gap-3 border-l border-secondary/60 pl-4">
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-on-surface tnum">
              {isWholesale
                ? `${boxes} ${boxes === 1 ? "caja" : "cajas"} · ${units} unidades · ${formatPrice(unitPrice)} c/u`
                : `Precio mayorista aplicado · ${retailQty} unidades · ${formatPrice(unitPrice)} c/u`}
            </span>
            {savings > 0 && (
              <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-secondary tnum">
                Ahorras {savings}%
              </span>
            )}
            {isWholesale && (
              <span className="text-xs text-on-surface-variant">
                Cada incremento agrega una caja completa de {CAJA_SIZE} unidades.
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Total
        </span>
        <span className="font-headline text-3xl leading-none text-on-surface tnum">
          {formatPrice(unitPrice * units)}
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleAdd}
        disabled={isOut}
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        Agregar al carrito
      </Button>

      <div className="flex items-center justify-center gap-2">
        <span
          aria-hidden="true"
          className={cn("inline-block h-1.5 w-1.5 rotate-45", stock.dot)}
        />
        <span
          className={cn(
            "font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em]",
            stock.text
          )}
        >
          {stock.label}
        </span>
      </div>
    </div>
  );
}

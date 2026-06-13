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
}

const stockConfig: Record<string, { label: string; dot: string; text: string }> = {
  HIGH: { label: "Stock Alto", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  MEDIUM: { label: "Stock Medio", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  LOW: { label: "Stock Bajo", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  OUT: { label: "Agotado", dot: "bg-red-500", text: "text-red-600 dark:text-red-400 line-through" },
};

function bestTierPrice(tiers: TierInfo[], units: number): number | null {
  const applicable = tiers.filter((t) => units >= t.minQty);
  if (applicable.length === 0) return null;
  return Math.min(...applicable.map((t) => t.pricePerUnit));
}

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
}: PurchasePanelProps) {
  const [mode, setMode] = useState<"retail" | "wholesale">("retail");
  const [retailQty, setRetailQty] = useState(Math.max(minOrder, 1));
  const [boxes, setBoxes] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const hasTiers = tiers.length > 0;
  const isWholesale = mode === "wholesale" && hasTiers;
  const units = isWholesale ? boxes * CAJA_SIZE : retailQty;
  const unitPrice = isWholesale
    ? bestTierPrice(tiers, units) ?? retailPrice
    : retailPrice;
  const savings =
    isWholesale && unitPrice < retailPrice
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
      type: isWholesale ? "WHOLESALE" : "RETAIL",
      quantity: units,
    });
    openCart();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {hasTiers && <PricingToggle value={mode} onChange={setMode} />}

      <div className="flex items-center gap-4">
        <span className="text-sm text-on-surface-variant">
          {isWholesale ? "Cajas (12 unidades c/u):" : "Cantidad:"}
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

      {isWholesale && (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Package className="w-4 h-4 text-secondary" />
          <span>
            {units} unidades · {formatPrice(unitPrice)} c/u
            {savings > 0 && (
              <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                AHORRAS {savings}%
              </span>
            )}
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between border-t border-outline-variant pt-3">
        <span className="text-sm text-on-surface-variant">Total</span>
        <span className="font-headline text-2xl text-on-surface tabular-nums">
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
        <ShoppingCart className="w-5 h-5 mr-2" />
        Agregar al Carrito
      </Button>

      <div className="flex items-center justify-center gap-2">
        <span className={cn("inline-block w-2 h-2 rounded-full", stock.dot)} />
        <span className={cn("text-sm font-medium", stock.text)}>{stock.label}</span>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AddToCartSectionProps {
  variantId?: string;
  productId?: string;
  productName?: string;
  productSlug?: string;
  variantLabel?: string;
  imageUrl?: string | null;
  unitPrice?: number;
  type?: "RETAIL" | "WHOLESALE";
  minOrder?: number;
  stockStatus?: string;
  className?: string;
}

const stockConfig: Record<string, { label: string; className: string }> = {
  HIGH: {
    label: "Stock Alto",
    className: "text-green-600 dark:text-green-400",
  },
  MEDIUM: {
    label: "Stock Medio",
    className: "text-amber-600 dark:text-amber-400",
  },
  LOW: {
    label: "Stock Bajo",
    className: "text-red-600 dark:text-red-400",
  },
  OUT: {
    label: "Agotado",
    className: "text-red-600 dark:text-red-400 line-through",
  },
};

export function AddToCartSection({
  variantId,
  productId,
  productName,
  productSlug,
  variantLabel,
  imageUrl,
  unitPrice,
  type = "RETAIL",
  minOrder = 1,
  stockStatus = "HIGH",
  className,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(minOrder);
  const stock = stockConfig[stockStatus] || stockConfig.HIGH;
  const isOut = stockStatus === "OUT";
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (variantId && productId && productName && productSlug && variantLabel && unitPrice) {
      addItem({
        variantId,
        productId,
        productName,
        productSlug,
        variantLabel,
        unitPrice,
        type,
        imageUrl: imageUrl || null,
        quantity,
      });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-on-surface-variant">Cantidad:</span>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={minOrder}
          max={99}
        />
      </div>

      {/* Add to cart button */}
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

      {/* Min order notice */}
      <p className="text-xs text-on-surface-variant text-center">
        Mín. {minOrder} {minOrder === 1 ? "unidad" : "unidades"}
      </p>

      {/* Stock status */}
      <div className="flex items-center justify-center gap-2">
        <span
          className={cn(
            "inline-block w-2 h-2 rounded-full",
            stockStatus === "HIGH"
              ? "bg-green-500"
              : stockStatus === "MEDIUM"
                ? "bg-amber-500"
                : "bg-red-500"
          )}
        />
        <span className={cn("text-sm font-medium", stock.className)}>
          {stock.label}
        </span>
      </div>
    </div>
  );
}

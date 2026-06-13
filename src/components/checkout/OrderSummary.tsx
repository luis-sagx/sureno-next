"use client";

import { formatPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface OrderSummaryProps {
  className?: string;
}

const SHIPPING_COST = 1200;

export function OrderSummary({ className }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items);
  const retailSubtotal = useCartStore((s) => s.retailSubtotal());
  const wholesaleSubtotal = useCartStore((s) => s.wholesaleSubtotal());
  const removeItem = useCartStore((s) => s.removeItem);

  const totalOrder = retailSubtotal + wholesaleSubtotal + SHIPPING_COST;

  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 space-y-4", className)}>
        <ShoppingBag className="w-16 h-16 text-on-surface-variant/30" />
        <p className="text-on-surface-variant text-center text-lg">
          No hay productos en el carrito
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="font-headline text-lg text-on-surface">
        Resumen del Pedido
      </h3>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center justify-between py-2 border-b border-outline-variant/50 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">
                {item.productName}
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.variantLabel} × {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <span className="text-sm font-medium text-on-surface tabular-nums">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
              <button
                onClick={() => removeItem(item.variantId, item.type)}
                className="text-xs text-on-surface-variant hover:text-error transition-colors"
                aria-label={`Eliminar ${item.productName}`}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotals breakdown */}
      <div className="space-y-2 text-sm border-t border-outline-variant pt-4">
        {retailSubtotal > 0 && (
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal Retail</span>
            <span className="tabular-nums">{formatPrice(retailSubtotal)}</span>
          </div>
        )}

        {wholesaleSubtotal > 0 && (
          <div className="flex justify-between">
            <span className="text-on-surface-variant">
              Subtotal Mayoreo{" "}
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                (AHORRAS{" "}
                {formatPrice(
                  items
                    .filter((i) => i.type === "WHOLESALE")
                    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) *
                    0.15
                )}
                )
              </span>
            </span>
            <span className="tabular-nums">
              {formatPrice(wholesaleSubtotal)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-on-surface-variant">
          <span>Envío Estimado</span>
          <span className="tabular-nums">{formatPrice(SHIPPING_COST)}</span>
        </div>

        <div className="flex justify-between text-on-surface text-lg font-semibold pt-2 border-t border-outline-variant">
          <span>Total del Pedido</span>
          <span className="tabular-nums">{formatPrice(totalOrder)}</span>
        </div>
      </div>
    </div>
  );
}

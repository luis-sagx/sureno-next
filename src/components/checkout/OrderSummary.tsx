"use client";

import { formatPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { ShoppingBag, X } from "lucide-react";

interface OrderSummaryProps {
  className?: string;
}

const SHIPPING_COST = 1200;

/**
 * Receipt-style summary: hairline-divided lines, tabular figures and the
 * total set in the serif. Wholesale quantities are spelled out in units so
 * the caja math is never hidden behind a subtotal.
 */
export function OrderSummary({ className }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items);
  const retailSubtotal = useCartStore((s) => s.retailSubtotal());
  const wholesaleSubtotal = useCartStore((s) => s.wholesaleSubtotal());
  const removeItem = useCartStore((s) => s.removeItem);

  const totalOrder = retailSubtotal + wholesaleSubtotal + SHIPPING_COST;
  const wholesaleUnits = items
    .filter((item) => item.type === "WHOLESALE")
    .reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-12 text-center",
          className
        )}
      >
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-line text-secondary">
          <span
            aria-hidden="true"
            className="absolute inset-[-5px] rounded-full border border-line-strong/40"
          />
          <ShoppingBag className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-on-surface-variant">No hay productos en el carrito</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h2 className="font-headline text-xl text-on-surface">
        Resumen del pedido
      </h2>

      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li
            key={`${item.variantId}-${item.type}`}
            className="flex items-start justify-between gap-4 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-on-surface">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant tnum">
                {item.variantLabel} × {item.quantity}
                {item.type === "WHOLESALE" ? " · mayoreo" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm text-on-surface tnum">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.variantId, item.type)}
                className="text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-error"
                aria-label={`Eliminar ${item.productName}`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 text-sm">
        {retailSubtotal > 0 && (
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal individual</span>
            <span className="tnum">{formatPrice(retailSubtotal)}</span>
          </div>
        )}

        {wholesaleSubtotal > 0 && (
          <div className="flex justify-between text-on-surface-variant">
            <span>
              Subtotal mayoreo
              <span className="ml-2 text-xs tnum">({wholesaleUnits} unidades)</span>
            </span>
            <span className="tnum">{formatPrice(wholesaleSubtotal)}</span>
          </div>
        )}

        <div className="flex justify-between text-on-surface-variant">
          <span>Envío estimado</span>
          <span className="tnum">{formatPrice(SHIPPING_COST)}</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Total del pedido
        </span>
        <span className="font-headline text-3xl leading-none text-on-surface tnum">
          {formatPrice(totalOrder)}
        </span>
      </div>
    </div>
  );
}

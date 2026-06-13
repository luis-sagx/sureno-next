"use client";

import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { CAJA_SIZE, formatPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore((s) => s.totalItems());
  const retailSubtotal = useCartStore((s) => s.retailSubtotal());
  const wholesaleSubtotal = useCartStore((s) => s.wholesaleSubtotal());

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[rgba(20,14,10,0.72)] backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        data-testid="cart-backdrop"
      />

      {/* Drawer */}
      <div
        className={cn(
            "fixed top-0 right-0 z-50 flex h-full w-96 max-w-[100vw] flex-col border-l border-outline-variant/60 bg-surface shadow-2xl",
            "animate-in slide-in-from-right"
          )}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-headline text-xl text-on-surface">
            Tu Carrito
          </h2>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-4">
            <ShoppingBag className="w-16 h-16 text-on-surface-variant/30" />
            <p className="text-on-surface-variant text-center text-lg">
              Tu carrito está vacío
            </p>
            <Link
              href="/catalog"
              onClick={closeCart}
              className="text-secondary hover:text-secondary/80 text-sm font-medium underline underline-offset-2"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.variantId}-${item.type}`}
                  className="flex gap-3 py-3 border-b border-outline-variant/50 last:border-0"
                >
                  {/* Image placeholder */}
                  <div className="w-16 h-16 rounded-md bg-surface-container flex-shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="font-headline text-xl text-on-surface-variant/30 italic">
                        {item.productName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Item details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.variantLabel}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <QuantitySelector
                        value={item.type === "WHOLESALE" ? Math.max(1, item.quantity / CAJA_SIZE) : item.quantity}
                        onChange={(qty) =>
                          updateQuantity(
                            item.variantId,
                            item.type,
                            item.type === "WHOLESALE" ? qty * CAJA_SIZE : qty,
                          )
                        }
                        min={0}
                        max={99}
                      />
                      <span className="text-sm font-medium text-on-surface tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-1 space-y-1">
                      {item.type === "WHOLESALE" && (
                        <p className="text-[11px] text-on-surface-variant">
                          {item.quantity / CAJA_SIZE} caja(s) · {item.quantity} unidades
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                            item.type === "RETAIL"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
                          )}
                        >
                          {item.type === "RETAIL" ? "Retail" : "Mayoreo"}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId, item.type)}
                          className="text-xs text-on-surface-variant transition-colors hover:text-error"
                          aria-label={`Eliminar ${item.productName}`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-outline-variant px-6 py-4 space-y-3">
              <div className="space-y-1 text-sm">
                {retailSubtotal > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal Retail</span>
                    <span className="tabular-nums">
                      {formatPrice(retailSubtotal)}
                    </span>
                  </div>
                )}
                {wholesaleSubtotal > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal Mayoreo (cajas de 12)</span>
                    <span className="tabular-nums">
                      {formatPrice(wholesaleSubtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface font-semibold pt-1">
                  <span>Total ({totalItems} unidades)</span>
                  <span className="tabular-nums text-lg">
                    {formatPrice(retailSubtotal + wholesaleSubtotal)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Entregas coordinadas en Ecuador según ciudad y disponibilidad.
                </p>
              </div>

              <Link href="/checkout" onClick={closeCart} className="block">
                <Button variant="primary" size="lg" className="w-full">
                  Ir al Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

"use client";

import { Spring } from "@/components/animation/springs";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { CAJA_SIZE, formatPrice } from "@/lib/pricing";
import { SPRING } from "@/lib/springs/presets";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
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
      <Spring
        mode="once"
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={SPRING.crossfade}
        className="fixed inset-0 z-50 bg-[var(--theme-scrim)] backdrop-blur-sm"
        onClick={closeCart}
        data-testid="cart-backdrop"
      />

      {/* Drawer */}
      <Spring
        mode="once"
        from={{ x: "100%" }}
        to={{ x: "0%" }}
        config={SPRING.gentle}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-surface shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-line px-6">
          <h2 className="font-headline text-xl text-on-surface">Tu Carrito</h2>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:bg-surface-container hover:text-on-surface"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-secondary">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <p className="text-center font-headline text-lg text-on-surface-variant">
              Tu carrito está vacío
            </p>
            <Link
              href="/catalog"
              onClick={closeCart}
              className="text-sm font-medium text-secondary underline decoration-line-strong underline-offset-4 transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:decoration-secondary"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <div
                  key={`${item.variantId}-${item.type}`}
                  className="flex gap-4 py-5"
                >
                  {/* Thumbnail */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-line bg-surface-container">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-headline text-xl italic text-on-surface-variant/30">
                        {item.productName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Item details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {item.productName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.variantLabel}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <QuantitySelector
                        value={
                          item.type === "WHOLESALE"
                            ? Math.max(1, item.quantity / CAJA_SIZE)
                            : item.quantity
                        }
                        onChange={(qty) =>
                          updateQuantity(
                            item.variantId,
                            item.type,
                            item.type === "WHOLESALE" ? qty * CAJA_SIZE : qty
                          )
                        }
                        min={0}
                        max={99}
                      />
                      <span className="text-sm font-medium text-on-surface tnum">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {item.type === "WHOLESALE" && (
                        <p className="text-[11px] text-on-surface-variant tnum">
                          {item.quantity / CAJA_SIZE}{" "}
                          {item.quantity / CAJA_SIZE === 1 ? "caja" : "cajas"} ·{" "}
                          {item.quantity} unidades
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            item.type === "RETAIL"
                              ? "border-line-strong text-on-surface-variant"
                              : "border-secondary/50 bg-secondary/10 text-secondary"
                          )}
                        >
                          {item.type === "RETAIL" ? "Individual" : "Mayoreo"}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId, item.type)}
                          className="text-xs text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-error"
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
            <div className="space-y-3 border-t border-line px-6 py-5">
              <div className="space-y-1 text-sm">
                {retailSubtotal > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal individual</span>
                    <span className="tnum">{formatPrice(retailSubtotal)}</span>
                  </div>
                )}
                {wholesaleSubtotal > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal mayoreo (cajas de 12)</span>
                    <span className="tnum">
                      {formatPrice(wholesaleSubtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-1 font-semibold text-on-surface">
                  <span>
                    Total ({totalItems}{" "}
                    {totalItems === 1 ? "unidad" : "unidades"})
                  </span>
                  <span className="text-lg tnum">
                    {formatPrice(retailSubtotal + wholesaleSubtotal)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Entregas coordinadas en Ecuador según ciudad y
                  disponibilidad.
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
      </Spring>
    </>
  );
}

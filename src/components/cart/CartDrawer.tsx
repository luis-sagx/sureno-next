"use client";

import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/pricing";
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
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        data-testid="cart-backdrop"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-96 max-w-[100vw] bg-background shadow-2xl flex flex-col",
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
                  key={item.variantId}
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
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                        min={0}
                        max={99}
                      />
                      <span className="text-sm font-medium text-on-surface tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                          item.type === "RETAIL"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
                        )}
                      >
                        {item.type === "RETAIL" ? "Retail" : "Mayoreo"}
                      </span>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs text-on-surface-variant hover:text-error transition-colors"
                        aria-label={`Eliminar ${item.productName}`}
                      >
                        Eliminar
                      </button>
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
                    <span>Subtotal Mayoreo</span>
                    <span className="tabular-nums">
                      {formatPrice(wholesaleSubtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface font-semibold pt-1">
                  <span>Total ({totalItems} artículos)</span>
                  <span className="tabular-nums text-lg">
                    {formatPrice(retailSubtotal + wholesaleSubtotal)}
                  </span>
                </div>
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

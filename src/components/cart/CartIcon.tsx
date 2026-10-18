"use client";

import { Spring } from "@/components/animation/springs";
import { SPRING } from "@/lib/springs/presets";
import { useCartStore } from "@/store/cart";
import { ShoppingCart } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <button
      onClick={toggleCart}
      className="relative flex h-9 w-9 items-center justify-center rounded text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:bg-surface-container hover:text-on-surface"
      aria-label="Carrito"
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <Spring
          key={totalItems}
          mode="once"
          from={{ scale: 0.4 }}
          to={{ scale: 1 }}
          config={SPRING.snappy}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-0.5 text-[10px] font-bold text-on-secondary ring-2 ring-background tnum"
        >
          {totalItems}
        </Spring>
      )}
    </button>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart } from "lucide-react";

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
      className="relative w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
      aria-label="Carrito"
    >
      <ShoppingCart className="w-5 h-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 flex items-center justify-center rounded-full bg-secondary text-on-secondary text-[10px] font-bold px-0.5">
          {totalItems}
        </span>
      )}
    </button>
  );
}

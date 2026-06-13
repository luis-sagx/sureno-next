"use client";

import { useCartStore } from "@/store/cart";
import { useEffect } from "react";

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}

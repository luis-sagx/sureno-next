"use client";

import { useCartStore } from "@/store/cart";

export function CheckoutHiddenFields() {
  const items = useCartStore((s) => s.items);

  return (
    <input type="hidden" name="items" value={JSON.stringify(items)} />
  );
}

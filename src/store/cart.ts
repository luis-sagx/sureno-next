"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  type: "RETAIL" | "WHOLESALE";
  imageUrl: string | null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string, type: CartItem["type"]) => void;
  updateQuantity: (variantId: string, type: CartItem["type"], quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  retailSubtotal: () => number;
  wholesaleSubtotal: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const matches = (i: CartItem) =>
          i.variantId === item.variantId && i.type === item.type;
        const existing = get().items.find(matches);
        if (existing) {
          set({
            items: get().items.map((i) =>
              matches(i)
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, quantity: item.quantity || 1 },
            ],
          });
        }
      },

      removeItem: (variantId, type) =>
        set({
          items: get().items.filter(
            (i) => !(i.variantId === variantId && i.type === type)
          ),
        }),

      updateQuantity: (variantId, type, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId, type);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId && i.type === type ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      retailSubtotal: () =>
        get()
          .items.filter((i) => i.type === "RETAIL")
          .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      wholesaleSubtotal: () =>
        get()
          .items.filter((i) => i.type === "WHOLESALE")
          .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: "sureno-cart" }
  )
);

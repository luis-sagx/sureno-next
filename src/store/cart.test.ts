import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cart";

describe("useCartStore", () => {
  beforeEach(() => {
    // Reset store state between tests
    useCartStore.setState({ items: [] });
  });

  const sampleItem = {
    variantId: "v1",
    productId: "p1",
    productName: "Ron Pampero Aniversario",
    productSlug: "ron-pampero-aniversario",
    variantLabel: "750ml",
    unitPrice: 850,
    type: "RETAIL" as const,
    imageUrl: null,
  };

  describe("addItem", () => {
    it("adds a new item to the cart", () => {
      useCartStore.getState().addItem(sampleItem);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        variantId: "v1",
        productName: "Ron Pampero Aniversario",
        quantity: 1,
        unitPrice: 850,
        type: "RETAIL",
      });
    });

    it("increments quantity when adding an existing item", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem(sampleItem);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("accepts an explicit quantity on add", () => {
      useCartStore.getState().addItem({ ...sampleItem, quantity: 5 });

      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);
    });

    it("adds different variants as separate items", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem({ ...sampleItem, variantId: "v2", variantLabel: "1L" });

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("removes an item by variantId and type", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem({ ...sampleItem, variantId: "v2" });

      useCartStore.getState().removeItem("v1", "RETAIL");

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].variantId).toBe("v2");
    });

    it("does nothing when removing a non-existent item", () => {
      useCartStore.getState().addItem(sampleItem);

      useCartStore.getState().removeItem("nonexistent", "RETAIL");

      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("updates the quantity of an existing item", () => {
      useCartStore.getState().addItem(sampleItem);

      useCartStore.getState().updateQuantity("v1", "RETAIL", 3);

      expect(useCartStore.getState().items[0].quantity).toBe(3);
    });

    it("removes the item when quantity is set to 0", () => {
      useCartStore.getState().addItem(sampleItem);

      useCartStore.getState().updateQuantity("v1", "RETAIL", 0);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("removes the item when quantity is negative", () => {
      useCartStore.getState().addItem(sampleItem);

      useCartStore.getState().updateQuantity("v1", "RETAIL", -1);

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("empties all items from the cart", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem({ ...sampleItem, variantId: "v2" });

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("does not throw on empty cart", () => {
      expect(() => useCartStore.getState().clearCart()).not.toThrow();
    });
  });

  describe("totalItems", () => {
    it("returns 0 for an empty cart", () => {
      expect(useCartStore.getState().totalItems()).toBe(0);
    });

    it("sums quantities across all items", () => {
      useCartStore.getState().addItem(sampleItem); // qty 1
      useCartStore.getState().addItem({ ...sampleItem, variantId: "v2" }); // qty 1
      useCartStore.getState().addItem({ ...sampleItem, variantId: "v1" }); // +1 on v1

      expect(useCartStore.getState().totalItems()).toBe(3);
    });
  });

  describe("retailSubtotal", () => {
    it("returns 0 for an empty cart", () => {
      expect(useCartStore.getState().retailSubtotal()).toBe(0);
    });

    it("calculates subtotal for retail items only", () => {
      useCartStore.getState().addItem({ ...sampleItem, quantity: 2, unitPrice: 850, type: "RETAIL" });
      useCartStore.getState().addItem({
        ...sampleItem,
        variantId: "v2",
        quantity: 3,
        unitPrice: 500,
        type: "WHOLESALE",
      });

      // Retail: 2 * 850 = 1700
      expect(useCartStore.getState().retailSubtotal()).toBe(1700);
    });

    it("returns 0 when all items are wholesale", () => {
      useCartStore.getState().addItem({
        ...sampleItem,
        quantity: 3,
        unitPrice: 500,
        type: "WHOLESALE",
      });

      expect(useCartStore.getState().retailSubtotal()).toBe(0);
    });
  });

  describe("wholesaleSubtotal", () => {
    it("returns 0 for an empty cart", () => {
      expect(useCartStore.getState().wholesaleSubtotal()).toBe(0);
    });

    it("calculates subtotal for wholesale items only", () => {
      useCartStore.getState().addItem({ ...sampleItem, quantity: 2, unitPrice: 850, type: "RETAIL" });
      useCartStore.getState().addItem({
        ...sampleItem,
        variantId: "v2",
        quantity: 5,
        unitPrice: 600,
        type: "WHOLESALE",
      });

      // Wholesale: 5 * 600 = 3000
      expect(useCartStore.getState().wholesaleSubtotal()).toBe(3000);
    });
  });

  describe("isOpen", () => {
    it("starts closed by default", () => {
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it("opens and closes the cart drawer", () => {
      useCartStore.getState().openCart();
      expect(useCartStore.getState().isOpen).toBe(true);

      useCartStore.getState().closeCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it("toggles the cart open state", () => {
      expect(useCartStore.getState().isOpen).toBe(false);
      useCartStore.getState().toggleCart();
      expect(useCartStore.getState().isOpen).toBe(true);
      useCartStore.getState().toggleCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe("line identity by variantId + type", () => {
    beforeEach(() => {
      useCartStore.setState({ items: [] });
    });

    const base = {
      variantId: "v1",
      productId: "p1",
      productName: "Ron Sureño",
      productSlug: "ron-sureno",
      variantLabel: "750ml",
      imageUrl: null,
    };

    it("keeps RETAIL and WHOLESALE lines of the same variant separate", () => {
      useCartStore.getState().addItem({ ...base, unitPrice: 100, type: "RETAIL", quantity: 2 });
      useCartStore.getState().addItem({ ...base, unitPrice: 80, type: "WHOLESALE", quantity: 12 });

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items.find((i) => i.type === "RETAIL")?.quantity).toBe(2);
      expect(items.find((i) => i.type === "WHOLESALE")?.quantity).toBe(12);
    });

    it("merges quantities only for the same variant AND type", () => {
      useCartStore.getState().addItem({ ...base, unitPrice: 80, type: "WHOLESALE", quantity: 12 });
      useCartStore.getState().addItem({ ...base, unitPrice: 80, type: "WHOLESALE", quantity: 12 });

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(24);
    });

    it("removes only the line matching variantId + type", () => {
      useCartStore.getState().addItem({ ...base, unitPrice: 100, type: "RETAIL", quantity: 1 });
      useCartStore.getState().addItem({ ...base, unitPrice: 80, type: "WHOLESALE", quantity: 12 });

      useCartStore.getState().removeItem("v1", "RETAIL");

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].type).toBe("WHOLESALE");
    });

    it("updates quantity only on the matching line", () => {
      useCartStore.getState().addItem({ ...base, unitPrice: 100, type: "RETAIL", quantity: 1 });
      useCartStore.getState().addItem({ ...base, unitPrice: 80, type: "WHOLESALE", quantity: 12 });

      useCartStore.getState().updateQuantity("v1", "WHOLESALE", 24);

      expect(
        useCartStore.getState().items.find((i) => i.type === "WHOLESALE")?.quantity
      ).toBe(24);
      expect(
        useCartStore.getState().items.find((i) => i.type === "RETAIL")?.quantity
      ).toBe(1);
    });
  });

  describe("persistence", () => {
    it("persists items to localStorage", () => {
      useCartStore.getState().addItem(sampleItem);

      const stored = localStorage.getItem("sureno-cart");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.items).toHaveLength(1);
      expect(parsed.state.items[0].variantId).toBe("v1");
    });

    it("restores items from localStorage after state reset", () => {
      useCartStore.getState().addItem(sampleItem);

      // Simulate rehydration by reading from localStorage
      const stored = localStorage.getItem("sureno-cart");
      expect(stored).not.toBeNull();

      // Clear state and "rehydrate"
      useCartStore.setState({ items: [] });
      const parsed = JSON.parse(stored!);
      useCartStore.setState({ items: parsed.state.items });

      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].variantId).toBe("v1");
    });
  });
});

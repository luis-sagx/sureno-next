import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PurchasePanel } from "./PurchasePanel";
import { useCartStore } from "@/store/cart";

const props = {
  variantId: "v1",
  productId: "p1",
  productName: "Ron Sureño Añejo",
  productSlug: "ron-sureno-anejo",
  variantLabel: "750ml",
  imageUrl: null,
  retailPrice: 450,
  tiers: [
    { minQty: 6, maxQty: 11, pricePerUnit: 420 },
    { minQty: 12, maxQty: null, pricePerUnit: 380 },
  ],
  minOrder: 1,
  stockStatus: "HIGH",
};

describe("PurchasePanel", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("adds a retail unit at retail price by default", () => {
    render(<PurchasePanel {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      variantId: "v1",
      type: "RETAIL",
      quantity: 1,
      unitPrice: 450,
    });
  });

  it("in wholesale mode adds quantities in boxes of 12 at the tier price", () => {
    render(<PurchasePanel {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /mayoreo/i }));
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      type: "WHOLESALE",
      quantity: 12, // 1 caja
      unitPrice: 380, // 12+ tier
    });
  });

  it("increments wholesale quantity per caja (12 units per click)", () => {
    render(<PurchasePanel {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /mayoreo/i }));
    fireEvent.click(screen.getByRole("button", { name: /aumentar cantidad/i }));
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(useCartStore.getState().items[0].quantity).toBe(24); // 2 cajas
  });

  it("hides the wholesale toggle when there are no tiers", () => {
    render(<PurchasePanel {...props} tiers={[]} />);
    expect(screen.queryByRole("button", { name: /mayoreo/i })).toBeNull();
  });

  it("disables the button when out of stock", () => {
    render(<PurchasePanel {...props} stockStatus="OUT" />);
    expect(
      screen.getByRole("button", { name: /agregar al carrito/i })
    ).toBeDisabled();
  });
});

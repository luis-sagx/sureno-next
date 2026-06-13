import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";
import type { ComponentProps } from "react";

type Product = ComponentProps<typeof ProductCard>["product"];

const mockProduct: Product = {
  id: "p1",
  slug: "ron-sureno-anejo",
  name: "Ron Sureño Añejo",
  type: "LIQUOR",
  retailPrice: 450,
  imageUrl: null,
  badge: "BEST_SELLER",
  stockStatus: "HIGH",
  category: { name: "Ron" },
  variants: [
    {
      id: "v1",
      label: "750ml",
      price: 450,
      stock: 50,
      productId: "p1",
      wholesaleTiers: [
        { id: "wt1", variantId: "v1", minQty: 1, maxQty: null, pricePerUnit: 380 },
      ],
    },
  ],
} as unknown as Product;

// Mock the cart store
vi.mock("@/store/cart", () => ({
  useCartStore: vi.fn((selector?: (s: unknown) => unknown) => {
    const store = {
      addItem: vi.fn(),
      items: [],
    };
    return selector ? selector(store) : store;
  }),
}));

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Ron Sureño Añejo")).toBeInTheDocument();
  });

  it("renders the category label", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Ron")).toBeInTheDocument();
  });

  it("renders the add-to-cart button", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("button", { name: /agregar al carrito/i })).toBeInTheDocument();
  });

  it("displays retail price by default", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/\$450/)).toBeInTheDocument();
  });

  it("displays wholesale pricing when viewMode is wholesale", () => {
    render(<ProductCard product={mockProduct} viewMode="wholesale" />);
    // Should show AHORRAS savings indicator when wholesale tier exists
    expect(screen.getByText(/ahorras/i)).toBeInTheDocument();
    expect(screen.getByText(/\$380/)).toBeInTheDocument();
  });
});

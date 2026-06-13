import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedGrid } from "./FeaturedGrid";
import type { ComponentProps } from "react";

type Products = ComponentProps<typeof FeaturedGrid>["products"];

const products = [
  {
    id: "p1",
    slug: "ron-sureno-anejo",
    name: "Ron Sureño Añejo",
    retailPrice: 450,
    imageUrl: null,
    badge: "BEST_SELLER",
    stockStatus: "HIGH",
    category: { name: "Ron" },
    variants: [
      {
        id: "v1",
        label: "750ml",
        wholesaleTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 380 }],
      },
    ],
  },
] as unknown as Products;

describe("FeaturedGrid", () => {
  it("passes the toggled view mode down to the product cards", () => {
    render(<FeaturedGrid products={products} />);

    // Default: retail — no savings badge
    expect(screen.queryByText(/ahorras/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /mayoreo/i }));

    // Wholesale view shows the savings indicator from ProductCard
    expect(screen.getByText(/ahorras/i)).toBeInTheDocument();
  });

  it("toggles back to retail and hides the savings indicator", () => {
    render(<FeaturedGrid products={products} />);

    // Switch to wholesale first
    fireEvent.click(screen.getByRole("button", { name: /mayoreo/i }));
    expect(screen.getByText(/ahorras/i)).toBeInTheDocument();

    // Switch back to retail
    fireEvent.click(screen.getByRole("button", { name: /individual/i }));
    expect(screen.queryByText(/ahorras/i)).toBeNull();
  });
});

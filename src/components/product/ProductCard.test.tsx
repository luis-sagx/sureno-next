import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Variant, WholesaleTier } from "@prisma/client";
import { Prisma } from "@prisma/client";

vi.mock("@/store/cart", () => {
  return {
    useCartStore: () => ({ addItem: vi.fn(), openCart: vi.fn() }),
  };
});

vi.mock("@/lib/pricing", () => {
  return {
    formatPrice: (price: number) => `$${price.toFixed(2)}`,
    getBestWholesalePrice: () => 45,
  };
});

const mockProduct: Product & {
  category?: { name: string } | null;
  brand?: { name: string } | null;
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[];
} = {
  id: "test-product-1",
  slug: "test-product",
  name: "Test Product",
  description: "Test description",
  origin: "Test Origin",
  volumeMl: 750,
  abv: null,
  type: "SPIRIT",
  imageUrl: "https://example.com/product.jpg",
  badge: null,
  retailPrice: new Prisma.Decimal(50),
  categoryId: "cat-1",
  brandId: null,
  aroma: null,
  palate: null,
  finish: null,
  stockStatus: "HIGH",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { name: "Test Category" },
  brand: null,
  variants: [
    {
      id: "variant-1",
      productId: "test-product-1",
      label: "750ml",
      price: new Prisma.Decimal(50),
      stock: 10,
      minOrder: 1,
      retailImageUrl: "https://example.com/variant-retail.jpg",
      wholesaleImageUrl: "https://example.com/variant-wholesale.jpg",
      wholesaleTiers: [],
    },
  ],
};

describe("ProductCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders product name and category", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
  });

  test("displays retail variant image when available", () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/variant-retail.jpg");
  });

  test("uses fallback product image when variant image not available", () => {
    const productNoVariantImage = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          retailImageUrl: null,
          wholesaleImageUrl: null,
        },
      ],
    };

    render(<ProductCard product={productNoVariantImage} />);

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/product.jpg");
  });

  test("uses wholesale variant image in wholesale mode", () => {
    const productWithVariantImages = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          retailImageUrl: "https://example.com/variant-retail.jpg",
          wholesaleImageUrl: "https://example.com/variant-wholesale.jpg",
        },
      ],
    };

    render(<ProductCard product={productWithVariantImages} viewMode="wholesale" />);

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/variant-wholesale.jpg");
  });
});

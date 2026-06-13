import { describe, it, expect } from "vitest";
import {
  getBestWholesalePrice,
  formatPrice,
  getRetailTotal,
} from "./pricing";

// Helper to create a mock Decimal-like object
function dec(value: number) {
  return {
    lt: (other: { lt: (n: number) => boolean }) => value < Number(other),
    valueOf: () => value,
    toString: () => String(value),
    toNumber: () => value,
  } as any;
}

function mockVariant(overrides: {
  wholesaleTiers?: Array<{
    minQty: number;
    maxQty: number | null;
    pricePerUnit: ReturnType<typeof dec>;
    label?: string;
  }>;
} = {}) {
  return {
    id: "v1",
    productId: "p1",
    label: "750ml",
    price: dec(100),
    stock: 10,
    minOrder: 1,
    wholesaleTiers: overrides.wholesaleTiers ?? [],
  } as any;
}

describe("getBestWholesalePrice", () => {
  it("returns null for variant with no wholesale tiers", () => {
    const variant = mockVariant({ wholesaleTiers: [] });
    expect(getBestWholesalePrice(variant, 10)).toBeNull();
  });

  it("returns the best (lowest) tier price when quantity qualifies for multiple tiers", () => {
    const variant = mockVariant({
      wholesaleTiers: [
        { minQty: 1, maxQty: 5, pricePerUnit: dec(85), label: "1-5" },
        { minQty: 6, maxQty: 11, pricePerUnit: dec(75), label: "6-11" },
        { minQty: 12, maxQty: null, pricePerUnit: dec(65), label: "12+" },
      ],
    });

    // Quantity 12 qualifies for all three tiers — tier 12+ at $65 is cheapest
    expect(getBestWholesalePrice(variant, 12)).toBe(65);
  });

  it("returns the best tier price when quantity falls in a middle tier", () => {
    const variant = mockVariant({
      wholesaleTiers: [
        { minQty: 1, maxQty: 5, pricePerUnit: dec(85), label: "1-5" },
        { minQty: 6, maxQty: 11, pricePerUnit: dec(75), label: "6-11" },
        { minQty: 12, maxQty: null, pricePerUnit: dec(65), label: "12+" },
      ],
    });

    // Quantity 7 qualifies for tiers 1-5 and 6-11 — best is $75
    expect(getBestWholesalePrice(variant, 7)).toBe(75);
  });

  it("returns null when quantity is below the minimum tier", () => {
    const variant = mockVariant({
      wholesaleTiers: [
        { minQty: 6, maxQty: 11, pricePerUnit: dec(75), label: "6-11" },
        { minQty: 12, maxQty: null, pricePerUnit: dec(65), label: "12+" },
      ],
    });

    expect(getBestWholesalePrice(variant, 3)).toBeNull();
  });
});

describe("formatPrice", () => {
  it("formats a price in Mexican Pesos (MXN)", () => {
    const result = formatPrice(100);
    // es-MX locale formats as "$100.00"
    expect(result).toContain("100");
    expect(result).toContain("$");
  });

  it("formats zero correctly", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});

describe("getRetailTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(getRetailTotal(54, 3)).toBe(162);
  });

  it("returns zero when quantity is zero", () => {
    expect(getRetailTotal(54, 0)).toBe(0);
  });

  it("handles decimal prices", () => {
    expect(getRetailTotal(54.99, 2)).toBe(109.98);
  });
});

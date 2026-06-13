import type { Variant, WholesaleTier } from "@prisma/client";

type VariantWithTiers = Variant & { wholesaleTiers: WholesaleTier[] };

export function getBestWholesalePrice(
  variant: VariantWithTiers,
  quantity: number
): number | null {
  if (!variant.wholesaleTiers.length) return null;

  const applicable = variant.wholesaleTiers.filter(
    (t) => quantity >= t.minQty
  );

  if (!applicable.length) return null;

  const best = applicable.reduce((a, b) =>
    a.pricePerUnit.lt(b.pricePerUnit) ? a : b
  );

  return Number(best.pricePerUnit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
}

export function getRetailTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

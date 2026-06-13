import { CAJA_SIZE } from "@/lib/pricing";

export interface PayableItem {
  type: "RETAIL" | "WHOLESALE";
  quantity: number;
}

export function isWholesaleOnlyCart(items: PayableItem[]): boolean {
  return items.length > 0 && items.every((i) => i.type === "WHOLESALE");
}

/**
 * Contraentrega (cash on delivery) is only available for wholesale
 * orders composed entirely of full 12-unit cajas.
 */
export function canPayContraentrega(items: PayableItem[]): boolean {
  return (
    isWholesaleOnlyCart(items) &&
    items.every((i) => i.quantity >= CAJA_SIZE && i.quantity % CAJA_SIZE === 0)
  );
}

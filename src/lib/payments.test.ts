import { describe, expect, it } from "vitest";
import { canPayContraentrega, isWholesaleOnlyCart } from "./payments";

const caja = (quantity: number) => ({ type: "WHOLESALE" as const, quantity });
const unidad = (quantity: number) => ({ type: "RETAIL" as const, quantity });

describe("isWholesaleOnlyCart", () => {
  it("is false for an empty cart", () => {
    expect(isWholesaleOnlyCart([])).toBe(false);
  });

  it("is false when any item is retail", () => {
    expect(isWholesaleOnlyCart([caja(12), unidad(1)])).toBe(false);
  });

  it("is true when every item is wholesale", () => {
    expect(isWholesaleOnlyCart([caja(12), caja(24)])).toBe(true);
  });
});

describe("canPayContraentrega", () => {
  it("allows wholesale carts made of full cajas (multiples of 12)", () => {
    expect(canPayContraentrega([caja(12), caja(36)])).toBe(true);
  });

  it("rejects carts with any retail item", () => {
    expect(canPayContraentrega([caja(12), unidad(2)])).toBe(false);
  });

  it("rejects wholesale quantities that are not full cajas", () => {
    expect(canPayContraentrega([caja(10)])).toBe(false);
    expect(canPayContraentrega([caja(18)])).toBe(false);
  });

  it("rejects empty carts", () => {
    expect(canPayContraentrega([])).toBe(false);
  });
});

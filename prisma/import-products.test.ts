import { describe, expect, it } from "vitest";

import {
  buildDefaultWholesaleTiers,
  getCategoryFromMapping,
  getLegacyImageFallbackUrl,
  inferStockStatus,
  normalizeLegacyProducts,
  resolveLegacyImagePath,
  slugify,
  type LegacyProductRecord,
} from "./import-products";

describe("slugify", () => {
  it("removes accents and builds stable slugs", () => {
    expect(slugify("Caña Sureña 750ml")).toBe("cana-surena-750ml");
    expect(slugify("Cocktail sabor a Maracuya")).toBe("cocktail-sabor-a-maracuya");
  });
});

describe("category mapping", () => {
  it("returns mapped categories and a safe fallback", () => {
    expect(getCategoryFromMapping("67aa7c1f1e02dfc22ada42b8")).toMatchObject({
      name: "Rones",
      slug: "rones",
    });

    expect(getCategoryFromMapping("unknown")).toMatchObject({
      name: "Sin categoría",
      slug: "sin-categoria",
    });
  });
});

describe("image fallbacks", () => {
  it("maps legacy upload paths to API-backed fallback URLs", () => {
    expect(getLegacyImageFallbackUrl("/static/uploads/canaSurena.png")).toBe(
      "/api/legacy-images/canaSurena.png",
    );
  });

  it("resolves legacy local image paths", () => {
    const resolved = resolveLegacyImagePath("/static/uploads/canaSurena.png");
    expect(resolved).toContain("Sureno/static/uploads/canaSurena.png");
  });
});

describe("stock and tier helpers", () => {
  it("derives stock status from stock counts", () => {
    expect(inferStockStatus(0)).toBe("OUT");
    expect(inferStockStatus(4)).toBe("LOW");
    expect(inferStockStatus(12)).toBe("MEDIUM");
    expect(inferStockStatus(24)).toBe("HIGH");
  });

  it("builds default wholesale tiers", () => {
    expect(buildDefaultWholesaleTiers(50)).toEqual([
      { minQty: 1, maxQty: 5, pricePerUnit: 50, label: "1-5 unids" },
      { minQty: 6, maxQty: 11, pricePerUnit: 46, label: "6-11 unids" },
      { minQty: 12, maxQty: null, pricePerUnit: 42.5, label: "12+ unids" },
    ]);
  });
});

describe("normalizeLegacyProducts", () => {
  it("groups rows into logical products with variants", () => {
    const records: LegacyProductRecord[] = [
      {
        _id: { $oid: "1" },
        nombre: "Caña Sureña",
        descripcion: "desc corta",
        precio: 30,
        stock: 17,
        mililitros: 375,
        imagen: "/static/uploads/canaSurena_media.png",
        categoria_id: { $oid: "67aa7be51e02dfc22ada42b4" },
      },
      {
        _id: { $oid: "2" },
        nombre: "Caña Sureña",
        descripcion: "descripcion mucho mas larga para usar como descripcion canonica",
        precio: 50,
        stock: 15,
        mililitros: 750,
        imagen: "/static/uploads/canaSurena.png",
        categoria_id: { $oid: "67aa7be51e02dfc22ada42b4" },
      },
    ];

    const normalized = normalizeLegacyProducts(records);

    expect(normalized).toHaveLength(1);
    expect(normalized[0]).toMatchObject({
      name: "Caña Sureña",
      slug: "cana-surena",
      retailPrice: 30,
      stockStatus: "HIGH",
    });
    expect(normalized[0].description).toContain("descripcion mucho mas larga");
    expect(normalized[0].variants.map((variant) => variant.label)).toEqual(["375ml", "750ml"]);
  });
});

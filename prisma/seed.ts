import "dotenv/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando datos...");

  // ── Categories ──
  const [catSpirits, catWine, catBeer, catPacks, catOffers] = await Promise.all([
    prisma.category.create({ data: { name: "Todos los Destilados", slug: "todos-los-destilados", icon: "liquor" } }),
    prisma.category.create({ data: { name: "Cava de Vinos", slug: "cava-de-vinos", icon: "wine_bar" } }),
    prisma.category.create({ data: { name: "Cerveza Artesanal", slug: "cerveza-artesanal", icon: "sports_bar" } }),
    prisma.category.create({ data: { name: "Paquetes Mayoristas", slug: "paquetes-mayoristas", icon: "inventory_2" } }),
    prisma.category.create({ data: { name: "Ofertas Relámpago", slug: "ofertas-relampago", icon: "bolt" } }),
  ]);
  console.log("  ✅ 5 categorías");

  // ── Brands ──
  const [brandMacallan, brandVeuve, brandPatron] = await Promise.all([
    prisma.brand.create({ data: { name: "Macallan Reserve", slug: "macallan-reserve" } }),
    prisma.brand.create({ data: { name: "Veuve Clicquot", slug: "veuve-clicquot" } }),
    prisma.brand.create({ data: { name: "Patrón Spirits", slug: "patron-spirits" } }),
  ]);
  console.log("  ✅ 3 marcas");

  const D = (n: number) => new Prisma.Decimal(n);

  // ── Product 1: Ron Añejo Extra Viejo ──
  const p1 = await prisma.product.create({
    data: {
      name: "Ron Añejo Extra Viejo",
      slug: "ron-anejo-extra-viejo",
      description: "Una mezcla magistral de rones añejados hasta por 12 años en barricas de roble americano tostado. Destilado en alambiques de columna continua, este ron caribeño ofrece una experiencia sensorial excepcional.",
      origin: "República Dominicana",
      volumeMl: 750,
      abv: new Prisma.Decimal(40.0),
      type: "SPIRIT",
      badge: "PREMIUM_RESERVE",
      retailPrice: D(54),
      categoryId: catSpirits.id,
      brandId: brandPatron.id,
      aroma: "Caramelo oscuro, almendras tostadas, vainilla de Madagascar, roble ahumado",
      palate: "Textura sedosa, chocolate oscuro, cáscara de naranja especiada, tabaco añejo",
      finish: "Largo, cálido, melaza dulce con un toque tánico seco",
      stockStatus: "HIGH",
    },
  });
  const v1 = await prisma.variant.create({
    data: {
      productId: p1.id,
      label: "750ml",
      price: D(54),
      stock: 120,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v1.id, minQty: 1, maxQty: 5, pricePerUnit: D(54), label: "1-5 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v1.id, minQty: 6, maxQty: 11, pricePerUnit: D(49.50), label: "6-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v1.id, minQty: 12, pricePerUnit: D(42), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  // ── Product 2: Macallan 18 Year Reserve ──
  const p2 = await prisma.product.create({
    data: {
      name: "Macallan 18 Year Reserve",
      slug: "macallan-18-year-reserve",
      description: "El Macallan 18 años es el resultado de un excepcional proceso de envejecimiento en barricas de jerez. Cada gota revela la maestría de los artesanos de Speyside.",
      origin: "Escocia",
      volumeMl: 750,
      abv: new Prisma.Decimal(43.0),
      type: "SPIRIT",
      badge: "BEST_SELLER",
      retailPrice: D(349),
      categoryId: catSpirits.id,
      brandId: brandMacallan.id,
      aroma: "Jerez Oloroso, naranja confitada, clavo de olor, madera de cedro",
      palate: "Rico y completo, pasas maceradas, jengibre cristalizado, chocolate negro, nuez moscada",
      finish: "Persistente, roble especiado, frutos secos, un toque ahumado",
      stockStatus: "MEDIUM",
    },
  });
  const v2 = await prisma.variant.create({
    data: {
      productId: p2.id,
      label: "750ml",
      price: D(349),
      stock: 35,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v2.id, minQty: 1, maxQty: 5, pricePerUnit: D(349), label: "1-5 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v2.id, minQty: 6, maxQty: 11, pricePerUnit: D(315), label: "6-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v2.id, minQty: 12, pricePerUnit: D(279), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  // ── Product 3: Patrón El Cielo Silver ──
  const p3 = await prisma.product.create({
    data: {
      name: "Patrón El Cielo Silver",
      slug: "patron-el-cielo-silver",
      description: "Elaborado con los mejores agaves azules de los Altos de Jalisco, Patrón El Cielo es una expresión ultra-premium de la tradición tequilera mexicana.",
      origin: "México",
      volumeMl: 700,
      abv: new Prisma.Decimal(40.0),
      type: "SPIRIT",
      retailPrice: D(129),
      categoryId: catSpirits.id,
      brandId: brandPatron.id,
      aroma: "Agave cocido, cítricos frescos, pimienta blanca, notas herbales",
      palate: "Suave y cristalino, agave dulce, limón, miel ligera, pimienta",
      finish: "Limpio, refrescante, con un retrogusto mineral",
      stockStatus: "HIGH",
    },
  });
  const v3 = await prisma.variant.create({
    data: {
      productId: p3.id,
      label: "700ml",
      price: D(129),
      stock: 80,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v3.id, minQty: 1, maxQty: 5, pricePerUnit: D(129), label: "1-5 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v3.id, minQty: 6, maxQty: 11, pricePerUnit: D(116), label: "6-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v3.id, minQty: 12, pricePerUnit: D(99), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  // ── Product 4: Botanist Islay Dry Gin ──
  const p4 = await prisma.product.create({
    data: {
      name: "Botanist Islay Dry Gin",
      slug: "botanist-islay-dry-gin",
      description: "Destilado lentamente con 22 botánicos silvestres recolectados a mano en la isla de Islay. Una ginebra artesanal de pureza y complejidad excepcionales.",
      origin: "Escocia",
      volumeMl: 700,
      abv: new Prisma.Decimal(46.0),
      type: "SPIRIT",
      badge: "LIMITED_STOCK",
      retailPrice: D(54),
      categoryId: catSpirits.id,
      aroma: "Enebro fresco, flores silvestres, cítricos, menta suave",
      palate: "Complejo y herbal, enebro dominante, limón, especias dulces, regaliz",
      finish: "Limpio, refrescante, notas florales persistentes",
      stockStatus: "LOW",
    },
  });
  const v4 = await prisma.variant.create({
    data: {
      productId: p4.id,
      label: "700ml",
      price: D(54),
      stock: 15,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v4.id, minQty: 1, maxQty: 5, pricePerUnit: D(54), label: "1-5 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v4.id, minQty: 6, maxQty: 11, pricePerUnit: D(49.50), label: "6-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v4.id, minQty: 12, pricePerUnit: D(42), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  // ── Product 5: Chateau Margaux 2018 ──
  const p5 = await prisma.product.create({
    data: {
      name: "Chateau Margaux 2018",
      slug: "chateau-margaux-2018",
      description: "Uno de los Premier Grand Cru Classé más prestigiosos de Burdeos. La cosecha 2018 es considerada una de las mejores del siglo, con una estructura y elegancia incomparables.",
      origin: "Francia",
      volumeMl: 750,
      abv: new Prisma.Decimal(13.5),
      type: "WINE",
      badge: "PREMIUM_RESERVE",
      retailPrice: D(850),
      categoryId: catWine.id,
      aroma: "Grosella negra, violetas, grafito, trufa negra, roble tostado",
      palate: "Tánico y estructurado, frutos negros maduros, cassis, cedro, chocolate",
      finish: "Excepcionalmente largo, capas de fruta oscura y mineralidad",
      stockStatus: "LOW",
    },
  });
  const v5 = await prisma.variant.create({
    data: {
      productId: p5.id,
      label: "750ml",
      price: D(850),
      stock: 8,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v5.id, minQty: 1, maxQty: 3, pricePerUnit: D(850), label: "1-3 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v5.id, minQty: 4, maxQty: 11, pricePerUnit: D(765), label: "4-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v5.id, minQty: 12, pricePerUnit: D(680), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  // ── Product 6: Grey Goose VX Edition ──
  const p6 = await prisma.product.create({
    data: {
      name: "Grey Goose VX Edition",
      slug: "grey-goose-vx-edition",
      description: "Una edición exclusiva del vodka francés premium, terminado con un toque de coñac de la región de Cognac. Suavidad y sofisticación en cada sorbo.",
      origin: "Francia",
      volumeMl: 750,
      abv: new Prisma.Decimal(40.0),
      type: "SPIRIT",
      retailPrice: D(75),
      categoryId: catSpirits.id,
      aroma: "Trigo suave, pera, almendra tostada, miel",
      palate: "Sedoso, cítricos, vainilla, un toque de coñac",
      finish: "Largo, limpio, cálida dulzura",
      stockStatus: "HIGH",
    },
  });
  const v6 = await prisma.variant.create({
    data: {
      productId: p6.id,
      label: "750ml",
      price: D(75),
      stock: 100,
      minOrder: 1,
    },
  });
  await Promise.all([
    prisma.wholesaleTier.create({ data: { variantId: v6.id, minQty: 1, maxQty: 5, pricePerUnit: D(75), label: "1-5 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v6.id, minQty: 6, maxQty: 11, pricePerUnit: D(68), label: "6-11 unids" } }),
    prisma.wholesaleTier.create({ data: { variantId: v6.id, minQty: 12, pricePerUnit: D(56), label: "12+ (Caja) — MEJOR VALOR" } }),
  ]);

  console.log("  ✅ 6 productos con variantes y precios mayoristas");
  console.log("🎉 Seed completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

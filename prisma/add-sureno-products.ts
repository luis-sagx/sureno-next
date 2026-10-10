/**
 * Adds Licorería Sureño product catalog to the database.
 * Run with: npm run db:add-products
 */

import "dotenv/config";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const D = (n: number) => new Prisma.Decimal(n);

interface ProductDef {
  name: string;
  slug: string;
  description: string;
  type: string;
  volumeMl: number;
  abv: number;
  retailPrice: number;
  wholesaleUnitPrice: number;
  categorySlug: string;
  stockStatus: "HIGH" | "MEDIUM" | "LOW" | "OUT";
  retailImageUrl: string | null;
  wholesaleImageUrl: string | null;
}

const PRODUCTS: ProductDef[] = [
  {
    name: "Aguardiente Diamante",
    slug: "aguardiente-diamante",
    description:
      "Aguardiente Diamante, elaborado con los mejores ingredientes del sur de Quito. Una bebida de tradición con 26 grados de pureza en presentación de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 26,
    retailPrice: 5,
    wholesaleUnitPrice: parseFloat((42 / 12).toFixed(2)),
    categorySlug: "aguardientes",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/aguardiente-diamante.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-aguardiente-diamante.webp",
  },
  {
    name: "Blue Vodka",
    slug: "blue-vodka",
    description:
      "Vodka Blue, de suave filtrado y 9 grados de alcohol. Ideal para cócteles y consumo directo en presentación de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 9,
    retailPrice: 4,
    wholesaleUnitPrice: parseFloat((30 / 12).toFixed(2)),
    categorySlug: "vodkas",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/vodka-blue.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-vodka-blue.webp",
  },
  {
    name: "Media Caña Sureña",
    slug: "media-cana-surena",
    description:
      "Media Caña Sureña, la presentación personal de nuestro destilado más icónico. 30 grados de tradición en 375ml.",
    type: "SPIRIT",
    volumeMl: 375,
    abv: 30,
    retailPrice: 3,
    wholesaleUnitPrice: parseFloat((20 / 12).toFixed(2)),
    categorySlug: "aguardientes",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/cana-surena-media.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-cana-surena-media.webp",
  },
  {
    name: "Caña Sureña",
    slug: "cana-surena",
    description:
      "Caña Sureña, el destilado más representativo de Licorería Sureño. Elaborado con procesos controlados, 30 grados de pureza en presentación completa de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 30,
    retailPrice: 5,
    wholesaleUnitPrice: parseFloat((40 / 12).toFixed(2)),
    categorySlug: "aguardientes",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/cana-surena.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-cana-surena.webp",
  },
  {
    name: "Cocktail Sabor a Durazno",
    slug: "cocktail-durazno",
    description:
      "Refrescante cóctel sabor a durazno, listo para disfrutar. Bajo contenido alcohólico de 5 grados en presentación de 800ml.",
    type: "COCKTAIL",
    volumeMl: 800,
    abv: 5,
    retailPrice: 5,
    wholesaleUnitPrice: parseFloat((40 / 12).toFixed(2)),
    categorySlug: "cocteles",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/coctel-durazno.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-coctel-durazno.webp",
  },
  {
    name: "Cocktail Sabor a Maracuyá",
    slug: "cocktail-maracuya",
    description:
      "Cóctel tropical sabor a maracuyá, perfecto para cualquier ocasión. 5 grados de alcohol en presentación de 800ml.",
    type: "COCKTAIL",
    volumeMl: 800,
    abv: 5,
    retailPrice: 5,
    wholesaleUnitPrice: parseFloat((40 / 12).toFixed(2)),
    categorySlug: "cocteles",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/coctel-maracuya.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-coctel-maracuya.webp",
  },
  {
    name: "Licor de Cannabis",
    slug: "licor-de-cannabis",
    description:
      "Licor artesanal de Cannabis, una experiencia única y diferenciada. 6 grados de alcohol con notas herbales en presentación de 750ml.",
    type: "LIQUEUR",
    volumeMl: 750,
    abv: 6,
    retailPrice: 8,
    wholesaleUnitPrice: parseFloat((65 / 12).toFixed(2)),
    categorySlug: "licores",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/cannabis.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-cannabis.webp",
  },
  {
    name: "Media Ron Oro",
    slug: "media-ron-oro",
    description:
      "Presentación media de nuestro Ron Oro. Sabor suave y dorado, 15 grados de alcohol en 375ml, ideal para compartir.",
    type: "SPIRIT",
    volumeMl: 375,
    abv: 15,
    retailPrice: 6,
    wholesaleUnitPrice: parseFloat((45 / 12).toFixed(2)),
    categorySlug: "rones",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/licor-oro-media.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-licor-oro-media.webp",
  },
  {
    name: "Ron Oro",
    slug: "ron-oro",
    description:
      "Ron Oro Sureño, destilado con carácter y sabor suave. 15 grados de alcohol en presentación completa de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 15,
    retailPrice: 10,
    wholesaleUnitPrice: parseFloat((70 / 12).toFixed(2)),
    categorySlug: "rones",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/licor-oro.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-licor-oro.webp",
  },
  {
    name: "Vodka Seco Glacial",
    slug: "vodka-seco-glacial",
    description:
      "Vodka Seco Glacial, de sabor limpio y cristalinamente frío. 12 grados de alcohol en presentación de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 12,
    retailPrice: 7,
    wholesaleUnitPrice: parseFloat((50 / 12).toFixed(2)),
    categorySlug: "vodkas",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/vodka-glacial.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-vodka-glacial.webp",
  },
  {
    name: "Whisky Red Diez",
    slug: "whisky-red-diez",
    description:
      "Whisky Red Diez, nuestro premium de malta con 16 grados de alcohol. Notas ahumadas y equilibradas en presentación de 750ml.",
    type: "SPIRIT",
    volumeMl: 750,
    abv: 16,
    retailPrice: 15,
    wholesaleUnitPrice: parseFloat((100 / 12).toFixed(2)),
    categorySlug: "whiskies",
    stockStatus: "HIGH",
    retailImageUrl: "/img-minorista/wisky-red-diez.webp",
    wholesaleImageUrl: "/img-mayoreo/caja-wisky-red-diez.webp",
  },
];

const CATEGORIES = [
  { name: "Aguardientes", slug: "aguardientes", icon: "liquor" },
  { name: "Vodkas", slug: "vodkas", icon: "local_bar" },
  { name: "Rones", slug: "rones", icon: "liquor" },
  { name: "Whiskies", slug: "whiskies", icon: "local_bar" },
  { name: "Cócteles", slug: "cocteles", icon: "wine_bar" },
  { name: "Licores", slug: "licores", icon: "local_drink" },
];

async function main() {
  console.log("🌱 Importando productos Sureño...");

  // Upsert all categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon },
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`  ✅ ${CATEGORIES.length} categorías`);

  // Upsert all products
  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`  ⚠️  Categoría no encontrada: ${p.categorySlug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        type: p.type,
        volumeMl: p.volumeMl,
        abv: D(p.abv),
        retailPrice: D(p.retailPrice),
        stockStatus: p.stockStatus,
        imageUrl: p.retailImageUrl,
        categoryId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        type: p.type,
        volumeMl: p.volumeMl,
        abv: D(p.abv),
        retailPrice: D(p.retailPrice),
        stockStatus: p.stockStatus,
        imageUrl: p.retailImageUrl,
        categoryId,
      },
    });

    // Upsert variant
    const variant = await prisma.variant.upsert({
      where: { productId_label: { productId: product.id, label: `${p.volumeMl}ml` } },
      update: {
        price: D(p.retailPrice),
        stock: 100,
        minOrder: 1,
        retailImageUrl: p.retailImageUrl,
        wholesaleImageUrl: p.wholesaleImageUrl,
      },
      create: {
        productId: product.id,
        label: `${p.volumeMl}ml`,
        price: D(p.retailPrice),
        stock: 100,
        minOrder: 1,
        retailImageUrl: p.retailImageUrl,
        wholesaleImageUrl: p.wholesaleImageUrl,
      },
    });

    // Replace wholesale tiers
    await prisma.wholesaleTier.deleteMany({ where: { variantId: variant.id } });
    await prisma.wholesaleTier.createMany({
      data: [
        {
          variantId: variant.id,
          minQty: 1,
          maxQty: 11,
          pricePerUnit: D(p.retailPrice),
          label: "1-11 unidades",
        },
        {
          variantId: variant.id,
          minQty: 12,
          maxQty: null,
          pricePerUnit: D(p.wholesaleUnitPrice),
          label: "12+ unidades (Caja) — PRECIO MAYORISTA",
        },
      ],
    });

    console.log(`  ✅ ${p.name} — retail $${p.retailPrice} / mayorista $${p.wholesaleUnitPrice} c/u`);
  }

  console.log("🎉 Importación completada.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

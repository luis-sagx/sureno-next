import "dotenv/config";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface LegacyProductRecord {
  _id: { $oid: string };
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  mililitros: number;
  imagen: string;
  categoria_id?: { $oid: string };
}

export interface LegacyCategoryDefinition {
  name: string;
  slug: string;
  icon: string;
  productType: string;
}

export interface NormalizedVariantInput {
  sourceId: string;
  label: string;
  volumeMl: number;
  price: number;
  stock: number;
  retailImageSource: string | null;
  wholesaleImageSource: string | null;
}

export interface NormalizedProductInput {
  name: string;
  slug: string;
  description: string;
  category: LegacyCategoryDefinition;
  type: string;
  stockStatus: "HIGH" | "MEDIUM" | "LOW" | "OUT";
  retailPrice: number;
  variants: NormalizedVariantInput[];
}

const LEGACY_IMAGE_DIR = path.join(process.cwd(), "Sureno", "static", "uploads");
const STORAGE_BUCKET = "product-images";

export const LEGACY_CATEGORY_MAP: Record<string, LegacyCategoryDefinition> = {
  "67aa7be51e02dfc22ada42b4": {
    name: "Aguardientes",
    slug: "aguardientes",
    icon: "liquor",
    productType: "SPIRIT",
  },
  "67aa7c0f1e02dfc22ada42b6": {
    name: "Vodkas",
    slug: "vodkas",
    icon: "local_bar",
    productType: "SPIRIT",
  },
  "67aa7c1f1e02dfc22ada42b8": {
    name: "Rones",
    slug: "rones",
    icon: "liquor",
    productType: "SPIRIT",
  },
  "67aa7c2c1e02dfc22ada42ba": {
    name: "Whiskies",
    slug: "whiskies",
    icon: "local_bar",
    productType: "SPIRIT",
  },
  "67aa7c391e02dfc22ada42bc": {
    name: "Cócteles",
    slug: "cocteles",
    icon: "wine_bar",
    productType: "COCKTAIL",
  },
  "67ab888e662d9498df426529": {
    name: "Licores",
    slug: "licores",
    icon: "local_drink",
    productType: "LIQUEUR",
  },
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({ adapter });
}

function createSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    return null;
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getCategoryFromMapping(categoryId?: string | null): LegacyCategoryDefinition {
  if (!categoryId) {
    return {
      name: "Sin categoría",
      slug: "sin-categoria",
      icon: "inventory_2",
      productType: "SPIRIT",
    };
  }

  return LEGACY_CATEGORY_MAP[categoryId] ?? {
    name: "Sin categoría",
    slug: "sin-categoria",
    icon: "inventory_2",
    productType: "SPIRIT",
  };
}

export function resolveLegacyImagePath(imageValue?: string | null): string | null {
  if (!imageValue || imageValue.startsWith("data:image")) {
    return null;
  }

  return path.join(LEGACY_IMAGE_DIR, path.basename(imageValue));
}

export function getLegacyImageFallbackUrl(imageValue?: string | null): string | null {
  if (!imageValue) {
    return null;
  }

  return `/api/legacy-images/${encodeURIComponent(path.basename(imageValue))}`;
}

export function inferStockStatus(stock: number): "HIGH" | "MEDIUM" | "LOW" | "OUT" {
  if (stock <= 0) return "OUT";
  if (stock <= 5) return "LOW";
  if (stock <= 15) return "MEDIUM";
  return "HIGH";
}

export function buildDefaultWholesaleTiers(price: number) {
  return [
    { minQty: 1, maxQty: 5, pricePerUnit: price, label: "1-5 unids" },
    { minQty: 6, maxQty: 11, pricePerUnit: Number((price * 0.92).toFixed(2)), label: "6-11 unids" },
    { minQty: 12, maxQty: null, pricePerUnit: Number((price * 0.85).toFixed(2)), label: "12+ unids" },
  ];
}

export function normalizeLegacyProducts(records: LegacyProductRecord[]): NormalizedProductInput[] {
  const grouped = new Map<string, LegacyProductRecord[]>();

  for (const record of records) {
    const key = slugify(record.nombre);
    const existing = grouped.get(key) ?? [];
    existing.push(record);
    grouped.set(key, existing);
  }

  return Array.from(grouped.entries())
    .map(([slug, items]) => {
      const sorted = [...items].sort((a, b) => a.mililitros - b.mililitros);
      const first = sorted[0];
      const category = getCategoryFromMapping(first.categoria_id?.$oid);
      const variants: NormalizedVariantInput[] = sorted.map((item) => ({
        sourceId: item._id.$oid,
        label: `${item.mililitros}ml`,
        volumeMl: item.mililitros,
        price: item.precio,
        stock: item.stock,
        retailImageSource: item.imagen ?? null,
        wholesaleImageSource: item.imagen ?? null,
      }));

      const description = sorted.reduce((longest, current) =>
        current.descripcion.length > longest.length ? current.descripcion : longest,
      first.descripcion);

      const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
      const retailPrice = Math.min(...variants.map((variant) => variant.price));

      return {
        name: first.nombre,
        slug,
        description,
        category,
        type: category.productType,
        stockStatus: inferStockStatus(totalStock),
        retailPrice,
        variants,
      } satisfies NormalizedProductInput;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function ensureBucket(client: SupabaseClient) {
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) return;

  if (!buckets.some((bucket) => bucket.name === STORAGE_BUCKET)) {
    await client.storage.createBucket(STORAGE_BUCKET, { public: true });
  }
}

async function uploadImageAsset(
  client: SupabaseClient | null,
  sourcePath: string | null,
  destinationPath: string,
  fallbackUrl: string | null,
): Promise<string | null> {
  if (!sourcePath) {
    return fallbackUrl;
  }

  try {
    await fs.access(sourcePath);
  } catch {
    return fallbackUrl;
  }

  if (!client) {
    return fallbackUrl;
  }

  try {
    await ensureBucket(client);
    const file = await fs.readFile(sourcePath);
    const extension = path.extname(sourcePath).toLowerCase();
    const contentType = extension === ".webp"
      ? "image/webp"
      : extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : "image/png";

    const { error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(destinationPath, file, { contentType, upsert: true });

    if (error) {
      return fallbackUrl;
    }

    const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(destinationPath);
    return data.publicUrl;
  } catch {
    return fallbackUrl;
  }
}

async function upsertCategory(prisma: PrismaClient, category: LegacyCategoryDefinition) {
  return prisma.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      icon: category.icon,
    },
    create: {
      name: category.name,
      slug: category.slug,
      icon: category.icon,
    },
  });
}

async function ensureImportSchema(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "variants" ADD COLUMN IF NOT EXISTS "retail_image_url" TEXT',
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "variants" ADD COLUMN IF NOT EXISTS "wholesale_image_url" TEXT',
  );
  await prisma.$executeRawUnsafe(
    'CREATE UNIQUE INDEX IF NOT EXISTS "variants_product_id_label_key" ON "variants"("product_id", "label")',
  );
}

export async function importProducts() {
  const prisma = createPrismaClient();
  const supabase = createSupabaseAdminClient();

  try {
    await ensureImportSchema(prisma);

    const sourceFile = path.join(process.cwd(), "Sureno.productos.json");
    const raw = await fs.readFile(sourceFile, "utf8");
    const records = JSON.parse(raw) as LegacyProductRecord[];
    const normalizedProducts = normalizeLegacyProducts(records);

    for (const productInput of normalizedProducts) {
      const category = await upsertCategory(prisma, productInput.category);

      let productImageUrl: string | null = null;

      const product = await prisma.product.upsert({
        where: { slug: productInput.slug },
        update: {
          name: productInput.name,
          description: productInput.description,
          type: productInput.type,
          retailPrice: new Prisma.Decimal(productInput.retailPrice),
          categoryId: category.id,
          stockStatus: productInput.stockStatus,
        },
        create: {
          name: productInput.name,
          slug: productInput.slug,
          description: productInput.description,
          type: productInput.type,
          retailPrice: new Prisma.Decimal(productInput.retailPrice),
          categoryId: category.id,
          stockStatus: productInput.stockStatus,
          imageUrl: null,
        },
      });

      for (const variantInput of productInput.variants) {
        const retailSourcePath = resolveLegacyImagePath(variantInput.retailImageSource);
        const retailFallbackUrl = getLegacyImageFallbackUrl(variantInput.retailImageSource);
        const retailImageUrl = await uploadImageAsset(
          supabase,
          retailSourcePath,
          `retail/${productInput.slug}/${slugify(variantInput.label)}${path.extname(retailSourcePath ?? ".png") || ".png"}`,
          retailFallbackUrl,
        );

        const wholesaleSourcePath = resolveLegacyImagePath(variantInput.wholesaleImageSource);
        const wholesaleFallbackUrl = retailImageUrl ?? getLegacyImageFallbackUrl(variantInput.wholesaleImageSource);
        const wholesaleImageUrl = await uploadImageAsset(
          supabase,
          wholesaleSourcePath,
          `wholesale/${productInput.slug}/${slugify(variantInput.label)}${path.extname(wholesaleSourcePath ?? ".png") || ".png"}`,
          wholesaleFallbackUrl,
        );

        if (!productImageUrl) {
          productImageUrl = retailImageUrl ?? wholesaleImageUrl ?? null;
        }

        const variant = await prisma.variant.upsert({
          where: {
            productId_label: {
              productId: product.id,
              label: variantInput.label,
            },
          },
          update: {
            price: new Prisma.Decimal(variantInput.price),
            stock: variantInput.stock,
            minOrder: 1,
            retailImageUrl,
            wholesaleImageUrl,
          },
          create: {
            productId: product.id,
            label: variantInput.label,
            price: new Prisma.Decimal(variantInput.price),
            stock: variantInput.stock,
            minOrder: 1,
            retailImageUrl,
            wholesaleImageUrl,
          },
        });

        await prisma.wholesaleTier.deleteMany({ where: { variantId: variant.id } });
        await prisma.wholesaleTier.createMany({
          data: buildDefaultWholesaleTiers(variantInput.price).map((tier) => ({
            variantId: variant.id,
            minQty: tier.minQty,
            maxQty: tier.maxQty,
            pricePerUnit: new Prisma.Decimal(tier.pricePerUnit),
            label: tier.label,
          })),
        });
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          imageUrl: productImageUrl,
          volumeMl: productInput.variants.at(-1)?.volumeMl ?? null,
        },
      });
    }

    console.log(`✅ Imported ${normalizedProducts.length} logical products from legacy JSON.`);
  } finally {
    await prisma.$disconnect();
  }
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  void importProducts().catch((error) => {
    console.error("❌ Import failed", error);
    process.exit(1);
  });
}

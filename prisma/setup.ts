import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace("?pgbouncer=true&connection_limit=1", ""),
  ssl: { rejectUnauthorized: false },
});

const SQL = `
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "OrderType" AS ENUM ('RETAIL', 'WHOLESALE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'CONTRAENTREGA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "type" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
  "company" TEXT,
  "tax_id" TEXT,
  "address" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "icon" TEXT NOT NULL DEFAULT 'wine',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brands
CREATE TABLE IF NOT EXISTS "brands" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "image_url" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS "products" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "slug" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "origin" TEXT,
  "volume_ml" INTEGER,
  "abv" DECIMAL(4,1),
  "type" TEXT NOT NULL DEFAULT 'SPIRIT',
  "image_url" TEXT,
  "badge" TEXT,
  "retail_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "wholesale_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "category_id" TEXT NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT,
  "brand_id" TEXT REFERENCES "brands"("id") ON DELETE SET NULL,
  "aroma" TEXT,
  "palate" TEXT,
  "finish" TEXT,
  "stock_status" TEXT NOT NULL DEFAULT 'HIGH',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Variants
CREATE TABLE IF NOT EXISTS "variants" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "product_id" TEXT NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "retail_image_url" TEXT,
  "wholesale_image_url" TEXT,
  "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "cost" DECIMAL(10,2),
  "stock" INTEGER NOT NULL DEFAULT 0,
  "min_order" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "variants_product_id_label_key" UNIQUE ("product_id", "label")
);

-- Wholesale Tiers
CREATE TABLE IF NOT EXISTS "wholesale_tiers" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "variant_id" TEXT NOT NULL REFERENCES "variants"("id") ON DELETE CASCADE,
  "min_qty" INTEGER NOT NULL,
  "max_qty" INTEGER,
  "price_per_unit" DECIMAL(10,2) NOT NULL,
  "label" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "user_id" TEXT,
  "variant_id" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "type" TEXT NOT NULL DEFAULT 'RETAIL',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS "orders" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "order_number" TEXT UNIQUE NOT NULL,
  "user_id" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
  "full_name" TEXT NOT NULL DEFAULT '',
  "company" TEXT,
  "street" TEXT NOT NULL DEFAULT '',
  "city" TEXT NOT NULL DEFAULT '',
  "zip_code" TEXT NOT NULL DEFAULT '',
  "payment_method" "PaymentMethod" NOT NULL DEFAULT 'STRIPE',
  "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
  "stripe_session_id" TEXT,
  "paid_at" TIMESTAMPTZ,
  "retail_subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "wholesale_subtotal" DECIMAL(10,2) DEFAULT 0,
  "shipping_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "type" "OrderType" NOT NULL DEFAULT 'RETAIL',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "order_id" TEXT NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "variant_id" TEXT NOT NULL REFERENCES "variants"("id"),
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "type" TEXT NOT NULL DEFAULT 'RETAIL'
);

-- User Activity
CREATE TABLE IF NOT EXISTS "user_activities" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "action" TEXT NOT NULL DEFAULT '',
  "details" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Existing Prisma model retained for the root app's content schema.
CREATE TABLE IF NOT EXISTS "about_sections" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'paragraph',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "products"("category_id");
CREATE INDEX IF NOT EXISTS idx_products_brand ON "products"("brand_id");
CREATE INDEX IF NOT EXISTS idx_products_slug ON "products"("slug");
CREATE INDEX IF NOT EXISTS idx_variants_product ON "variants"("product_id");
CREATE INDEX IF NOT EXISTS idx_wholesale_tiers_variant ON "wholesale_tiers"("variant_id");
CREATE INDEX IF NOT EXISTS idx_orders_user ON "orders"("user_id");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "orders"("status");
CREATE INDEX IF NOT EXISTS idx_order_items_order ON "order_items"("order_id");
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON "user_activities"("user_id");
`;

async function main() {
  console.log("🔌 Conectando a Supabase...");
  const client = await pool.connect();
  try {
    console.log("📋 Creando tablas...");
    await client.query(SQL);
    console.log("✅ Tablas creadas exitosamente.");
    console.log("👉 Ahora corré: npm run db:seed");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

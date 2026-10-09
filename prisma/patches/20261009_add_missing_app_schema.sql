-- Additive repair for the existing Sureno Supabase schema.
-- Run manually against the intended database with psql or the Supabase SQL editor.
-- This is not part of Prisma migration history; this repository has no migrations directory.
-- Every operation is idempotent and preserves existing rows and values.

BEGIN;

ALTER TABLE public."categories"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public."brands"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public."products"
  ADD COLUMN IF NOT EXISTS "wholesale_price" DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE public."variants"
  ADD COLUMN IF NOT EXISTS "cost" DECIMAL(10,2);

ALTER TABLE public."wholesale_tiers"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public."about_sections" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'paragraph',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;

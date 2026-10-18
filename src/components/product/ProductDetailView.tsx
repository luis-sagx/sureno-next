"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TastingNotes } from "@/components/product/TastingNotes";
import { VolumePricingTable } from "@/components/product/VolumePricingTable";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CAJA_SIZE, formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Category, Product, Variant, WholesaleTier, Brand } from "../../generated/prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProductWithRelations = Product & {
  category: Category;
  brand: Brand | null;
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[];
};

interface ProductDetailViewProps {
  product: ProductWithRelations;
  initialMode?: "retail" | "wholesale";
}

const badgeVariantMap: Record<string, "save" | "bestseller" | "limited" | "premium"> = {
  SAVE_15: "save",
  BEST_SELLER: "bestseller",
  LIMITED_STOCK: "limited",
  PREMIUM_RESERVE: "premium",
};

function parseVolumeMl(label: string, fallback: number | null) {
  const match = label.match(/(\d+)\s*ml/i);
  return match ? Number(match[1]) : fallback;
}

/**
 * Product sheet: the stage on the left (sticky on desktop), the editorial
 * column on the right — eyebrow, name, price, presentation, specs — closing
 * with the purchase block. Volume ladder and tasting notes follow as sections.
 */
export function ProductDetailView({ product, initialMode = "retail" }: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const [mode, setMode] = useState<"retail" | "wholesale">(initialMode);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0],
    [product.variants, selectedVariantId],
  );

  if (!selectedVariant) {
    return (
      <p className="mx-auto max-w-[1280px] px-4 py-20 text-sm text-on-surface-variant">
        Producto no disponible actualmente.
      </p>
    );
  }

  const retailPrice = Number(selectedVariant.price ?? product.retailPrice);
  const wholesaleTiers = selectedVariant.wholesaleTiers ?? [];
  const bestWholesalePrice = wholesaleTiers.length
    ? Math.min(...wholesaleTiers.map((tier) => Number(tier.pricePerUnit)))
    : null;
  const hasNotes = Boolean(product.aroma || product.palate || product.finish);

  const currentImageUrl = mode === "wholesale"
    ? selectedVariant.wholesaleImageUrl || selectedVariant.retailImageUrl || product.imageUrl
    : selectedVariant.retailImageUrl || selectedVariant.wholesaleImageUrl || product.imageUrl;

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(120%_70%_at_70%_-26%,var(--theme-stage-top),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 pb-20 pt-10 md:pt-14">
        <Link
          href="/catalog"
          className="group inline-flex items-center gap-2 font-label text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Catálogo
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <ImageGallery
              imageUrl={currentImageUrl}
              productName={product.name}
              channel={mode}
            />
          </div>

          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <Eyebrow rule>
                {product.category.name}
                {product.brand ? ` · ${product.brand.name}` : ""}
              </Eyebrow>

              <TextReveal tag="h1" variant="lines" className="type-title text-on-surface">
                {product.name}
              </TextReveal>

              {product.badge && (
                <span>
                  <Badge
                    variant={badgeVariantMap[product.badge] || "bestseller"}
                    discount={product.badge === "SAVE_15" ? "15%" : undefined}
                  />
                </span>
              )}
            </div>

            {product.description && (
              <p className="max-w-prose text-base leading-relaxed text-on-surface-variant">
                {product.description}
              </p>
            )}

            <div className="flex flex-col gap-2 border-y border-line py-6">
              {mode === "retail" || !bestWholesalePrice ? (
                <>
                  <PriceDisplay
                    retailPrice={retailPrice}
                    wholesalePrice={bestWholesalePrice}
                    showSavings={false}
                    size="lg"
                  />
                  <span className="text-xs text-on-surface-variant tnum">
                    Caja de {CAJA_SIZE} unidades: {formatPrice(retailPrice * CAJA_SIZE)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-on-surface-variant line-through tnum">
                    {formatPrice(retailPrice)} por unidad
                  </span>
                  <span className="font-headline text-4xl font-semibold leading-none tracking-tight text-on-surface tnum">
                    Desde {formatPrice(bestWholesalePrice)}
                    <span className="ml-2 font-body text-sm font-normal tracking-normal text-on-surface-variant">
                      c/u
                    </span>
                  </span>
                  <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-secondary">
                    Mayoreo por caja de {CAJA_SIZE} unidades
                  </span>
                </>
              )}
            </div>

            {product.variants.length > 1 && (
              <div className="flex flex-col gap-3">
                <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Presentación
                </span>
                <div className="inline-flex flex-wrap self-start divide-x divide-line overflow-hidden rounded border border-line">
                  {product.variants.map((variant) => {
                    const isActive = selectedVariantId === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        aria-pressed={isActive}
                        className={cn(
                          "px-5 py-3 font-label text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
                          "transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
                          isActive
                            ? "bg-secondary text-on-secondary shadow-[inset_0_1px_0_var(--theme-inner-light)]"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        )}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <ProductSpecs
              origin={product.origin}
              volumeMl={parseVolumeMl(selectedVariant.label, product.volumeMl)}
              abv={product.abv ? Number(product.abv) : null}
              category={product.category.name}
            />

            <PurchasePanel
              variantId={selectedVariant.id}
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              variantLabel={selectedVariant.label}
              imageUrl={currentImageUrl}
              retailPrice={retailPrice}
              tiers={wholesaleTiers.map((tier) => ({
                minQty: tier.minQty,
                maxQty: tier.maxQty,
                pricePerUnit: Number(tier.pricePerUnit),
              }))}
              minOrder={selectedVariant.minOrder}
              stockStatus={product.stockStatus}
              mode={mode}
              onModeChange={setMode}
            />
          </div>
        </div>

        {wholesaleTiers.length > 0 && (
          <section className="mt-24 border-t border-line pt-14">
            <SectionHeading
              eyebrow="Mayoreo"
              title="Precios por volumen"
              description="Tramos de compra con el precio por unidad que aplica en cada uno."
            />
            <VolumePricingTable
              className="mt-12 max-w-4xl"
              tiers={wholesaleTiers}
              retailPrice={retailPrice}
            />
          </section>
        )}

        {hasNotes && (
          <section className="mt-24 border-t border-line pt-14">
            <SectionHeading eyebrow="La cata" title="Notas de cata" />
            <TastingNotes
              className="mt-12"
              aroma={product.aroma}
              palate={product.palate}
              finish={product.finish}
            />
          </section>
        )}
      </div>
    </div>
  );
}

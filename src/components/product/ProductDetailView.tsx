"use client";

import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TastingNotes } from "@/components/product/TastingNotes";
import { VolumePricingTable } from "@/components/product/VolumePricingTable";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { formatPrice } from "@/lib/pricing";
import type { Category, Product, Variant, WholesaleTier, Brand } from "@prisma/client";
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

export function ProductDetailView({ product, initialMode = "retail" }: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const [mode, setMode] = useState<"retail" | "wholesale">(initialMode);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0],
    [product.variants, selectedVariantId],
  );

  if (!selectedVariant) {
    return (
      <p className="text-sm text-on-surface-variant">Producto no disponible actualmente.</p>
    );
  }

  const retailPrice = Number(selectedVariant.price ?? product.retailPrice);
  const wholesaleTiers = selectedVariant.wholesaleTiers ?? [];
  const bestWholesalePrice = wholesaleTiers.length
    ? Math.min(...wholesaleTiers.map((tier) => Number(tier.pricePerUnit)))
    : null;

  const currentImageUrl = mode === "wholesale"
    ? selectedVariant.wholesaleImageUrl || selectedVariant.retailImageUrl || product.imageUrl
    : selectedVariant.retailImageUrl || selectedVariant.wholesaleImageUrl || product.imageUrl;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ImageGallery imageUrl={currentImageUrl} productName={product.name} channel={mode} />

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant uppercase tracking-wider">
            <span>{product.category.name}</span>
            {product.brand && (
              <>
                <span>·</span>
                <span>{product.brand.name}</span>
              </>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight">
              {product.name}
            </h1>
            {product.badge && (
              <Badge
                variant={badgeVariantMap[product.badge] || "bestseller"}
                discount={product.badge === "SAVE_15" ? "15%" : undefined}
              />
            )}
          </div>

          <p className="text-base text-on-surface-variant leading-relaxed">{product.description}</p>

          {mode === "retail" || !bestWholesalePrice ? (
            <PriceDisplay retailPrice={retailPrice} size="lg" />
          ) : (
            <div className="space-y-1">
              <span className="text-sm text-on-surface-variant line-through">{formatPrice(retailPrice)}</span>
              <span className="font-headline text-3xl text-on-surface block">
                Desde {formatPrice(bestWholesalePrice)} c/u
              </span>
            </div>
          )}

          {product.variants.length > 1 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-on-surface">Presentaciones</span>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((variant) => {
                  const isActive = selectedVariantId === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={[
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:bg-surface-container-highest",
                      ].join(" ")}
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

          <div className="pt-4 border-t border-outline-variant">
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
      </div>

      {wholesaleTiers.length > 0 && (
        <section className="mb-16">
          <VolumePricingTable tiers={wholesaleTiers} retailPrice={retailPrice} />
        </section>
      )}

      <section className="mb-16">
        <TastingNotes aroma={product.aroma} palate={product.palate} finish={product.finish} />
      </section>
    </div>
  );
}

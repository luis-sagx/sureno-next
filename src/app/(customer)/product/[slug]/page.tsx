import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TastingNotes } from "@/components/product/TastingNotes";
import { VolumePricingTable } from "@/components/product/VolumePricingTable";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const badgeVariantMap: Record<string, "save" | "bestseller" | "limited" | "premium"> = {
  SAVE_15: "save",
  BEST_SELLER: "bestseller",
  LIMITED_STOCK: "limited",
  PREMIUM_RESERVE: "premium",
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = serializeDecimal(
    await prisma.product.findUnique({
      where: { slug },
      select: { name: true, description: true, imageUrl: true },
    })
  );

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = serializeDecimal(
    await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: {
          include: { wholesaleTiers: true },
        },
      },
    })
  );

  if (!product) {
    notFound();
  }

  const retailPrice = Number(product.retailPrice);
  const mainVariant = product.variants[0];
  const wholesaleTiers = mainVariant?.wholesaleTiers || [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      {/* Product header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <ImageGallery
          imageUrl={product.imageUrl}
          productName={product.name}
        />

        {/* Product info */}
        <div className="space-y-6">
          {/* Category + Brand */}
          <div className="flex items-center gap-2 text-sm text-on-surface-variant uppercase tracking-wider">
            <span>{product.category.name}</span>
            {product.brand && (
              <>
                <span>·</span>
                <span>{product.brand.name}</span>
              </>
            )}
          </div>

          {/* Name + Badge */}
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

          {/* Description */}
          <p className="text-base text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <PriceDisplay
            retailPrice={retailPrice}
            size="lg"
          />

          {/* Specs */}
          <ProductSpecs
            origin={product.origin}
            volumeMl={product.volumeMl}
            abv={product.abv ? Number(product.abv) : null}
            category={product.category.name}
          />

          {/* Add to cart */}
          <div className="pt-4 border-t border-outline-variant">
            {mainVariant ? (
              <PurchasePanel
                variantId={mainVariant.id}
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                variantLabel={mainVariant.label}
                imageUrl={product.imageUrl}
                retailPrice={retailPrice}
                tiers={wholesaleTiers.map((t) => ({
                  minQty: t.minQty,
                  maxQty: t.maxQty,
                  pricePerUnit: Number(t.pricePerUnit),
                }))}
                minOrder={mainVariant.minOrder}
                stockStatus={product.stockStatus}
              />
            ) : (
              <p className="text-sm text-on-surface-variant">
                Producto no disponible actualmente.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Wholesale Pricing Table */}
      {wholesaleTiers.length > 0 && (
        <section className="mb-16">
          <VolumePricingTable
            tiers={wholesaleTiers}
            retailPrice={retailPrice}
          />
        </section>
      )}

      {/* Tasting Notes */}
      <section className="mb-16">
        <TastingNotes
          aroma={product.aroma}
          palate={product.palate}
          finish={product.finish}
        />
      </section>
    </div>
  );
}

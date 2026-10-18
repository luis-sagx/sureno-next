"use client";

import { Inview } from "@/components/animation/springs";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SPRING, revealSoft, staggerDelay } from "@/lib/springs/presets";
import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  Product,
  Category,
  Brand,
  Variant,
  WholesaleTier,
} from "../../generated/prisma/client";

type ProductWithRelations = Product & {
  category: Category | null;
  brand: Brand | null;
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[];
};

interface ProductGridProps {
  products: ProductWithRelations[];
  viewMode: "retail" | "wholesale";
  cardDensity?: "default" | "compact";
  /** Where "ver todo" leads when filters come up empty. */
  resetHref?: string;
}

/**
 * One card per presentation (variant), staggered in as the grid scrolls into
 * view. Empty results answer with the house empty state instead of dead air.
 */
export function ProductGrid({
  products,
  viewMode,
  cardDensity = "default",
  resetHref = "/catalog",
}: ProductGridProps) {
  const router = useRouter();

  // Flatten: one card per variant so each size/presentation appears independently.
  // 375ml variants get "Media" prepended, unless the name already says it.
  const cards = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...product,
      name:
        variant.label === "375ml" && !/^media\b/i.test(product.name.trim())
          ? `Media ${product.name}`
          : product.name,
      variants: [variant],
    }))
  );

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
        title="Sin referencias con estos filtros"
        description="Prueba con otra categoría o amplía el rango de precio para ver más de la colección."
        actionLabel="Ver todo el catálogo"
        onAction={() => router.push(resetHref)}
        className="rounded border border-dashed border-line"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((product, index) => (
        <Inview
          key={`${product.id}-${product.variants[0].id}`}
          from={revealSoft.from}
          to={revealSoft.to}
          mode="once"
          config={SPRING.entrance}
          delayIn={staggerDelay(index, 60, 360)}
          className="h-full"
        >
          <ProductCard product={product} viewMode={viewMode} density={cardDensity} />
        </Inview>
      ))}
    </div>
  );
}

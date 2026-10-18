"use client";

import { Inview } from "@/components/animation/springs";
import { PricingToggle } from "@/components/catalog/PricingToggle";
import { ProductCard } from "@/components/product/ProductCard";
import { SPRING, revealUp, staggerDelay } from "@/lib/springs/presets";
import { useState, type ComponentProps, type ReactNode } from "react";

type Product = ComponentProps<typeof ProductCard>["product"];

interface FeaturedGridProps {
  products: Product[];
  /** Heading slot rendered beside the pricing toggle. */
  children?: ReactNode;
}

export function FeaturedGrid({ products, children }: FeaturedGridProps) {
  const [viewMode, setViewMode] = useState<"retail" | "wholesale">("retail");

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">{children}</div>
        <PricingToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <Inview
            key={product.id}
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={staggerDelay(index)}
            className="h-full"
          >
            <ProductCard product={product} viewMode={viewMode} />
          </Inview>
        ))}
      </div>
    </>
  );
}

"use client";

import { PricingToggle } from "@/components/catalog/PricingToggle";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { useState, type ComponentProps } from "react";

type Product = ComponentProps<typeof ProductCard>["product"];

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  const [viewMode, setViewMode] = useState<"retail" | "wholesale">("retail");

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface">
          Productos Destacados
        </h2>
        <PricingToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.06}>
            <ProductCard product={product} viewMode={viewMode} />
          </Reveal>
        ))}
      </div>
    </>
  );
}

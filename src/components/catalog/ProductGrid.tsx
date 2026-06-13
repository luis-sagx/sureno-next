import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Category, Brand, Variant, WholesaleTier } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  brand: Brand | null;
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[];
};

interface ProductGridProps {
  products: ProductWithRelations[];
  viewMode: "retail" | "wholesale";
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-on-surface-variant mb-2">
          No se encontraron productos
        </p>
        <p className="text-sm text-on-surface-variant/70">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

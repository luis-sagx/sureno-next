import { ProductCard } from "@/components/product/ProductCard";
import { PricingToggle } from "@/components/catalog/PricingToggle";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { FeaturedViewMode } from "./FeaturedViewMode";

export async function FeaturedProducts() {
  const products = serializeDecimal(
    await prisma.product.findMany({
      where: { badge: { not: null } },
      include: {
        category: true,
        variants: {
          include: { wholesaleTiers: true },
        },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    })
  );

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface">
          Productos Destacados
        </h2>
        <FeaturedViewMode />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="retail"
          />
        ))}
      </div>
    </section>
  );
}

import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const categorySlug = typeof params.category === "string" ? params.category : "";
  const brandSlug = typeof params.brand === "string" ? params.brand : "";
  const minPrice = typeof params.minPrice === "string" ? parseFloat(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseFloat(params.maxPrice) : undefined;
  const viewMode = params.view === "wholesale" ? "wholesale" : "retail";

  // Fetch categories and brands for filters
  const [categories, brands] = serializeDecimal(
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
    ])
  );

  // Build product query
  const where: Record<string, unknown> = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (brandSlug) {
    where.brand = { slug: brandSlug };
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    where.retailPrice = { gte: minPrice };
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    where.retailPrice = {
      ...((where.retailPrice as object) || {}),
      lte: maxPrice,
    };
  }

  const products = serializeDecimal(
    await prisma.product.findMany({
      where: where as any,
      include: {
        category: true,
        brand: true,
        variants: {
          include: { wholesaleTiers: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  );

  // Client component for pricing toggle state
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-3">
          Catálogo de Productos
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Explora nuestra colección premium de vinos, destilados y licores
          seleccionados para el paladar más exigente.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters (client) */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar categories={categories} brands={brands} />
        </div>

        {/* Products area */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}

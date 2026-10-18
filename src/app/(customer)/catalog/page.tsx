import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CAJA_SIZE } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const categorySlug = typeof params.category === "string" ? params.category : "";
  const minPrice = typeof params.minPrice === "string" ? parseFloat(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseFloat(params.maxPrice) : undefined;
  const viewMode = params.view === "wholesale" ? "wholesale" : "retail";

  const categories = serializeDecimal(await prisma.category.findMany({ orderBy: { name: "asc" } }));

  // Build product query
  const where: Record<string, unknown> = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
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
      where,
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

  const presentations = products.reduce(
    (total, product) => total + product.variants.length,
    0
  );
  const activeCategory = categories.find((category) => category.slug === categorySlug);

  // View switch keeps the active filters; the mode travels in the URL.
  const baseParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "view" || value === undefined) continue;
    const entry = Array.isArray(value) ? value[0] : value;
    if (entry) baseParams.set(key, entry);
  }
  const viewHref = (mode: "retail" | "wholesale") => {
    const next = new URLSearchParams(baseParams);
    if (mode === "wholesale") next.set("view", "wholesale");
    return `/catalog${next.size ? `?${next.toString()}` : ""}`;
  };

  return (
    <div className="bg-surface">
      {/* ── Page head ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_16%_-20%,var(--theme-stage-top),transparent_62%)]"
        />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-12 pt-16 md:pt-20">
          <SectionHeading
            eyebrow="La colección"
            title={activeCategory ? activeCategory.name : "Catálogo de productos"}
            description="Vinos, destilados y licores de la casa. Cada referencia se revisa por unidad o por caja completa, en la misma ficha."
          />

          <dl className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-5 border-t border-line pt-6">
            <div className="flex items-baseline gap-3">
              <dt className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Presentaciones
              </dt>
              <dd className="font-headline text-xl text-on-surface tnum">
                {presentations}
              </dd>
            </div>
            <div className="flex items-baseline gap-3">
              <dt className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Categorías
              </dt>
              <dd className="font-headline text-xl text-on-surface tnum">
                {categories.length}
              </dd>
            </div>
            <div className="flex items-baseline gap-3">
              <dt className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Caja mayoreo
              </dt>
              <dd className="font-headline text-xl text-on-surface tnum">
                {CAJA_SIZE} unidades
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Filters + shelf ───────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-14">
          <div className="w-full shrink-0 lg:sticky lg:top-28 lg:h-fit lg:w-64">
            <FilterSidebar categories={categories} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <p
                aria-live="polite"
                className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant tnum"
              >
                {presentations}{" "}
                {presentations === 1 ? "presentación" : "presentaciones"}
                {activeCategory ? ` · ${activeCategory.name}` : ""}
              </p>

              <div
                role="group"
                aria-label="Tipo de precio"
                className="inline-flex items-stretch rounded border border-line bg-surface-container/60 p-0.5"
              >
                {(
                  [
                    { mode: "retail", label: "Individual" },
                    { mode: "wholesale", label: "Mayoreo" },
                  ] as const
                ).map((option) => {
                  const active = viewMode === option.mode;
                  return (
                    <Link
                      key={option.mode}
                      href={viewHref(option.mode)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "rounded-sm px-4 py-2 font-label text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
                        active
                          ? "bg-secondary text-on-secondary shadow-[inset_0_1px_0_var(--theme-inner-light)]"
                          : "text-on-surface-variant hover:text-on-surface"
                      )}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <ProductGrid products={products} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

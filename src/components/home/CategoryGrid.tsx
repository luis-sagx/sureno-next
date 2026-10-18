import { Inview } from "@/components/animation/springs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SPRING, revealUp, staggerDelay } from "@/lib/springs/presets";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import {
  ArrowRight,
  GlassWater,
  Grape,
  Beer,
  Package,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
  liquor: GlassWater,
  wine_bar: Grape,
  sports_bar: Beer,
  inventory_2: Package,
  bolt: Zap,
};

/**
 * Product photography gives each category equal weight in a balanced grid.
 */
export async function CategoryGrid() {
  const categories = serializeDecimal(
    await prisma.category.findMany({
      where: { slug: { not: "ofertas-relampago" } },
      orderBy: { name: "asc" },
      include: {
        products: {
          where: { imageUrl: { not: null } },
          select: { imageUrl: true },
          take: 1,
        },
      },
    })
  );

  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-24 md:py-32">
        <SectionHeading
          eyebrow="El catálogo"
          title="Explora nuestra colección"
          description="Vinos, destilados y licores para cada ocasión — por unidad o por caja de 12."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[15rem]">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Package;
            const imageUrl = category.products[0]?.imageUrl;

            return (
              <Inview
                key={category.id}
                from={revealUp.from}
                to={revealUp.to}
                mode="once"
                config={SPRING.entrance}
                delayIn={staggerDelay(index)}
                className="h-full"
              >
                <Link
                  href={`/catalog?category=${category.slug}`}
                  className={cn(
                    "group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded border border-line p-6",
                    "bg-surface-container transition-colors duration-[var(--theme-duration-normal)] ease-entrance hover:border-line-strong"
                  )}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 ease-entrance group-hover:scale-105"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/30"
                  />

                  <span className="relative flex items-start justify-between">
                    <Icon
                      className={cn(
                        "h-5 w-5 text-secondary transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover:-translate-y-0.5"
                      )}
                    />
                    <span className="index-numeral text-lg leading-none text-on-surface-variant">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <span className="relative flex flex-col gap-4">
                    <h3
                      className={cn(
                        "font-headline leading-[1.15] text-on-surface",
                        "text-2xl md:text-3xl"
                      )}
                    >
                      {category.name}
                    </h3>
                    <span className="flex flex-col gap-2">
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-line-strong transition-all duration-[var(--theme-duration-normal)] ease-entrance group-hover:w-16 group-hover:bg-secondary"
                      />
                      <span className="flex items-center gap-2 font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-secondary">
                        Ver categoría
                        <ArrowRight
                          className="h-3 w-3 transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </span>
                </Link>
              </Inview>
            );
          })}
        </div>
      </div>
    </section>
  );
}

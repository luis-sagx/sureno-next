"use client";

import { Input } from "@/components/ui/Input";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import type { Category } from "../../generated/prisma/client";
import {
  GlassWater,
  Grape,
  Beer,
  Package,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const iconMap: Record<string, LucideIcon> = {
  liquor: GlassWater,
  wine_bar: Grape,
  sports_bar: Beer,
  inventory_2: Package,
  bolt: Zap,
};

interface FilterSidebarProps {
  categories: Category[];
  className?: string;
}

/**
 * Filter rail: hairline-separated blocks — category tiles with a gold rule,
 * then the price range fields. No panel chrome; the rules do the dividing.
 */
export function FilterSidebar({ categories, className }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/catalog");
  }, [router]);

  const hasActiveFilters = Boolean(activeCategory || minPrice || maxPrice);

  return (
    <aside className={cn("space-y-9", className)}>
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h2 className="font-headline text-lg text-on-surface">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-secondary transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary/75"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        <Eyebrow rule>Categoría</Eyebrow>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={iconMap[category.icon] || Package}
              label={category.name}
              selected={activeCategory === category.slug}
              className="min-h-32"
              onClick={() =>
                updateParam(
                  "category",
                  activeCategory === category.slug ? "" : category.slug
                )
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-line pt-7">
        <Eyebrow rule>Rango de precio</Eyebrow>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Mín"
            aria-label="Precio mínimo"
            value={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="w-full"
          />
          <span aria-hidden="true" className="h-px w-4 shrink-0 bg-line-strong" />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Máx"
            aria-label="Precio máximo"
            value={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full"
          />
        </div>
        <p className="text-xs leading-relaxed text-on-surface-variant/80">
          Precios en USD. El mayoreo se cotiza por caja de 12 unidades.
        </p>
      </div>
    </aside>
  );
}

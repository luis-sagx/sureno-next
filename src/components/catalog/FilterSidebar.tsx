"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { cn } from "@/lib/utils";
import type { Category, Brand } from "@prisma/client";
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
  brands: Brand[];
  className?: string;
}

export function FilterSidebar({
  categories,
  brands,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
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

  const hasActiveFilters = activeCategory || activeBrand || minPrice || maxPrice;

  return (
    <aside className={cn("space-y-8", className)}>
      {/* Filter heading */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-lg text-on-surface">
          Filtrar por Categoría
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-secondary hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={iconMap[category.icon] || Package}
            label={category.name}
            selected={activeCategory === category.slug}
            onClick={() =>
              updateParam("category", activeCategory === category.slug ? "" : category.slug)
            }
          />
        ))}
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-headline text-sm text-on-surface-variant mb-3 uppercase tracking-wider">
          Marcas
        </h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-surface-container",
                activeBrand === brand.slug && "bg-surface-container"
              )}
            >
              <input
                type="checkbox"
                checked={activeBrand === brand.slug}
                onChange={() =>
                  updateParam("brand", activeBrand === brand.slug ? "" : brand.slug)
                }
                className="accent-secondary"
              />
              <span className="text-sm text-on-surface-variant select-none">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-headline text-sm text-on-surface-variant mb-3 uppercase tracking-wider">
          Rango de Precio
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="w-full"
          />
          <span className="text-on-surface-variant text-sm">—</span>
          <Input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Pedidos Especiales */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.push("/catalog?special=true")}
      >
        Pedidos Especiales
      </Button>
    </aside>
  );
}

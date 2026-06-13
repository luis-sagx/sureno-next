import { CategoryCard } from "@/components/ui/CategoryCard";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import {
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

export async function CategoryGrid() {
  const categories = serializeDecimal(
    await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
  );

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20">
      <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-10 text-center">
        Explora Nuestro Catálogo
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/catalog?category=${category.slug}`}>
            <CategoryCard
              icon={iconMap[category.icon] || Package}
              label={category.name}
              className="h-full"
            />
          </Link>
        ))}

        {/* Pedidos Especiales callout */}
        <Link href="/catalog?special=true">
          <CategoryCard
            icon={Package}
            label="Pedidos Especiales"
            className="h-full border-secondary/30 bg-secondary/5 hover:bg-secondary/10"
          />
        </Link>
      </div>
    </section>
  );
}

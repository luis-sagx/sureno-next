import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { FeaturedGrid } from "./FeaturedGrid";

export async function FeaturedProducts() {
  // Badged references lead the shelf; when none carry a badge yet the newest
  // arrivals fill the row so the section never renders empty.
  const products = serializeDecimal(
    await prisma.product.findMany({
      include: {
        category: true,
        variants: {
          include: { wholesaleTiers: true },
        },
      },
      take: 4,
      orderBy: [{ badge: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    })
  );

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-24 md:py-32">
      <FeaturedGrid products={products}>
        <SectionHeading
          eyebrow="Selección de la casa"
          title="Productos destacados"
          description="Cuatro referencias de la casa: precio por unidad o por caja, sin cambiar de página."
        />
      </FeaturedGrid>
    </section>
  );
}

import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { FeaturedGrid } from "./FeaturedGrid";

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
      <FeaturedGrid products={products} />
    </section>
  );
}

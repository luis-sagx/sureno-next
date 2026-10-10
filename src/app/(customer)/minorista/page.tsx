import { ProductGrid } from "@/components/catalog/ProductGrid";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function MinoristaPage() {
  const products = serializeDecimal(
    await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: { include: { wholesaleTiers: true } },
      },
      orderBy: { name: "asc" },
    }),
  );

  return (
    <div className="mx-auto max-w-[1280px] space-y-10 px-4 py-12">
      <section className="max-w-3xl space-y-4">
        <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Minorista</p>
        <h1 className="font-headline text-4xl text-on-surface md:text-5xl">
          Compra por unidad con detalle claro en cada botella.
        </h1>
        <p className="text-lg leading-relaxed text-on-surface-variant">
          Explora el portafolio completo de Sureño, revisa cada descripción y elige la presentación
          que mejor se ajuste a tu consumo, regalo o celebración.
        </p>
      </section>

      <ProductGrid products={products} viewMode="retail" />
    </div>
  );
}

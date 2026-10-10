import { ProductGrid } from "@/components/catalog/ProductGrid";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { Package, Truck, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MayoreoPage() {
  const products = serializeDecimal(
    await prisma.product.findMany({
      where: {
        variants: {
          some: {
            wholesaleTiers: {
              some: {},
            },
          },
        },
      },
      include: {
        category: true,
        brand: true,
        variants: { include: { wholesaleTiers: true } },
      },
      orderBy: { name: "asc" },
    }),
  );

  return (
    <div className="mx-auto max-w-[1280px] space-y-12 px-4 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Mayoreo</p>
          <h1 className="font-headline text-4xl text-on-surface md:text-5xl">
            Compra por cajas de 12 unidades.
          </h1>
          <p className="max-w-[60ch] text-lg leading-relaxed text-on-surface-variant">
            Esta vista está pensada para negocios y abastecimiento. Cuando incrementás cantidad en modo mayoreo,
            cada paso suma una caja completa de 12 unidades.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-5">
            <Package className="h-8 w-8 text-secondary" />
            <p className="mt-4 text-sm font-semibold text-on-surface">1 caja = 12 unidades</p>
          </article>
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-5">
            <Truck className="h-8 w-8 text-secondary" />
            <p className="mt-4 text-sm font-semibold text-on-surface">Entrega coordinada en Ecuador</p>
          </article>
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-5">
            <Wallet className="h-8 w-8 text-secondary" />
            <p className="mt-4 text-sm font-semibold text-on-surface">Precio por unidad dentro de cada caja</p>
          </article>
        </div>
      </section>

      <ProductGrid products={products} viewMode="wholesale" />
    </div>
  );
}

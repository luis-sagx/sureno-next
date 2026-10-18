import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { buttonClass } from "@/components/ui/button-class";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { revealUp, SPRING, staggerDelay } from "@/lib/springs/presets";
import { Package, Truck, Wallet } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const notes = [
  { icon: Package, title: "1 caja = 12 unidades" },
  { icon: Truck, title: "Entrega coordinada en Ecuador" },
  { icon: Wallet, title: "Precio por unidad dentro de cada caja" },
];

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
    <div>
      {/* Catálogo mayorista */}
      <section className="mx-auto max-w-[1280px] px-4 py-16">
        <SectionHeading
          eyebrow="Catálogo"
          title="Referencias con precio por caja"
          description="Solo productos con tarifa mayorista activa. Cada tarjeta muestra el precio por unidad dentro de la caja."
        />

        <div className="mt-14">
          <ProductGrid
            products={products}
            viewMode="wholesale"
            resetHref="/mayoreo"
          />
        </div>
      </section>

      {/* Cross-link to retail */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Eyebrow rule>¿Comprás por unidad?</Eyebrow>
            <p className="font-headline text-2xl text-on-surface">
              El portafolio completo también está disponible al detalle.
            </p>
          </div>
          <Link href="/minorista" className={buttonClass("secondary", "md")}>
            Ver catálogo minorista
          </Link>
        </div>
      </section>
    </div>
  );
}

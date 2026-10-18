import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { buttonClass } from "@/components/ui/button-class";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { revealUp, SPRING, staggerDelay } from "@/lib/springs/presets";
import { Layers, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const notes = [
  {
    icon: Wallet,
    title: "Precio por unidad",
    text: "Cada presentación muestra su precio de lista, sin mínimos de compra.",
  },
  {
    icon: Layers,
    title: "12+ unidades pasan a mayoreo",
    text: "Al reunir 12 unidades del mismo producto se aplica el precio de caja.",
  },
  {
    icon: ShoppingBag,
    title: "Pedido mixto",
    text: "Podés combinar productos y presentaciones en un mismo pedido.",
  },
];

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
    <div>
      {/* Catálogo minorista */}
      <section className="mx-auto max-w-[1280px] px-4 py-16">
        <SectionHeading
          eyebrow="Catálogo"
          title="Presentaciones disponibles"
          description="Una tarjeta por presentación. Cambiá a vista de caja cuando juntes 12 unidades."
        />

        <div className="mt-14">
          <ProductGrid
            products={products}
            viewMode="retail"
            cardDensity="compact"
            resetHref="/minorista"
          />
        </div>
      </section>

      {/* Cross-link to wholesale */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Eyebrow rule>¿Abastecés un negocio?</Eyebrow>
            <p className="font-headline text-2xl text-on-surface">
              Cada caja de 12 unidades tiene su propio precio.
            </p>
          </div>
          <Link href="/mayoreo" className={buttonClass("secondary", "md")}>
            Ver catálogo mayorista
          </Link>
        </div>
      </section>
    </div>
  );
}

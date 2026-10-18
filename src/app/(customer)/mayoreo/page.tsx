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
      {/* Masthead — the wholesale terms hang from a hairline, no filled cards */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[1280px] items-end gap-14 px-4 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow rule>Mayoreo</Eyebrow>

            <TextReveal tag="h1" className="type-display text-on-surface">
              Compra por cajas de 12 unidades.
            </TextReveal>

            <Inview
              from={revealUp.from}
              to={revealUp.to}
              mode="once"
              config={SPRING.entrance}
              delayIn={120}
            >
              <p className="max-w-[60ch] text-lg leading-relaxed text-on-surface-variant">
                Esta vista está pensada para negocios y abastecimiento. Cuando
                incrementás cantidad en modo mayoreo, cada paso suma una caja
                completa de 12 unidades.
              </p>
            </Inview>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {notes.map((note, index) => (
              <Inview
                key={note.title}
                from={revealUp.from}
                to={revealUp.to}
                mode="once"
                config={SPRING.entrance}
                delayIn={staggerDelay(index)}
              >
                <div className="flex flex-col items-start gap-4 border-t border-line pt-6">
                  <div className="flex w-full items-center justify-between">
                    <span className="index-numeral text-xl text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <note.icon
                      className="h-4 w-4 text-secondary/70"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-on-surface">
                    {note.title}
                  </p>
                </div>
              </Inview>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo mayorista */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:py-24">
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

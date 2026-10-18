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
      {/* Masthead — retail, explained as three hairline notes */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[1280px] items-end gap-14 px-4 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow rule>Minorista</Eyebrow>

            <TextReveal tag="h1" className="type-display text-on-surface">
              Compra por unidad con detalle claro en cada botella.
            </TextReveal>

            <Inview
              from={revealUp.from}
              to={revealUp.to}
              mode="once"
              config={SPRING.entrance}
              delayIn={120}
            >
              <p className="max-w-[60ch] text-lg leading-relaxed text-on-surface-variant">
                Explora el portafolio completo de Sureño, revisa cada
                descripción y elige la presentación que mejor se ajuste a tu
                consumo, regalo o celebración.
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
                <div className="flex flex-col items-start gap-3 border-t border-line pt-6">
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
                  <p className="text-xs leading-relaxed text-on-surface-variant">
                    {note.text}
                  </p>
                </div>
              </Inview>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo minorista */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 md:py-24">
        <SectionHeading
          eyebrow="Catálogo"
          title="Presentaciones disponibles"
          description="Una tarjeta por presentación. Cambiá a vista de caja cuando juntes 12 unidades."
        />

        <div className="mt-14">
          <ProductGrid
            products={products}
            viewMode="retail"
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

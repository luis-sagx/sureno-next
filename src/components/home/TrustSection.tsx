import { Inview } from "@/components/animation/springs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SPRING, revealUp, staggerDelay } from "@/lib/springs/presets";
import { Factory, ShieldCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Control y calidad",
    description:
      "Procesos cuidados y autenticidad en cada presentación que sale de Sureño.",
  },
  {
    icon: Factory,
    title: "Historia local",
    description:
      "Desde 1998, la marca crece en Quito manteniendo una raíz artesanal y cercana.",
  },
  {
    icon: Truck,
    title: "Compra clara",
    description:
      "Una misma casa licorera con lectura distinta para compra por unidad o por cajas de 12.",
  },
];

/**
 * Trust triptych — numbered entries hanging from a hairline, no filled boxes.
 */
export function TrustSection() {
  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-24 md:py-32">
        <SectionHeading
          eyebrow="Nuestra casa"
          title="Lo que sostiene cada botella."
        />

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {trustItems.map((item, index) => (
            <Inview
              key={item.title}
              from={revealUp.from}
              to={revealUp.to}
              mode="once"
              config={SPRING.entrance}
              delayIn={staggerDelay(index)}
            >
              <article className="group flex flex-col items-start gap-4 border-t border-line pt-8 transition-colors duration-[var(--theme-duration-normal)] ease-entrance hover:border-line-strong">
                <div className="flex w-full items-center justify-between">
                  <span className="index-numeral text-2xl text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon
                    className="h-5 w-5 text-secondary/70"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-headline text-2xl leading-snug text-on-surface">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </article>
            </Inview>
          ))}
        </div>
      </div>
    </section>
  );
}

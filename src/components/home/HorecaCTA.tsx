import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export function HorecaCTA() {
  return (
    <section className="bg-surface-container py-20">
      <Reveal>
        <div className="mx-auto max-w-[1280px] px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-4">
            ¿Eres propietario de un bar o restaurante?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
            Accede a precios exclusivos de mayoreo, facturación inmediata y
            entregas programadas. Únete a los más de 1,500 establecimientos que
            confían en Sureño para su abastecimiento premium.
          </p>
          <Link
            href="/catalog?view=wholesale"
            className="inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary h-13 px-8 text-base border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 rounded-md"
          >
            DESCARGAR TARIFARIO MAYORISTA
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { buttonClass } from "@/components/ui/button-class";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { revealUp, SPRING } from "@/lib/springs/presets";
import Link from "next/link";

/**
 * Horeca closing band — the distillery photograph under a deep scrim with a
 * centred editorial invitation.
 */
export function HorecaCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/bg.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-24 md:py-32">
        <div className="flex flex-col items-center gap-6 text-center">
          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
          >
            <Eyebrow rule>Horeca</Eyebrow>
          </Inview>

          <TextReveal
            tag="h2"
            align="center"
            className="type-title max-w-3xl text-on-surface"
          >
            ¿Eres propietario de un bar o restaurante?
          </TextReveal>

          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={140}
          >
            <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              Accede a precios exclusivos de mayoreo, facturación inmediata y
              entregas programadas. Únete a los más de 1,500 establecimientos
              que confían en Sureño para su abastecimiento premium.
            </p>
          </Inview>

          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={220}
            className="pt-3"
          >
            <Link
              href="/catalog?view=wholesale"
              className={buttonClass("primary", "lg")}
            >
              Descargar tarifario mayorista
            </Link>
          </Inview>
        </div>
      </div>
    </section>
  );
}

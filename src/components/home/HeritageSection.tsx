import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { buttonClass } from "@/components/ui/button-class";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { imageSettle, revealUp, SPRING } from "@/lib/springs/presets";
import Image from "next/image";
import Link from "next/link";

/**
 * Heritage band — the 1998 story from the About page, retold as a quiet
 * editorial spread: giant numeral, serif quote, and the brand mark on a
 * hairline stage.
 */
export function HeritageSection() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 hidden select-none font-headline text-[15rem] italic leading-none text-on-surface/10 md:block"
      >
        1998
      </span>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 px-4 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col items-start gap-7">
          <Eyebrow rule>Herencia</Eyebrow>

          <TextReveal tag="h2" className="type-title text-on-surface">
            Una historia nacida en el sur de Quito.
          </TextReveal>

          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={120}
          >
            <p className="max-w-prose text-base leading-relaxed text-on-surface-variant">
              El 22 de mayo de 1998 nace la idea de formar una pequeña industria
              licorera en el sur de la ciudad de Quito llamada{" "}
              <strong className="font-semibold text-on-surface">SUREÑO</strong>,
              desarrollándose al principio artesanalmente. Con el transcurso del
              tiempo evolucionó como microempresa, cumpliendo siempre con las
              normas INEN y procesos controlados por el ARCSA.
            </p>
          </Inview>

          <Divider align="left" className="max-w-xs" />

          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={200}
          >
            <p className="font-headline text-2xl italic leading-snug text-secondary md:text-3xl">
              &ldquo;El sabor auténtico del sur de Quito, en cada botella.&rdquo;
            </p>
          </Inview>

          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={280}
          >
            <Link href="/about" className={buttonClass("secondary", "md")}>
              Nuestra historia
            </Link>
          </Inview>
        </div>

        {/* Brand mark on a double hairline stage */}
        <Inview
          from={imageSettle.from}
          to={imageSettle.to}
          mode="once"
          config={SPRING.entrance}
          className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-80 md:w-80"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_color-mix(in_oklab,var(--theme-secondary)_16%,transparent),transparent_65%)] blur-2xl"
          />
          <span
            aria-hidden="true"
            className="craft-line absolute inset-0 rounded-full"
          />
          <span
            aria-hidden="true"
            className="craft-line absolute inset-7 rounded-full opacity-60"
          />
          <Image
            src="/logo-isotipo.png"
            alt="Isotipo de Sureño"
            width={200}
            height={200}
            className="relative h-40 w-40 object-contain opacity-95 md:h-44 md:w-44"
          />
        </Inview>
      </div>
    </section>
  );
}

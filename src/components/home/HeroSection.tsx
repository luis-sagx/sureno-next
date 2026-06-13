"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const show3d = !reduceMotion && webgl === true;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--theme-secondary)_18%,transparent),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-20 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
              Quito · tradición licorera desde 1998
            </p>
            <h1 className="text-display italic text-on-surface text-balance">
              Un mismo origen para mayoreo y minorista.
            </h1>
            <p className="max-w-[60ch] text-lg leading-relaxed text-on-surface-variant">
              Sureño produce y comercializa licores en Ecuador con foco en calidad,
              abastecimiento confiable y una experiencia de compra clara tanto para negocios
              como para clientes finales.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link
                href="/mayoreo"
                className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 font-label text-base font-semibold uppercase tracking-wider text-on-secondary transition hover:bg-secondary/90"
              >
                Mayoreo
              </Link>
              <Link
                href="/minorista"
                className="inline-flex items-center justify-center rounded-md border-2 border-secondary px-8 py-3 font-label text-base font-semibold uppercase tracking-wider text-secondary transition hover:bg-secondary/10"
              >
                Minorista
              </Link>
            </div>
          </div>

          {show3d && (
            <div className="relative h-[360px] sm:h-[440px] lg:h-[520px]">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,var(--theme-secondary)_22%,transparent),transparent_60%)] blur-2xl"
              />
              <HeroScene scrollProgress={progressRef} />
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16">
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Mayoreo</p>
            <h2 className="mt-3 font-headline text-3xl text-on-surface">Cajas de 12 unidades</h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Pensado para tiendas, distribuidores, bares y puntos de venta que necesitan
              reposición, volumen y lectura rápida del costo por caja.
            </p>
          </article>
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Minorista</p>
            <h2 className="mt-3 font-headline text-3xl text-on-surface">Compra por unidad</h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Ideal para revisar detalles, explorar descripciones largas y elegir cada botella
              según ocasión, regalo o consumo personal.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

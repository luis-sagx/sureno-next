"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from(
  { length: 76 },
  (_, i) => `/frames_nobg/f${String(1 + i * 2).padStart(4, "0")}.webp`
);
const MID_FRAME = FRAMES[Math.floor(FRAMES.length / 2)];

type Panel = "intro" | "mayoreo" | "minorista";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();
  const [firstReady, setFirstReady] = useState(false);
  const [panel, setPanel] = useState<Panel>("intro");

  useEffect(() => {
    let cancelled = false;
    const imgs = FRAMES.map((src, i) => {
      const im = new Image();
      im.src = src;
      if (i === 0) im.onload = () => !cancelled && setFirstReady(true);
      return im;
    });
    return () => {
      cancelled = true;
      imgs.forEach((im) => (im.onload = null));
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduceMotion && imgRef.current) {
      const idx = Math.min(FRAMES.length - 1, Math.max(0, Math.round(v * (FRAMES.length - 1))));
      const src = FRAMES[idx];
      if (imgRef.current.getAttribute("src") !== src) imgRef.current.src = src;
    }
    // Switch left panel at scroll 1/3 and 2/3
    if (v < 1 / 3) setPanel("intro");
    else if (v < 2 / 3) setPanel("mayoreo");
    else setPanel("minorista");
  });

  return (
    <section ref={sectionRef} className="relative bg-surface">
      {/* ── Desktop: both columns sticky, section is 3 viewports tall ── */}
      <div className="hidden lg:block lg:min-h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--theme-secondary)_18%,transparent),transparent_45%)]" />

          <div className="relative z-10 h-full mx-auto max-w-[1280px] px-4 grid grid-cols-2 gap-12 items-center">
            {/* LEFT — three panels stacked in the same grid cell, crossfading */}
            <div className="grid">
              {/* Intro */}
              <div
                className="col-start-1 row-start-1 flex flex-col gap-6 transition-opacity duration-500"
                style={{ opacity: panel === "intro" ? 1 : 0, pointerEvents: panel === "intro" ? "auto" : "none" }}
              >
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
                <div className="flex gap-4 pt-2">
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

              {/* Mayoreo */}
              <article
                className="col-start-1 row-start-1 self-center rounded-lg border border-outline-variant/60 bg-surface-container p-8 transition-opacity duration-500"
                style={{ opacity: panel === "mayoreo" ? 1 : 0, pointerEvents: panel === "mayoreo" ? "auto" : "none" }}
              >
                <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Mayoreo</p>
                <h2 className="mt-3 font-headline text-4xl text-on-surface">Cajas de 12 unidades</h2>
                <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                  Pensado para tiendas, distribuidores, bares y puntos de venta que necesitan
                  reposición, volumen y lectura rápida del costo por caja.
                </p>
              </article>

              {/* Minorista */}
              <article
                className="col-start-1 row-start-1 self-center rounded-lg border border-outline-variant/60 bg-surface-container p-8 transition-opacity duration-500"
                style={{ opacity: panel === "minorista" ? 1 : 0, pointerEvents: panel === "minorista" ? "auto" : "none" }}
              >
                <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Minorista</p>
                <h2 className="mt-3 font-headline text-4xl text-on-surface">Compra por unidad</h2>
                <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                  Ideal para revisar detalles, explorar descripciones largas y elegir cada botella
                  según ocasión, regalo o consumo personal.
                </p>
              </article>
            </div>

            {/* RIGHT — bottle animation */}
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,var(--theme-secondary)_22%,transparent),transparent_60%)] blur-2xl"
              />
              <img
                ref={imgRef}
                src={reduceMotion ? MID_FRAME : FRAMES[0]}
                alt=""
                aria-hidden
                className={`max-h-[78vh] w-auto object-contain drop-shadow-2xl transition-opacity duration-500 ${
                  firstReady ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Scroll progress dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" aria-hidden>
            {(["intro", "mayoreo", "minorista"] as Panel[]).map((p) => (
              <div
                key={p}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  panel === p ? "w-6 bg-secondary" : "w-1.5 bg-secondary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked layout, static bottle image ── */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--theme-secondary)_18%,transparent),transparent_45%)]" />
          <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-20 flex flex-col gap-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
              Quito · tradición licorera desde 1998
            </p>
            <h1 className="text-display italic text-on-surface text-balance">
              Un mismo origen para mayoreo y minorista.
            </h1>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Sureño produce y comercializa licores en Ecuador con foco en calidad,
              abastecimiento confiable y una experiencia de compra clara tanto para negocios
              como para clientes finales.
            </p>
            <img
              src={MID_FRAME}
              alt=""
              aria-hidden
              className="mx-auto max-h-[42vh] w-auto object-contain"
            />
            <div className="flex flex-col gap-4 sm:flex-row">
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
        </div>
        <div className="mx-auto max-w-[1280px] px-4 py-12 space-y-6">
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Mayoreo</p>
            <h2 className="mt-3 font-headline text-3xl text-on-surface">Cajas de 12 unidades</h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              Pensado para tiendas, distribuidores, bares y puntos de venta que necesitan
              reposición, volumen y lectura rápida del costo por caja.
            </p>
          </article>
          <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
            <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Minorista</p>
            <h2 className="mt-3 font-headline text-3xl text-on-surface">Compra por unidad</h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              Ideal para revisar detalles, explorar descripciones largas y elegir cada botella
              según ocasión, regalo o consumo personal.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

"use client";

/**
 * Home hero — a three-viewport pinned stage (desktop).
 *
 * Scroll drives one `useProgressTrigger` subscription (on the shared ticker):
 * it scrubs the 76-frame bottle animation by swapping the image source and
 * crossfades three editorial panels with springs. Reduced motion swaps the
 * whole stage for the static composition after hydration; phones get the
 * static composition directly (a pinned scrub reads badly on touch).
 */

import { Spring } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonClass } from "@/components/ui/button-class";
import { useProgressTrigger } from "@/hooks/animation/use-progress-trigger";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMotionOff } from "@/hooks/use-motion-off";
import { useWindowWidth } from "@/hooks/use-window-size";
import { SPRING } from "@/lib/springs/presets";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from(
  { length: 76 },
  (_, i) => `/frames_nobg/f${String(1 + i * 2).padStart(4, "0")}.webp`
);
const MID_FRAME = FRAMES[Math.floor(FRAMES.length / 2)];

const DESKTOP_MIN = 1024;

type PanelId = "intro" | "mayoreo" | "minorista";

const PANELS: { id: PanelId; eyebrow: string; title: string; body: string }[] = [
  {
    id: "mayoreo",
    eyebrow: "Mayoreo",
    title: "Cajas de 12 unidades",
    body: "Pensado para tiendas, distribuidores, bares y puntos de venta que necesitan reposición, volumen y lectura rápida del costo por caja.",
  },
  {
    id: "minorista",
    eyebrow: "Minorista",
    title: "Compra por unidad",
    body: "Ideal para revisar detalles, explorar descripciones largas y elegir cada botella según ocasión, regalo o consumo personal.",
  },
];

const PANEL_FROM = { opacity: 0, y: 26 };
const PANEL_TO = { opacity: 1, y: 0 };

const INTRO_COPY =
  "Sureño produce y comercializa licores en Ecuador con foco en calidad, abastecimiento confiable y una experiencia de compra clara tanto para negocios como para clientes finales.";

function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4 pt-2">
      <Link href="/mayoreo" className={buttonClass("primary", "lg")}>
        Mayoreo
      </Link>
      <Link href="/minorista" className={buttonClass("secondary", "lg")}>
        Minorista
      </Link>
    </div>
  );
}

function ScrollCue() {
  const motionOff = useMotionOff();
  const { y } = useSpring({
    from: { y: 0 },
    to: { y: 12 },
    loop: !motionOff,
    config: SPRING.gentle,
  });

  return (
    <span className="flex items-center gap-3 font-label text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
      Desliza
      <span
        aria-hidden="true"
        className="relative block h-10 w-px overflow-hidden bg-line"
      >
        <animated.span
          style={{ transform: y.to((v) => `translateY(${v}px)`) }}
          className="absolute left-0 top-0 h-3 w-px bg-secondary"
        />
      </span>
    </span>
  );
}

/** Panels that share the left column of the pinned stage. */
function StagePanels({ panel }: { panel: PanelId }) {
  return (
    <div className="grid">
      <Spring
        enabled={panel === "intro"}
        from={PANEL_FROM}
        to={PANEL_TO}
        config={SPRING.crossfade}
        inert={panel !== "intro"}
        aria-hidden={panel !== "intro"}
        className="col-start-1 row-start-1 flex flex-col gap-6"
      >
        <Eyebrow rule>Quito · tradición licorera desde 1998</Eyebrow>
        <TextReveal
          tag="h1"
          variant="lines"
          stagger={130}
          className="type-display italic text-on-surface"
        >
          Un mismo origen para mayoreo y minorista.
        </TextReveal>
        <p className="max-w-[58ch] text-lg leading-relaxed text-on-surface-variant">
          {INTRO_COPY}
        </p>
        <HeroActions />
      </Spring>

      {PANELS.map((p) => (
        <Spring
          key={p.id}
          enabled={panel === p.id}
          from={PANEL_FROM}
          to={PANEL_TO}
          config={SPRING.crossfade}
          inert={panel !== p.id}
          aria-hidden={panel !== p.id}
          tag="article"
          className="col-start-1 row-start-1 self-center border-l border-line pl-8"
        >
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-headline text-4xl leading-[1.1] text-on-surface">
            {p.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-on-surface-variant">
            {p.body}
          </p>
        </Spring>
      ))}
    </div>
  );
}

function HeroStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const [panel, setPanel] = useState<PanelId>("intro");
  const [firstReady, setFirstReady] = useState(false);
  const width = useWindowWidth();
  const isDesktop = width >= DESKTOP_MIN;

  const { interpolatedProgress } = useProgressTrigger({
    elementRef: sectionRef,
    start: "top top",
    end: "bottom bottom",
    enabled: isDesktop,
    frameInterval: 10,
    onChange: ({ progress }) => {
      const img = bottleRef.current;
      if (img) {
        const idx = Math.min(
          FRAMES.length - 1,
          Math.max(0, Math.round(progress * (FRAMES.length - 1)))
        );
        const src = FRAMES[idx];
        if (img.getAttribute("src") !== src) img.src = src;
      }

      const next: PanelId =
        progress < 1 / 3 ? "intro" : progress < 2 / 3 ? "mayoreo" : "minorista";
      setPanel((prev) => (prev === next ? prev : next));
    },
  });

  // Warm the frame cache only where the scrub can actually run.
  useEffect(() => {
    if (!isDesktop) return;
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
  }, [isDesktop]);

  const bottleStyle = {
    transform: interpolatedProgress.to(
      [0, 1],
      ["translateY(2vh) scale(0.98)", "translateY(-4vh) scale(1.02)"],
    ),
  };

  return (
    <div ref={sectionRef} className="lg:min-h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Stage light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--theme-secondary)_16%,transparent),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1280px] grid-cols-2 items-center gap-12 px-4">
          <StagePanels panel={panel} />

          {/* Bottle stage */}
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,var(--theme-secondary)_20%,transparent),transparent_62%)] blur-2xl"
            />
            <animated.div style={bottleStyle}>
              <img
                ref={bottleRef}
                src={FRAMES[0]}
                alt=""
                aria-hidden="true"
                draggable={false}
                decoding="async"
                className={cn(
                  "max-h-[76vh] w-auto object-contain drop-shadow-2xl transition-opacity duration-700",
                  firstReady ? "opacity-100" : "opacity-0"
                )}
              />
            </animated.div>
          </div>
        </div>

        {/* Progress markers + scroll cue */}
        <div className="absolute inset-x-0 bottom-8 z-10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {(["intro", "mayoreo", "minorista"] as PanelId[]).map((p) => (
                <span
                  key={p}
                  aria-hidden="true"
                  className={cn(
                    "size-[5px] rotate-45 transition-all duration-[var(--theme-duration-normal)] ease-entrance",
                    panel === p
                      ? "scale-125 bg-secondary"
                      : "bg-line-strong"
                  )}
                />
              ))}
            </div>
            <ScrollCue />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Static composition: phones, and desktop under reduced motion. */
function HeroStatic() {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--theme-secondary)_14%,transparent),transparent_48%)]" />
        <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-20">
          <Eyebrow rule>Quito · tradición licorera desde 1998</Eyebrow>
          <TextReveal
            tag="h1"
            variant="lines"
            stagger={130}
            className="type-display italic text-on-surface"
          >
            Un mismo origen para mayoreo y minorista.
          </TextReveal>
          <p className="max-w-[58ch] text-lg leading-relaxed text-on-surface-variant">
            {INTRO_COPY}
          </p>
          <img
            src={MID_FRAME}
            alt=""
            aria-hidden="true"
            draggable={false}
            decoding="async"
            className="mx-auto max-h-[42vh] w-auto object-contain"
          />
          <HeroActions />
        </div>
      </div>
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 pb-14 md:grid-cols-2">
        {PANELS.map((p) => (
          <article key={p.id} className="border-l border-line pl-6">
            <Eyebrow>{p.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-headline text-3xl leading-[1.1] text-on-surface">
              {p.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              {p.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const hydrated = useHydrated();
  const motionOff = useMotionOff();
  // Swap to the static hero once hydrated — the flag must not change the
  // server HTML, or hydration would mismatch.
  const staticLayout = hydrated && motionOff;

  return (
    <section className="relative bg-surface">
      <div className={staticLayout ? "hidden" : "hidden lg:block"}>
        <HeroStage />
      </div>
      <div className={staticLayout ? "block" : "lg:hidden"}>
        <HeroStatic />
      </div>
    </section>
  );
}

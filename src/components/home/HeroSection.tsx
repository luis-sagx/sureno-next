"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

const emptySubscribe = () => () => {};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

function HeroCopy() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-display italic text-on-surface">
        Establecido con Excelencia
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
        Distribución mayorista y retail de vinos, ron, vodka y destilados
        premium para el sector HORECA y clientes exigentes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href="/catalog?view=wholesale"
          className="inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary h-13 px-8 text-base bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm hover:shadow-md rounded-md"
        >
          CATÁLOGO MAYORISTA
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary h-13 px-8 text-base border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 rounded-md"
        >
          EXPLORAR DESTILADOS
        </Link>
      </div>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  // Detect WebGL client-side without triggering set-state-in-effect.
  // supportsWebGL() accesses document.createElement which is only available in the browser.
  const webgl = useSyncExternalStore(
    emptySubscribe,
    () => supportsWebGL(),
    () => false
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // Act 1 copy fades out in the first half; act 2 fades in after
  const copyOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const act2Opacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const act2Y = useTransform(scrollYProgress, [0.45, 0.7], [40, 0]);
  const glowX = useTransform(scrollYProgress, [0, 1], ["-10%", "30%"]);

  const static3dFallback = reduceMotion || webgl === false;

  if (static3dFallback) {
    return (
      <section className="relative w-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-surface" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-24 md:py-32 lg:py-40">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-surface">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Drifting gold glow */}
        <motion.div
          aria-hidden
          style={{ x: glowX }}
          className="absolute top-1/4 right-0 h-[60vh] w-[60vh] rounded-full bg-secondary/10 blur-[120px]"
        />

        {/* 3D bottle */}
        <div className="absolute inset-y-0 right-0 w-full md:w-3/5 opacity-40 md:opacity-100">
          {webgl && <HeroScene scrollProgress={progressRef} />}
        </div>

        {/* Act 1 — brand statement */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-4"
        >
          <HeroCopy />
        </motion.div>

        {/* Act 2 — wholesale value prop */}
        <motion.div
          style={{ opacity: act2Opacity, y: act2Y }}
          className="absolute inset-0 z-10 mx-auto flex max-w-[1280px] items-center px-4 pointer-events-none"
        >
          <div className="max-w-xl space-y-4">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary">
              Mayoreo por cajas de 12
            </p>
            <h2 className="font-headline text-4xl md:text-5xl italic text-on-surface leading-tight">
              De nuestra bodega a tu negocio
            </h2>
            <p className="text-lg text-on-surface-variant">
              Precio preferencial por caja, entrega en 24–48 horas y pago
              contra entrega para clientes mayoristas.
            </p>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          aria-hidden
          style={{ opacity: copyOpacity }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-on-surface-variant"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest"
          >
            <span>Desliza</span>
            <span className="block h-8 w-px bg-outline-variant" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

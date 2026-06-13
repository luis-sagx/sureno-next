import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-surface">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-surface" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl space-y-8">
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl italic text-on-surface leading-tight">
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
      </div>
    </section>
  );
}

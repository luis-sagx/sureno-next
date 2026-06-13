import {
  ShieldCheck,
  Factory,
  Truck,
  MapPin,
  Bus,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-surface" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-24 md:py-32 text-center">
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl italic text-on-surface mb-6">
            Tradición y Calidad
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Legado en cada botella, compromiso en cada entrega.
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="mx-auto max-w-[1280px] px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-headline text-3xl md:text-4xl text-on-surface">
            Nuestra Historia
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Con más de 30 años de trayectoria, Licorería Sureño nació como un
            pequeño negocio familiar dedicado a la venta de licores selectos.
            Lo que comenzó en una modesta bodega se ha transformado en uno de
            los distribuidores más confiables del sector HORECA en todo el
            territorio nacional. Hoy combinamos la tradición familiar con la
            logística más moderna para llevar los mejores destilados a cada
            rincón del país.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container py-16">
        <div className="mx-auto max-w-[1280px] px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container-high">
            <Award className="w-12 h-12 text-secondary mb-4" />
            <span className="font-headline text-5xl text-on-surface mb-2">
              30+
            </span>
            <span className="text-sm text-on-surface-variant uppercase tracking-wider">
              Años de Experiencia
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container-high">
            <TrendingUp className="w-12 h-12 text-secondary mb-4" />
            <span className="font-headline text-5xl text-on-surface mb-2">
              1500+
            </span>
            <span className="text-sm text-on-surface-variant uppercase tracking-wider">
              Etiquetas Exclusivas
            </span>
          </div>
        </div>
      </section>

      {/* Compromiso Inquebrantable */}
      <section className="mx-auto max-w-[1280px] px-4 py-20">
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-12 text-center">
          Compromiso Inquebrantable
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container">
            <ShieldCheck className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-headline text-xl text-on-surface mb-2">
              Origen Certificado
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Trabajamos directamente con productores y distribuidores
              autorizados. Cada botella tiene trazabilidad garantizada desde
              su origen hasta tu establecimiento.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container">
            <Factory className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-headline text-xl text-on-surface mb-2">
              Precios de Fábrica
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Nuestra red de alianzas estratégicas nos permite ofrecer precios
              de mayoreo sin intermediarios, maximizando tu margen de
              rentabilidad en cada pedido.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container">
            <Truck className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-headline text-xl text-on-surface mb-2">
              Logística Predictiva
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Flota propia con rastreo en tiempo real. Entregas programadas que
              te permiten planificar tu inventario sin interrupciones ni
              sorpresas.
            </p>
          </div>
        </div>
      </section>

      {/* Alcance Regional */}
      <section className="bg-surface-container py-20">
        <div className="mx-auto max-w-[1280px] px-4">
          <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-12 text-center">
            Alcance Regional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-6 rounded-lg bg-surface-container-high">
              <MapPin className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <p className="font-headline text-2xl text-on-surface">
                  Cobertura Total
                </p>
                <p className="text-sm text-on-surface-variant">
                  45+ ciudades en todo el territorio nacional
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-lg bg-surface-container-high">
              <Bus className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <p className="font-headline text-2xl text-on-surface">
                  Flota Propia
                </p>
                <p className="text-sm text-on-surface-variant">
                  200+ vehículos con logística integrada
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 text-center">
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-8">
          ¿Listo para elevar su inventario?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog?view=wholesale"
            className="inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary h-13 px-8 text-base bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm hover:shadow-md rounded-md"
          >
            Catálogo Mayorista
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary h-13 px-8 text-base border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 rounded-md"
          >
            Hablar con un Agente
          </Link>
        </div>
      </section>
    </div>
  );
}

import Image from 'next/image'

const products = [
  { src: '/img-minorista/cana-surena.webp', label: 'Caña Sureña' },
  { src: '/img-minorista/vodka-blue.webp', label: 'Vodka Blue' },
  { src: '/img-minorista/licor-oro.webp', label: 'Licor Oro' },
  { src: '/img-minorista/cannabis.webp', label: 'Cannabis' },
  {
    src: '/img-minorista/aguardiente-diamante.webp',
    label: 'Aguardiente Diamante',
  },
  { src: '/img-minorista/wisky-red-diez.webp', label: 'Whisky Red 10' },
]

const bgImage = { backgroundImage: "url('/bg.webp')" }

export default function AboutPage() {
  return (
    <div>
      {/* Hero — bg fixed da el efecto parallax al hacer scroll */}
      <section
        className="relative h-80 flex items-center justify-center bg-cover bg-fixed bg-center"
        style={bgImage}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/75" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          <p className="max-w-2xl font-headline text-2xl italic text-white/90 drop-shadow-lg leading-relaxed">
            &ldquo;En cada botella destilamos tradición, pasión y el sabor de lo
            auténtico, para que cada momento se convierta en una experiencia
            única.&rdquo;
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="mx-auto max-w-7xl px-4 py-20 grid gap-12 md:grid-cols-[60fr_40fr] items-center">
        <div className="space-y-5">
          <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
            Quiénes somos
          </p>
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight">
            Una historia nacida en el sur de Quito.
          </h1>
          <p className="text-base leading-relaxed text-on-surface-variant">
            El 22 de mayo de 1998 nace la idea de formar una pequeña industria
            licorera en el sur de la ciudad de Quito llamada{' '}
            <strong className="text-on-surface">SUREÑO</strong>, desarrollándose
            al principio artesanalmente. Con el transcurso del tiempo evolucionó
            como microempresa, cumpliendo siempre con las normas INEN y procesos
            controlados por el ARCSA.
          </p>
          <p className="text-base leading-relaxed text-on-surface-variant">
            Maximizamos la satisfacción de nuestros clientes y de todos los que
            conformamos la familia Sureño, superándonos cada día para estar a la
            altura de sus exigencias.
          </p>
        </div>

        <div className="flex items-center justify-center p-10">
          <Image
            src="/logo-isotipo.png"
            alt="Sureño — Vinos & Licores"
            width={260}
            height={260}
            className="opacity-90"
          />
        </div>
      </section>

      <section
        className="relative h-48 flex items-center justify-center bg-cover bg-fixed bg-center"
        style={bgImage}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/75" />
        <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
          <p className="font-headline text-2xl italic text-white/95 drop-shadow-lg md:text-3xl">
            El sabor auténtico del sur de Quito, en cada botella.
          </p>
          <div className="h-0.5 w-12 rounded bg-secondary" />
        </div>
      </section>

      <section className="my-20"></section>

      {/* Misión */}
      <section className="border-y border-outline-variant/50 bg-surface-container">
        <div className="grid items-stretch md:grid-cols-2">
          <article className="space-y-4 px-8 py-14 md:px-16 lg:px-24">
            <h2 className="font-headline text-3xl text-on-surface">Misión</h2>
            <div className="h-0.5 w-12 rounded bg-secondary" />
            <p className="text-base leading-relaxed text-on-surface-variant">
              Producir y comercializar licores con los más altos estándares de
              calidad para satisfacer a nuestros clientes y consumidores,
              acompañándolos en sus momentos más importantes con un equipo
              humano, técnico y sostenible.
            </p>
          </article>
          <div className="relative h-72 min-h-72 md:h-auto overflow-hidden">
            <Image
              src="/mision.png"
              alt="Misión Sureño"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="border-b border-outline-variant/50 bg-surface">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="relative h-72 min-h-72 md:h-auto overflow-hidden order-2 md:order-1">
            <Image
              src="/vision.png"
              alt="Visión Sureño"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <article className="space-y-4 px-8 py-14 md:px-16 lg:px-24 order-1 md:order-2">
            <h2 className="font-headline text-3xl text-on-surface">Visión</h2>
            <div className="h-0.5 w-12 rounded bg-secondary" />
            <p className="text-base leading-relaxed text-on-surface-variant">
              Ampliar nuestra participación en el mercado nacional e incursionar
              en el mercado internacional, con mejora continua, innovación del
              portafolio y la más alta responsabilidad social para nuestros
              trabajadores, proveedores y comunidad.
            </p>
          </article>
        </div>
      </section>

      {/* Nuestros Productos */}
      <section className="mx-auto max-w-7xl px-4 py-20 space-y-10">
        <div className="space-y-2">
          <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
            Lo que ofrecemos
          </p>
          <h2 className="font-headline text-4xl text-on-surface">
            Nuestros Productos
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <div key={p.src} className="group flex flex-col items-center gap-3">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container transition-shadow group-hover:shadow-lg">
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-xs text-center font-label text-on-surface-variant">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* Shipping Info */}
      <section
        id="shipping"
        className="mx-auto max-w-7xl px-4 py-20 space-y-10"
      >
        <div className="space-y-2">
          <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
            Logística
          </p>
          <h2 className="font-headline text-4xl text-on-surface">
            Información de Envío
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">Cobertura</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Realizamos entregas en todo Quito y sus valles. Para provincias
              fuera de Pichincha, coordinamos el envío con transportistas
              de confianza a nivel nacional.
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">Tiempos de entrega</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Pedidos dentro de Quito: <strong className="text-on-surface">24-48 horas</strong>.
              Pedidos al resto del país: <strong className="text-on-surface">3-5 días hábiles</strong>.
              Los pedidos mayoristas pueden requerir 1-2 días adicionales de preparación.
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">Pedidos mayoristas</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Para pedidos de caja completa (12 unidades) accedés al precio mayorista
              automáticamente. El transporte de cajas completas tiene costo preferencial
              o puede ser coordinado con retiro en planta.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

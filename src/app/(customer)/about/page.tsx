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

const stats = [
  { value: '1998', label: 'Año de fundación' },
  { value: 'INEN', label: 'Normas certificadas' },
  { value: 'ARCSA', label: 'Procesos controlados' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero — bg fixed da el efecto parallax al hacer scroll */}
      <section
        className="relative h-96 flex items-center justify-center bg-cover bg-fixed bg-center"
        style={bgImage}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/75" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          <p className="max-w-xl font-headline text-xl italic text-white/90 drop-shadow-lg leading-relaxed">
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
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4 text-center text-white sm:gap-x-20">
          {stats.map((s) => (
            <div key={s.value} className="space-y-1">
              <p className="font-headline text-3xl md:text-4xl text-secondary drop-shadow">
                {s.value}
              </p>
              <p className="text-xs font-label uppercase tracking-[0.2em] text-white/80">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="border-y border-outline-variant/50 bg-surface-container">
        <div className="mx-auto max-w-7xl grid gap-0 md:grid-cols-2">
          <article className="space-y-4 border-b border-outline-variant/50 px-8 py-14 md:border-b-0 md:border-r">
            <h2 className="font-headline text-3xl text-on-surface">Misión</h2>
            <div className="h-0.5 w-12 rounded bg-secondary" />
            <p className="text-base leading-relaxed text-on-surface-variant">
              Producir y comercializar licores con los más altos estándares de
              calidad para satisfacer a nuestros clientes y consumidores,
              acompañándolos en sus momentos más importantes con un equipo
              humano, técnico y sostenible.
            </p>
          </article>
          <article className="space-y-4 px-8 py-14">
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
    </div>
  )
}

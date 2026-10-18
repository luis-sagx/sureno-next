import { AboutProductsCarousel } from '@/components/about/AboutProductsCarousel'
import { Inview } from '@/components/animation/springs'
import { TextReveal } from '@/components/animation/text/TextReveal'
import { Divider } from '@/components/ui/Divider'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { imageSettle, revealUp, SPRING, staggerDelay } from '@/lib/springs/presets'
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

const purpose = [
  {
    title: 'Misión',
    src: '/mision.png',
    alt: 'Misión Sureño',
    text: 'Producir y comercializar licores con los más altos estándares de calidad para satisfacer a nuestros clientes y consumidores, acompañándolos en sus momentos más importantes con un equipo humano, técnico y sostenible.',
  },
  {
    title: 'Visión',
    src: '/vision.png',
    alt: 'Visión Sureño',
    text: 'Ampliar nuestra participación en el mercado nacional e incursionar en el mercado internacional, con mejora continua, innovación del portafolio y la más alta responsabilidad social para nuestros trabajadores, proveedores y comunidad.',
  },
]

const shipping = [
  {
    title: 'Cobertura',
    text: 'Realizamos entregas en todo Quito y sus valles. Para provincias fuera de Pichincha, coordinamos el envío con transportistas de confianza a nivel nacional.',
  },
  {
    title: 'Tiempos de entrega',
    text: 'Pedidos dentro de Quito: 24-48 horas. Pedidos al resto del país: 3-5 días hábiles. Los pedidos mayoristas pueden requerir 1-2 días adicionales de preparación.',
  },
  {
    title: 'Pedidos mayoristas',
    text: 'Para pedidos de caja completa (12 unidades) accedés al precio mayorista automáticamente. El transporte de cajas completas tiene costo preferencial o puede ser coordinado con retiro en planta.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Masthead — the story opens the page, the brand mark sits on a hairline stage */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-4 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col items-start gap-7">
            <Eyebrow rule>Quiénes somos</Eyebrow>

            <TextReveal tag="h1" className="type-display text-on-surface">
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
                El 22 de mayo de 1998 nace la idea de formar una pequeña
                industria licorera en el sur de la ciudad de Quito llamada{' '}
                <strong className="font-semibold text-on-surface">
                  SUREÑO
                </strong>
                , desarrollándose al principio artesanalmente. Con el transcurso
                del tiempo evolucionó como microempresa, cumpliendo siempre con
                las normas INEN y procesos controlados por el ARCSA.
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
              <p className="max-w-prose text-base leading-relaxed text-on-surface-variant">
                Maximizamos la satisfacción de nuestros clientes y de todos los
                que conformamos la familia Sureño, superándonos cada día para
                estar a la altura de sus exigencias.
              </p>
            </Inview>
          </div>

          <Inview
            from={imageSettle.from}
            to={imageSettle.to}
            mode="once"
            config={SPRING.entrance}
            className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-72 md:w-72"
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
              className="relative h-36 w-36 object-contain opacity-95 md:h-40 md:w-40"
            />
          </Inview>
        </div>
      </section>

      {/* Quote band — the distillery photograph under a scrim */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-80 dark:opacity-60 md:bg-fixed"
          style={{ backgroundImage: "url('/bg.webp')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/45 to-background/78 dark:from-background/80 dark:via-background/70 dark:to-background/90"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center md:py-28">
          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
          >
            <p className="font-headline text-2xl italic leading-snug text-on-surface md:text-3xl">
              &ldquo;En cada botella destilamos tradición, pasión y el sabor de
              lo auténtico, para que cada momento se convierta en una
              experiencia única.&rdquo;
            </p>
          </Inview>
          <Inview
            from={revealUp.from}
            to={revealUp.to}
            mode="once"
            config={SPRING.entrance}
            delayIn={140}
          >
            <p className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-secondary">
              El sabor auténtico del sur de Quito, en cada botella
            </p>
          </Inview>
        </div>
      </section>

      {/* Misión y visión — numbered editorial entries, images on hairline stages */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:py-28">
          <SectionHeading eyebrow="Propósito" title="Lo que nos mueve." />

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {purpose.map((entry, index) => (
              <Inview
                key={entry.title}
                from={revealUp.from}
                to={revealUp.to}
                mode="once"
                config={SPRING.entrance}
                delayIn={staggerDelay(index)}
              >
                <article className="flex flex-col gap-6">
                  <div className="craft-line relative aspect-[16/9] overflow-hidden rounded">
                    <Image
                      src={entry.src}
                      alt={entry.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 border-t border-line pt-6">
                    <span className="index-numeral text-2xl text-secondary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-headline text-2xl text-on-surface">
                      {entry.title}
                    </h3>
                    <p className="text-base leading-relaxed text-on-surface-variant">
                      {entry.text}
                    </p>
                  </div>
                </article>
              </Inview>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros productos — the six house stills */}
      <section className="border-b border-line bg-background">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:py-28">
          <SectionHeading
            eyebrow="Lo que ofrecemos"
            title="Nuestros productos"
          />

          <div className="mt-14">
            <AboutProductsCarousel products={products} />
          </div>
        </div>
      </section>

      {/* Información de envío — hanging from a hairline, no filled boxes */}
      <section id="shipping" className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-20 md:py-28">
          <SectionHeading
            eyebrow="Logística"
            title="Información de envío"
            description="Cómo llega tu pedido, dentro y fuera de Quito."
          />

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {shipping.map((item, index) => (
              <Inview
                key={item.title}
                from={revealUp.from}
                to={revealUp.to}
                mode="once"
                config={SPRING.entrance}
                delayIn={staggerDelay(index)}
              >
                <article className="flex flex-col gap-4 border-t border-line pt-8 transition-colors duration-[var(--theme-duration-normal)] ease-entrance hover:border-line-strong">
                  <span className="index-numeral text-2xl text-secondary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-headline text-2xl leading-snug text-on-surface">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {item.text}
                  </p>
                </article>
              </Inview>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

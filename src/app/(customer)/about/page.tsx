import { Award, Factory, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-16 px-4 py-16">
      <section className="max-w-3xl space-y-5">
        <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">Quiénes somos</p>
        <h1 className="font-headline text-5xl text-on-surface">Una historia nacida en el sur de Quito.</h1>
        <p className="text-lg leading-relaxed text-on-surface-variant">
          Sureño nace el 22 de mayo de 1998 con la idea de formar una pequeña industria
          licorera en el sur de la ciudad de Quito. Desde un inicio artesanal, la marca evoluciona
          como microempresa manteniendo foco en calidad, control de procesos y cercanía con sus clientes.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
          <Factory className="h-8 w-8 text-secondary" />
          <h2 className="mt-4 font-headline text-2xl text-on-surface">Nuestra historia</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Crecimos desde una operación artesanal hacia una estructura más sólida, respondiendo a las exigencias
            del mercado sin perder identidad local.
          </p>
        </article>
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
          <Award className="h-8 w-8 text-secondary" />
          <h2 className="mt-4 font-headline text-2xl text-on-surface">Misión</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Producir y comercializar licores con estándares altos de calidad para acompañar a nuestros clientes
            en momentos importantes con un equipo humano, técnico y sostenible.
          </p>
        </article>
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container p-6">
          <Leaf className="h-8 w-8 text-secondary" />
          <h2 className="mt-4 font-headline text-2xl text-on-surface">Visión</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Seguir ampliando participación en el mercado nacional con mejora continua, innovación de portafolio
            y responsabilidad con trabajadores, proveedores y comunidad.
          </p>
        </article>
      </section>
    </div>
  );
}

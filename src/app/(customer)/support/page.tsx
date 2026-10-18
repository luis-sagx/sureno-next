import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MapLoader } from "@/components/support/MapLoader";
import { revealUp, SPRING, staggerDelay } from "@/lib/springs/presets";
import { Clock, Mail, MapPin, Phone, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Contactar Soporte — Licorería Sureño",
};

const contact: { icon: LucideIcon; label: string; value: ReactNode }[] = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Sur de Quito, Pichincha, Ecuador",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+593 2 000-0000",
  },
  {
    icon: Mail,
    label: "Correo",
    value: "contacto@licoreriasureno.com",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: (
      <>
        Lun – Vie: 8:00 – 18:00
        <br />
        Sáb: 9:00 – 14:00
      </>
    ),
  },
];

const faqs = [
  {
    question: "¿Cuándo aplica el precio mayorista?",
    answer:
      "El precio mayorista se aplica automáticamente al seleccionar 12 o más unidades del mismo producto, sin importar el modo de compra.",
  },
  {
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer:
      "Dentro de Quito, los pedidos se entregan en 24 a 48 horas. Para el resto del país, el tiempo estimado es de 3 a 5 días hábiles.",
  },
  {
    question: "¿Puedo retirar mi pedido en planta?",
    answer:
      "Sí. Los pedidos mayoristas pueden coordinarse para retiro en nuestra planta en el sur de Quito. Contáctanos antes para coordinar horario.",
  },
  {
    question: "¿Cómo realizo un pedido al por mayor?",
    answer:
      "Podés visitar nuestra sección de Mayoreo, agregar los productos al carrito con 12+ unidades y completar el checkout. También podés contactarnos directamente para pedidos corporativos.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria, pago contra entrega y tarjeta de crédito/débito a través de nuestra plataforma segura.",
  },
  {
    question: "¿Qué hago si recibí un producto en mal estado?",
    answer:
      "Notificanos dentro de las 48 horas posteriores a la recepción con fotos del producto. Gestionamos el cambio o reembolso según corresponda.",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-20 md:py-24">
      {/* Header */}
      <div className="flex flex-col items-start gap-6">
        <Eyebrow rule>Asistencia</Eyebrow>

        <TextReveal tag="h1" className="type-display text-on-surface">
          Contactar soporte
        </TextReveal>

        <Inview
          from={revealUp.from}
          to={revealUp.to}
          mode="once"
          config={SPRING.entrance}
          delayIn={120}
        >
          <p className="max-w-prose text-lg leading-relaxed text-on-surface-variant">
            Estamos para ayudarte. Encontrá nuestra ubicación, medios de
            contacto y respuestas a las preguntas más frecuentes.
          </p>
        </Inview>
      </div>

      {/* Contacto + mapa */}
      <div className="mt-16 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <h2 className="font-headline text-2xl text-on-surface">
            Dónde encontrarnos
          </h2>

          <dl className="flex flex-col border-b border-line">
            {contact.map((item, index) => (
              <Inview
                key={item.label}
                from={revealUp.from}
                to={revealUp.to}
                mode="once"
                config={SPRING.entrance}
                delayIn={staggerDelay(index, 60, 240)}
                className="border-t border-line"
              >
                <div className="flex items-start gap-4 py-5">
                  <span className="craft-line mt-0.5 flex size-9 shrink-0 items-center justify-center rounded">
                    <item.icon
                      className="h-4 w-4 text-secondary"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex flex-col gap-1">
                    <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                      {item.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-on-surface">
                      {item.value}
                    </dd>
                  </div>
                </div>
              </Inview>
            ))}
          </dl>

          <Divider align="left" className="max-w-xs" />
        </div>

        <div className="craft-line relative overflow-hidden rounded">
          <MapLoader />
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Respuestas rápidas"
          description="Lo que más nos consultan antes de comprar."
        />

        <div className="mt-12 flex flex-col">
          {faqs.map((faq, index) => (
            <Inview
              key={faq.question}
              from={revealUp.from}
              to={revealUp.to}
              mode="once"
              config={SPRING.entrance}
              delayIn={staggerDelay(index, 50, 250)}
            >
              <details className="group border-t border-line last:border-b">
                <summary className="flex cursor-pointer list-none items-center gap-5 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="index-numeral shrink-0 text-base text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-headline text-lg leading-snug text-on-surface md:text-xl">
                    {faq.question}
                  </span>
                  <Plus
                    className="h-4 w-4 shrink-0 text-secondary transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-prose pb-6 pl-10 text-sm leading-relaxed text-on-surface-variant">
                  {faq.answer}
                </p>
              </details>
            </Inview>
          ))}
        </div>
      </section>
    </div>
  );
}

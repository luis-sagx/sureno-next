import { MapLoader } from "@/components/support/MapLoader";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contactar Soporte — Licorería Sureño",
};

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
    <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
          Asistencia
        </p>
        <h1 className="font-headline text-4xl text-on-surface">
          Contactar Soporte
        </h1>
        <p className="text-base text-on-surface-variant max-w-xl">
          Estamos para ayudarte. Encontrá nuestra ubicación, medios de contacto y
          respuestas a las preguntas más frecuentes.
        </p>
      </div>

      {/* Contact info + Map */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <h2 className="font-headline text-2xl text-on-surface">Dónde encontrarnos</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-on-surface">Dirección</p>
                <p className="text-sm text-on-surface-variant">
                  Sur de Quito, Pichincha, Ecuador
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-on-surface">Teléfono</p>
                <p className="text-sm text-on-surface-variant">+593 2 000-0000</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-on-surface">Correo</p>
                <p className="text-sm text-on-surface-variant">
                  contacto@licoreriasureno.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-on-surface">Horario de atención</p>
                <p className="text-sm text-on-surface-variant">
                  Lun – Vie: 8:00 – 18:00
                  <br />
                  Sáb: 9:00 – 14:00
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <MapLoader />
        </div>
      </div>

      {/* FAQ */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
            Preguntas frecuentes
          </p>
          <h2 className="font-headline text-3xl text-on-surface">FAQ</h2>
        </div>

        <div className="divide-y divide-outline-variant">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-5 cursor-pointer">
              <summary className="flex items-center justify-between gap-4 list-none">
                <span className="font-headline text-lg text-on-surface">
                  {faq.question}
                </span>
                <span className="text-secondary text-xl font-bold select-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

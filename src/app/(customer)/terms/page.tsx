import { LegalSection } from "@/components/legal/LegalSection";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata = {
  title: "Términos de Servicio — Licorería Sureño",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
      <div className="flex flex-col items-start gap-6">
        <Eyebrow rule>Legal</Eyebrow>
        <TextReveal tag="h1" className="type-title text-on-surface">
          Términos de Servicio
        </TextReveal>
      </div>

      <dl className="craft mt-10 grid gap-6 rounded p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Documento
          </dt>
          <dd className="text-sm text-on-surface">Términos de Servicio</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Última actualización
          </dt>
          <dd className="text-sm text-on-surface">Junio de 2026</dd>
        </div>
      </dl>

      <div className="mt-14 flex flex-col gap-10">
        <LegalSection index={1} title="Aceptación de los términos">
          <p>
            Al acceder y utilizar el sitio web de Licorería Sureño, usted acepta
            estar sujeto a estos Términos de Servicio. Si no está de acuerdo con
            alguna parte de los términos, no podrá acceder al servicio.
          </p>
        </LegalSection>

        <LegalSection index={2} title="Uso del servicio">
          <p>
            Nuestros servicios están disponibles únicamente para personas
            mayores de 18 años. Al realizar una compra, usted confirma que
            cumple con este requisito de edad legal para la adquisición de
            bebidas alcohólicas en la República del Ecuador.
          </p>
          <p>
            El uso del sitio con fines ilegales o para distribuir contenido no
            autorizado resulta en la cancelación inmediata de su cuenta.
          </p>
        </LegalSection>

        <LegalSection index={3} title="Pedidos y precios">
          <p>
            Los precios indicados en el sitio están en dólares estadounidenses
            (USD) e incluyen IVA según la normativa ecuatoriana vigente. Sureño
            se reserva el derecho de modificar precios sin previo aviso.
          </p>
          <p>
            Los pedidos mayoristas (12 o más unidades por producto) aplican
            automáticamente el precio mayorista correspondiente al momento del
            checkout.
          </p>
        </LegalSection>

        <LegalSection index={4} title="Envíos y entrega">
          <p>
            Los tiempos de entrega son estimados y pueden variar por factores
            externos fuera de nuestro control (feriados, condiciones climáticas,
            disponibilidad de transporte). No asumimos responsabilidad por
            demoras ocasionadas por terceros transportistas.
          </p>
        </LegalSection>

        <LegalSection index={5} title="Devoluciones">
          <p>
            Aceptamos devoluciones únicamente por productos en mal estado o que
            no correspondan al pedido realizado. El cliente debe notificarnos
            dentro de las 48 horas siguientes a la recepción del pedido.
          </p>
        </LegalSection>

        <LegalSection index={6} title="Limitación de responsabilidad">
          <p>
            Licorería Sureño no se responsabiliza por el uso indebido de los
            productos adquiridos. El consumo responsable de bebidas alcohólicas
            es responsabilidad exclusiva del comprador y/o consumidor final.
          </p>
        </LegalSection>

        <LegalSection index={7} title="Contacto">
          <p>
            Para consultas sobre estos términos, puede contactarnos a través de
            nuestra página de{" "}
            <a
              href="/support"
              className="text-secondary underline-offset-4 hover:underline"
            >
              Soporte
            </a>
            .
          </p>
        </LegalSection>
      </div>
    </div>
  );
}

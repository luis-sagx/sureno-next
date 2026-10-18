import { LegalSection } from "@/components/legal/LegalSection";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata = {
  title: "Política de Privacidad — Licorería Sureño",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
      <div className="flex flex-col items-start gap-6">
        <Eyebrow rule>Legal</Eyebrow>
        <TextReveal tag="h1" className="type-title text-on-surface">
          Política de Privacidad
        </TextReveal>
      </div>

      <dl className="craft mt-10 grid gap-6 rounded p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Documento
          </dt>
          <dd className="text-sm text-on-surface">Política de Privacidad</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Última actualización
          </dt>
          <dd className="text-sm text-on-surface">Octubre de 2026</dd>
        </div>
      </dl>

      <div className="mt-14 flex flex-col gap-10">
        <LegalSection index={1} title="Responsable del tratamiento">
          <p>
            Licorería Sureño (en adelante, &ldquo;la tienda&rdquo; o
            &ldquo;nosotros&rdquo;), con domicilio en el sur de Quito,
            Pichincha, Ecuador, es responsable del tratamiento de los datos
            personales que usted nos proporciona a través de este sitio web.
            Para cualquier consulta sobre esta política puede contactarnos en{" "}
            <a
              href="mailto:contacto@licoreriasureno.com"
              className="text-secondary underline-offset-4 hover:underline"
            >
              contacto@licoreriasureno.com
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection index={2} title="Datos que recopilamos">
          <p>
            <strong className="font-semibold text-on-surface">
              Datos de cuenta:
            </strong>{" "}
            nombre, correo electrónico y contraseña (almacenada de forma
            cifrada).
          </p>
          <p>
            <strong className="font-semibold text-on-surface">
              Datos de pedido y entrega:
            </strong>{" "}
            nombre completo, empresa y RUC o cédula (opcionales, para compras
            al mayoreo), dirección, ciudad y código postal, junto con el detalle
            de los productos adquiridos.
          </p>
          <p>
            <strong className="font-semibold text-on-surface">
              Datos de pago:
            </strong>{" "}
            método de pago utilizado, estado del pago e identificadores de la
            transacción. Los datos de tarjetas de crédito o débito son
            procesados directamente por nuestro proveedor de pagos; la tienda no
            almacena números de tarjeta.
          </p>
          <p>
            <strong className="font-semibold text-on-surface">
              Datos de uso y preferencias:
            </strong>{" "}
            el contenido de su carrito de compras y su preferencia de tema
            (claro/oscuro) se guardan localmente en su navegador y no se
            transmiten a nuestros servidores.
          </p>
        </LegalSection>

        <LegalSection index={3} title="Cómo usamos sus datos">
          <p>Utilizamos sus datos personales para:</p>
          <ul className="flex list-disc flex-col gap-1 pl-6">
            <li>Crear y gestionar su cuenta y autenticar su identidad.</li>
            <li>Procesar sus pedidos, pagos y coordinar las entregas.</li>
            <li>Brindarle atención al cliente y responder sus consultas.</li>
            <li>Garantizar la seguridad del sitio y prevenir fraudes.</li>
            <li>
              Enviarle comunicaciones relacionadas con sus pedidos. No enviamos
              publicidad sin su consentimiento previo.
            </li>
          </ul>
        </LegalSection>

        <LegalSection index={4} title="Con quién compartimos sus datos">
          <p>
            No vendemos ni alquilamos sus datos personales. Los compartimos
            únicamente con los proveedores necesarios para operar la tienda:
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-6">
            <li>
              <strong className="font-semibold text-on-surface">
                Supabase:
              </strong>{" "}
              proveedor de infraestructura que aloja nuestra base de datos y
              gestiona la autenticación.
            </li>
            <li>
              <strong className="font-semibold text-on-surface">
                Stripe:
              </strong>{" "}
              procesamiento seguro de pagos con tarjeta.
            </li>
            <li>
              <strong className="font-semibold text-on-surface">
                Empresas de transporte:
              </strong>{" "}
              datos de entrega necesarios para hacer llegar su pedido.
            </li>
            <li>Autoridades competentes, cuando la ley lo exija.</li>
          </ul>
        </LegalSection>

        <LegalSection index={5} title="Conservación de los datos">
          <p>
            Conservamos sus datos mientras su cuenta permanezca activa o durante
            el tiempo necesario para cumplir obligaciones legales, contables y
            fiscales. Una vez cumplido ese plazo, los eliminamos o anonimizamos
            de forma segura.
          </p>
        </LegalSection>

        <LegalSection index={6} title="Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger
            sus datos: cifrado en tránsito (HTTPS), contraseñas almacenadas con
            algoritmos de hash y acceso restringido a la información únicamente
            al personal autorizado.
          </p>
        </LegalSection>

        <LegalSection index={7} title="Sus derechos">
          <p>
            De acuerdo con la Ley Orgánica de Protección de Datos Personales del
            Ecuador, usted puede ejercer sus derechos de acceso, rectificación,
            actualización, eliminación, oposición, portabilidad y revocatoria
            del consentimiento sobre sus datos personales. Para ejercerlos,
            escríbanos a{" "}
            <a
              href="mailto:contacto@licoreriasureno.com"
              className="text-secondary underline-offset-4 hover:underline"
            >
              contacto@licoreriasureno.com
            </a>{" "}
            o a través de nuestra página de{" "}
            <a
              href="/support"
              className="text-secondary underline-offset-4 hover:underline"
            >
              Soporte
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection index={8} title="Menores de edad">
          <p>
            Nuestros servicios están dirigidos exclusivamente a personas mayores
            de 18 años. No recopilamos conscientemente datos personales de
            menores de edad. Si detectamos una cuenta de un menor, procederemos
            a su cancelación.
          </p>
        </LegalSection>

        <LegalSection index={9} title="Cambios a esta política">
          <p>
            Podemos actualizar esta política ocasionalmente para reflejar
            cambios en nuestras prácticas o en la normativa aplicable. La
            versión vigente estará siempre publicada en esta página, con su
            fecha de última actualización.
          </p>
        </LegalSection>

        <LegalSection index={10} title="Contacto">
          <p>
            Para consultas sobre esta política de privacidad o sobre el
            tratamiento de sus datos personales, puede contactarnos a través de
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

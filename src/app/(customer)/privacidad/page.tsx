export const metadata = {
  title: "Política de Privacidad — Licorería Sureño",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
          Legal
        </p>
        <h1 className="font-headline text-4xl text-on-surface">
          Política de Privacidad
        </h1>
        <p className="text-sm text-on-surface-variant">
          Última actualización: octubre de 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-on-surface-variant leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            1. Responsable del tratamiento
          </h2>
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
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            2. Datos que recopilamos
          </h2>
          <p>
            <strong className="text-on-surface">Datos de cuenta:</strong>{" "}
            nombre, correo electrónico y contraseña (almacenada de forma
            cifrada).
          </p>
          <p>
            <strong className="text-on-surface">
              Datos de pedido y entrega:
            </strong>{" "}
            nombre completo, empresa y RUC o cédula (opcionales, para compras al
            mayoreo), dirección, ciudad y código postal, junto con el detalle de
            los productos adquiridos.
          </p>
          <p>
            <strong className="text-on-surface">Datos de pago:</strong> método
            de pago utilizado, estado del pago e identificadores de la
            transacción. Los datos de tarjetas de crédito o débito son
            procesados directamente por nuestro proveedor de pagos; la tienda no
            almacena números de tarjeta.
          </p>
          <p>
            <strong className="text-on-surface">
              Datos de uso y preferencias:
            </strong>{" "}
            el contenido de su carrito de compras y su preferencia de tema
            (claro/oscuro) se guardan localmente en su navegador y no se
            transmiten a nuestros servidores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            3. Cómo usamos sus datos
          </h2>
          <p>Utilizamos sus datos personales para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Crear y gestionar su cuenta y autenticar su identidad.</li>
            <li>Procesar sus pedidos, pagos y coordinar las entregas.</li>
            <li>Brindarle atención al cliente y responder sus consultas.</li>
            <li>Garantizar la seguridad del sitio y prevenir fraudes.</li>
            <li>
              Enviarle comunicaciones relacionadas con sus pedidos. No enviamos
              publicidad sin su consentimiento previo.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            4. Con quién compartimos sus datos
          </h2>
          <p>
            No vendemos ni alquilamos sus datos personales. Los compartimos
            únicamente con los proveedores necesarios para operar la tienda:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong className="text-on-surface">Supabase:</strong> proveedor
              de infraestructura que aloja nuestra base de datos y gestiona la
              autenticación.
            </li>
            <li>
              <strong className="text-on-surface">Stripe:</strong> procesamiento
              seguro de pagos con tarjeta.
            </li>
            <li>
              <strong className="text-on-surface">
                Empresas de transporte:
              </strong>{" "}
              datos de entrega necesarios para hacer llegar su pedido.
            </li>
            <li>Autoridades competentes, cuando la ley lo exija.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            5. Conservación de los datos
          </h2>
          <p>
            Conservamos sus datos mientras su cuenta permanezca activa o durante
            el tiempo necesario para cumplir obligaciones legales, contables y
            fiscales. Una vez cumplido ese plazo, los eliminamos o anonimizamos
            de forma segura.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            6. Seguridad
          </h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger
            sus datos: cifrado en tránsito (HTTPS), contraseñas almacenadas con
            algoritmos de hash y acceso restringido a la información únicamente
            al personal autorizado.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            7. Sus derechos
          </h2>
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
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            8. Menores de edad
          </h2>
          <p>
            Nuestros servicios están dirigidos exclusivamente a personas mayores
            de 18 años. No recopilamos conscientemente datos personales de
            menores de edad. Si detectamos una cuenta de un menor, procederemos
            a su cancelación.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            9. Cambios a esta política
          </h2>
          <p>
            Podemos actualizar esta política ocasionalmente para reflejar
            cambios en nuestras prácticas o en la normativa aplicable. La
            versión vigente estará siempre publicada en esta página, con su
            fecha de última actualización.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">
            10. Contacto
          </h2>
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
          </p>
        </section>
      </div>
    </div>
  );
}

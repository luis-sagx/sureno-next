export const metadata = {
  title: "Términos de Servicio — Licorería Sureño",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-label uppercase tracking-[0.2em] text-secondary">
          Legal
        </p>
        <h1 className="font-headline text-4xl text-on-surface">
          Términos de Servicio
        </h1>
        <p className="text-sm text-on-surface-variant">
          Última actualización: junio de 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-on-surface-variant leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio web de Licorería Sureño, usted acepta estar
            sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte
            de los términos, no podrá acceder al servicio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">2. Uso del servicio</h2>
          <p>
            Nuestros servicios están disponibles únicamente para personas mayores de 18 años.
            Al realizar una compra, usted confirma que cumple con este requisito de edad legal
            para la adquisición de bebidas alcohólicas en la República del Ecuador.
          </p>
          <p>
            El uso del sitio con fines ilegales o para distribuir contenido no autorizado
            resulta en la cancelación inmediata de su cuenta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">3. Pedidos y precios</h2>
          <p>
            Los precios indicados en el sitio están en dólares estadounidenses (USD) e
            incluyen IVA según la normativa ecuatoriana vigente. Sureño se reserva el
            derecho de modificar precios sin previo aviso.
          </p>
          <p>
            Los pedidos mayoristas (12 o más unidades por producto) aplican automáticamente
            el precio mayorista correspondiente al momento del checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">4. Envíos y entrega</h2>
          <p>
            Los tiempos de entrega son estimados y pueden variar por factores externos fuera
            de nuestro control (feriados, condiciones climáticas, disponibilidad de transporte).
            No asumimos responsabilidad por demoras ocasionadas por terceros transportistas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">5. Devoluciones</h2>
          <p>
            Aceptamos devoluciones únicamente por productos en mal estado o que no
            correspondan al pedido realizado. El cliente debe notificarnos dentro de las
            48 horas siguientes a la recepción del pedido.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">6. Limitación de responsabilidad</h2>
          <p>
            Licorería Sureño no se responsabiliza por el uso indebido de los productos
            adquiridos. El consumo responsable de bebidas alcohólicas es responsabilidad
            exclusiva del comprador y/o consumidor final.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">7. Contacto</h2>
          <p>
            Para consultas sobre estos términos, puede contactarnos a través de nuestra
            página de{" "}
            <a href="/support" className="text-secondary underline-offset-4 hover:underline">
              Soporte
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

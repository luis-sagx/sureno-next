import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";
import { buttonClass } from "@/components/ui/button-class";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { Check } from "lucide-react";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; metodo?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order || "SNO-00000";
  const isContraentrega = params.metodo === "CONTRAENTREGA";

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(110%_80%_at_50%_-24%,var(--theme-stage-top),transparent_62%)]"
      />

      <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <ClearCartOnSuccess />

        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-line-strong text-secondary">
          <span
            aria-hidden="true"
            className="absolute inset-[-6px] rounded-full border border-line"
          />
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>

        <Eyebrow className="mt-8">Pedido confirmado</Eyebrow>

        <TextReveal
          tag="h1"
          variant="lines"
          align="center"
          className="mt-4 type-title text-on-surface"
        >
          ¡Pedido recibido!
        </TextReveal>

        <div className="mt-8 flex w-full flex-col items-center gap-2 border-y border-line py-6">
          <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
            Número de pedido
          </span>
          <span className="font-headline text-3xl tracking-tight text-on-surface tnum">
            {orderNumber}
          </span>
        </div>

        <p className="mt-8 max-w-prose text-base leading-relaxed text-on-surface-variant">
          {isContraentrega
            ? "Pagarás en efectivo al momento de recibir tu pedido. Nuestro equipo te contactará para coordinar la entrega."
            : "Tu pago fue procesado de forma segura con Stripe. Recibirás un email de confirmación con los detalles de tu pedido."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/catalog" className={buttonClass("primary", "lg")}>
            Seguir comprando
          </Link>
          <Link href="/support" className={buttonClass("secondary", "lg")}>
            Contacto y soporte
          </Link>
        </div>
      </div>
    </div>
  );
}

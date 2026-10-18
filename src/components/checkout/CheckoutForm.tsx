"use client";

import { CheckoutFormWrapper } from "@/components/checkout/CheckoutFormWrapper";
import { CheckoutHiddenFields } from "@/components/checkout/CheckoutHiddenFields";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { Button } from "@/components/ui/Button";
import { submitOrder, type SubmitOrderState } from "@/lib/actions/order";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const initialState: SubmitOrderState = { error: null };

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);

  return (
    <form action={formAction}>
      <CheckoutHiddenFields />

      <div className="flex flex-col gap-10">
        <ShippingForm />
        <CheckoutFormWrapper />
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {state.error && (
          <p
            role="alert"
            className="border-l border-error pl-4 text-sm leading-relaxed text-error"
          >
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Procesando…" : "Completar pedido"}
        </Button>

        <p className="text-center text-xs leading-relaxed text-on-surface-variant">
          Al completar este pedido, aceptas los{" "}
          <Link
            href="/terms"
            className="text-secondary underline-offset-4 hover:underline"
          >
            Términos de Servicio
          </Link>{" "}
          y las regulaciones de distribución de alcohol de Sureño.
        </p>

        <span className="flex items-center justify-center gap-2 font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
          Checkout seguro — tus datos están protegidos
        </span>
      </div>
    </form>
  );
}

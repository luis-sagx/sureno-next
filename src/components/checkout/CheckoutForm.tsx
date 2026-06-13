"use client";

import { CheckoutFormWrapper } from "@/components/checkout/CheckoutFormWrapper";
import { CheckoutHiddenFields } from "@/components/checkout/CheckoutHiddenFields";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { Button } from "@/components/ui/Button";
import { submitOrder, type SubmitOrderState } from "@/lib/actions/order";
import { ShieldCheck } from "lucide-react";
import { useActionState } from "react";

const initialState: SubmitOrderState = { error: null };

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);

  return (
    <form action={formAction}>
      <CheckoutHiddenFields />

      <div className="space-y-8">
        <ShippingForm className="bg-surface-container rounded-lg p-6 border border-outline-variant" />

        <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
          <CheckoutFormWrapper />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {state.error && (
          <p
            role="alert"
            className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
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
          {pending ? "PROCESANDO…" : "COMPLETAR PEDIDO"}
        </Button>

        <p className="text-xs text-on-surface-variant text-center leading-relaxed">
          Al completar este pedido, aceptas los Términos de Servicio y las
          regulaciones de distribución de alcohol de Licorería Sureño.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>Checkout seguro — Tus datos están protegidos</span>
        </div>
      </div>
    </form>
  );
}

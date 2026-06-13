import { CheckoutFormWrapper } from "@/components/checkout/CheckoutFormWrapper";
import { CheckoutHiddenFields } from "@/components/checkout/CheckoutHiddenFields";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/lib/actions/order";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default function CheckoutPage() {
  async function handleCheckout(formData: FormData) {
    "use server";

    const result = await createOrder(formData);

    if (result.success && result.orderNumber) {
      redirect(`/checkout/success?order=${result.orderNumber}`);
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-3xl text-on-surface mb-2">
          Checkout Seguro
        </h1>
        <p className="text-on-surface-variant">
          Completa tu información de envío y método de pago para finalizar tu
          pedido
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left column: Form */}
        <div className="lg:col-span-3 space-y-8">
          <form action={handleCheckout}>
            {/* Hidden fields for cart items */}
            <CheckoutHiddenFields />

            <div className="space-y-8">
              <ShippingForm className="bg-surface-container rounded-lg p-6 border border-outline-variant" />

              <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
                <CheckoutFormWrapper />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 space-y-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                COMPLETAR PEDIDO
              </Button>

              {/* Disclaimer */}
              <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                Al completar este pedido, aceptas los Términos de Servicio y las
                regulaciones de distribución de alcohol de Licorería Sureño.
              </p>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Checkout seguro — Tus datos están protegidos</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-surface-container rounded-lg p-6 border border-outline-variant">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

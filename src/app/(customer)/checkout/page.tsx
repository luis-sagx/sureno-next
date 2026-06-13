import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      <div className="mb-10">
        <h1 className="font-headline text-3xl text-on-surface mb-2">
          Checkout Seguro
        </h1>
        <p className="text-on-surface-variant">
          Completa tu información de envío y método de pago para finalizar tu
          pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <CheckoutForm />
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-surface-container rounded-lg p-6 border border-outline-variant">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

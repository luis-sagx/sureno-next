import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function CheckoutPage() {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(120%_90%_at_50%_-30%,var(--theme-stage-top),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 pb-20 pt-16 md:pt-20">
        <SectionHeading
          eyebrow="Pago y envío"
          title="Finalizar pedido"
          description="Completa tu información de envío y método de pago para finalizar tu pedido."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <CheckoutForm />
          </div>

          <div className="lg:col-span-2">
            <div className="craft sticky top-28 rounded p-6">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

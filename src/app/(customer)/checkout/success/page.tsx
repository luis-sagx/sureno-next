import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; metodo?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order || "SNO-00000";
  const isContraentrega = params.metodo === "CONTRAENTREGA";

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-20">
      <ClearCartOnSuccess />
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-headline text-3xl text-on-surface">
          ¡Pedido Recibido!
        </h1>

        {/* Order number */}
        <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
          <p className="text-sm text-on-surface-variant mb-1">
            Número de Pedido
          </p>
          <p className="font-mono text-xl text-on-surface font-semibold tabular-nums">
            {orderNumber}
          </p>
        </div>

        {/* Confirmation message */}
        <p className="text-on-surface-variant">
          {isContraentrega
            ? "Pagarás en efectivo al momento de recibir tu pedido. Nuestro equipo te contactará para coordinar la entrega."
            : "Tu pago fue procesado de forma segura con Stripe. Recibirás un email de confirmación con los detalles de tu pedido."}
        </p>

        {/* Action */}
        <div className="pt-4">
          <Link href="/catalog">
            <Button variant="primary" size="lg">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

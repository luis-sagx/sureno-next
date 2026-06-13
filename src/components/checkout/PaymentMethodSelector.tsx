"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Truck } from "lucide-react";

type PaymentMethod = "STRIPE" | "CONTRAENTREGA";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  contraentregaAvailable: boolean;
  className?: string;
}

interface MethodCardProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function MethodCard({
  active,
  disabled,
  onClick,
  icon,
  title,
  description,
}: MethodCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
        active
          ? "border-secondary bg-secondary/5"
          : "border-outline-variant bg-surface-container hover:bg-surface-container-high",
        disabled && "opacity-50 cursor-not-allowed hover:bg-surface-container"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          active
            ? "bg-secondary/20 text-secondary"
            : "bg-surface-container-highest text-on-surface-variant"
        )}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
    </button>
  );
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  contraentregaAvailable,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-headline text-lg text-on-surface">Método de Pago</h3>

      <div className="grid gap-3">
        <MethodCard
          active={selected === "STRIPE"}
          onClick={() => onSelect("STRIPE")}
          icon={<CreditCard className="w-5 h-5" />}
          title="Tarjeta de crédito o débito"
          description="Pago seguro procesado por Stripe. Serás redirigido para completar el pago."
        />

        <MethodCard
          active={selected === "CONTRAENTREGA"}
          disabled={!contraentregaAvailable}
          onClick={() => onSelect("CONTRAENTREGA")}
          icon={<Truck className="w-5 h-5" />}
          title="Pago contra entrega"
          description="Paga en efectivo al recibir tu pedido. Exclusivo para pedidos mayoristas."
        />
      </div>

      {!contraentregaAvailable && (
        <p className="text-xs text-on-surface-variant pl-1">
          El pago contra entrega está disponible solo para pedidos mayoristas
          compuestos por cajas de 12 unidades.
        </p>
      )}
    </div>
  );
}

export type { PaymentMethod };

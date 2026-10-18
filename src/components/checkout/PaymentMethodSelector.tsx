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

interface MethodRowProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function MethodRow({
  active,
  disabled,
  onClick,
  icon,
  title,
  description,
}: MethodRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "group flex w-full items-start gap-4 rounded border px-5 py-4 text-left",
        "transition-colors duration-[var(--theme-duration-normal)] ease-entrance",
        active
          ? "border-secondary/70 bg-secondary/5"
          : "border-line bg-surface-container hover:border-line-strong",
        disabled && "cursor-not-allowed opacity-45 hover:border-line"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-[var(--theme-duration-normal)] ease-entrance",
          active
            ? "border-secondary/60 text-secondary"
            : "border-line text-on-surface-variant"
        )}
      >
        {icon}
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="flex items-center gap-2.5 font-headline text-lg text-on-surface">
          {title}
          {active && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rotate-45 bg-secondary"
            />
          )}
        </span>
        <span className="text-sm leading-relaxed text-on-surface-variant">
          {description}
        </span>
      </span>
    </button>
  );
}

/**
 * Step 02 — payment. Two hairline rows; the selected one warms to gold and
 * gets the diamond marker. Contraentrega explains its own restriction.
 */
export function PaymentMethodSelector({
  selected,
  onSelect,
  contraentregaAvailable,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("border-t border-line pt-8", className)}>
      <h2 className="mb-6 font-headline text-xl text-on-surface">
        <span className="index-numeral mr-3 text-sm text-secondary">02</span>
        Método de pago
      </h2>

      <div className="grid gap-3">
        <MethodRow
          active={selected === "STRIPE"}
          onClick={() => onSelect("STRIPE")}
          icon={<CreditCard className="h-5 w-5" aria-hidden="true" />}
          title="Tarjeta de crédito o débito"
          description="Pago seguro procesado por Stripe. Serás redirigido para completar el pago."
        />

        <MethodRow
          active={selected === "CONTRAENTREGA"}
          disabled={!contraentregaAvailable}
          onClick={() => onSelect("CONTRAENTREGA")}
          icon={<Truck className="h-5 w-5" aria-hidden="true" />}
          title="Pago contra entrega"
          description="Paga en efectivo al recibir tu pedido. Exclusivo para pedidos mayoristas."
        />
      </div>

      {!contraentregaAvailable && (
        <p className="mt-4 flex gap-3 border-l border-line-strong pl-4 text-xs leading-relaxed text-on-surface-variant">
          El pago contra entrega está disponible solo para pedidos mayoristas
          compuestos por cajas de 12 unidades.
        </p>
      )}
    </div>
  );
}

export type { PaymentMethod };

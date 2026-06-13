"use client";

import { cn } from "@/lib/utils";
import { CreditCard, FileText } from "lucide-react";

type PaymentMethod = "DIRECT_PAYMENT" | "WHOLESALE_QUOTE";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-headline text-lg text-on-surface">
        Método de Pago
      </h3>

      <div className="grid gap-3">
        {/* Direct Payment */}
        <button
          type="button"
          onClick={() => onSelect("DIRECT_PAYMENT")}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
            selected === "DIRECT_PAYMENT"
              ? "border-secondary bg-secondary/5"
              : "border-outline-variant bg-surface-container hover:bg-surface-container-high"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              selected === "DIRECT_PAYMENT"
                ? "bg-secondary/20 text-secondary"
                : "bg-surface-container-highest text-on-surface-variant"
            )}
          >
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-on-surface">Pago Directo</p>
            <p className="text-sm text-on-surface-variant">
              Paga ahora con tarjeta de crédito o transferencia bancaria para
              pedidos retail
            </p>
          </div>
        </button>

        {/* Wholesale Quote */}
        <button
          type="button"
          onClick={() => onSelect("WHOLESALE_QUOTE")}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
            selected === "WHOLESALE_QUOTE"
              ? "border-secondary bg-secondary/5"
              : "border-outline-variant bg-surface-container hover:bg-surface-container-high"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              selected === "WHOLESALE_QUOTE"
                ? "bg-secondary/20 text-secondary"
                : "bg-surface-container-highest text-on-surface-variant"
            )}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-on-surface">
              Solicitar Cotización Mayorista
            </p>
            <p className="text-sm text-on-surface-variant">
              Para pedidos de gran volumen. Nuestros agentes te contactarán con
              precios personalizados
            </p>
          </div>
        </button>
      </div>

      {/* Card fields (visual only) for Direct Payment */}
      {selected === "DIRECT_PAYMENT" && (
        <div className="space-y-3 pt-2 pl-14">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Número de Tarjeta
            </label>
            <div className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant flex items-center">
              <span className="text-on-surface-variant/50 text-sm">
                0000 0000 0000 0000
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Vencimiento
              </label>
              <div className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant flex items-center">
                <span className="text-on-surface-variant/50 text-sm">
                  MM/AA
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                CVC
              </label>
              <div className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant flex items-center">
                <span className="text-on-surface-variant/50 text-sm">
                  ***
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PaymentMethod };

"use client";

import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import type { PaymentMethod } from "@/components/checkout/PaymentMethodSelector";
import { canPayContraentrega } from "@/lib/payments";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

export function CheckoutFormWrapper() {
  const items = useCartStore((s) => s.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");

  const contraentregaAvailable = canPayContraentrega(items);

  // Derive effective method instead of resetting in an effect.
  // If contraentrega becomes unavailable while selected, fall back to STRIPE
  // without triggering a setState from inside useEffect.
  const effectiveMethod =
    paymentMethod === "CONTRAENTREGA" && !contraentregaAvailable
      ? "STRIPE"
      : paymentMethod;

  return (
    <>
      <PaymentMethodSelector
        selected={effectiveMethod}
        onSelect={setPaymentMethod}
        contraentregaAvailable={contraentregaAvailable}
      />
      <input type="hidden" name="paymentMethod" value={effectiveMethod} />
    </>
  );
}

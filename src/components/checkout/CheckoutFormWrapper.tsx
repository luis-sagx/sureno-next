"use client";

import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import type { PaymentMethod } from "@/components/checkout/PaymentMethodSelector";
import { canPayContraentrega } from "@/lib/payments";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export function CheckoutFormWrapper() {
  const items = useCartStore((s) => s.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");

  const contraentregaAvailable = canPayContraentrega(items);

  useEffect(() => {
    if (paymentMethod === "CONTRAENTREGA" && !contraentregaAvailable) {
      setPaymentMethod("STRIPE");
    }
  }, [paymentMethod, contraentregaAvailable]);

  return (
    <>
      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={setPaymentMethod}
        contraentregaAvailable={contraentregaAvailable}
      />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </>
  );
}

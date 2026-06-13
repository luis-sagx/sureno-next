"use client";

import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import type { PaymentMethod } from "@/components/checkout/PaymentMethodSelector";
import { useState } from "react";

export function CheckoutFormWrapper() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("DIRECT_PAYMENT");

  return (
    <>
      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={setPaymentMethod}
      />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </>
  );
}

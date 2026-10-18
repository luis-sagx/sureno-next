import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface ShippingFormProps {
  className?: string;
}

/**
 * Step 01 — shipping. A hairline-opened fieldset with the shared editorial
 * numeral; the fields themselves carry the house styling.
 */
export function ShippingForm({ className }: ShippingFormProps) {
  return (
    <fieldset className={cn("border-t border-line pt-8", className)}>
      <legend className="mb-6 font-headline text-xl text-on-surface">
        <span className="index-numeral mr-3 text-sm text-secondary">01</span>
        Información de envío
      </legend>

      <div className="space-y-4">
        <Input
          label="Nombre Completo"
          name="fullName"
          placeholder="Ej. Juan Pérez"
          autoComplete="name"
          required
        />

        <Input
          label="Empresa (opcional)"
          name="company"
          placeholder="Ej. Distribuidora del Sur S.A."
          autoComplete="organization"
        />

        <Input
          label="Dirección"
          name="street"
          placeholder="Calle y número"
          autoComplete="street-address"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            name="city"
            placeholder="Ej. Mérida"
            autoComplete="address-level2"
            required
          />

          <Input
            label="Código Postal"
            name="zipCode"
            placeholder="Ej. 97000"
            autoComplete="postal-code"
            inputMode="numeric"
            required
          />
        </div>
      </div>
    </fieldset>
  );
}

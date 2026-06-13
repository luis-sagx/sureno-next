import { Input } from "@/components/ui/Input";

interface ShippingFormProps {
  className?: string;
}

export function ShippingForm({ className }: ShippingFormProps) {
  return (
    <div className={className}>
      <fieldset className="space-y-4">
        <legend className="font-headline text-lg text-on-surface mb-4">
          Información de Envío
        </legend>

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
      </fieldset>
    </div>
  );
}

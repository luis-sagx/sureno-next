"use client";

import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface ShippingFormData {
  fullName: string;
  company: string;
  street: string;
  city: string;
  zipCode: string;
}

interface ShippingFormProps {
  onSubmit?: (data: ShippingFormData) => void;
  className?: string;
}

type FormErrors = Partial<Record<keyof ShippingFormData, string>>;

export function ShippingForm({ onSubmit, className }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: "",
    company: "",
    street: "",
    city: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }
    if (!formData.street.trim()) {
      newErrors.street = "La dirección es requerida";
    }
    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "El código postal es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
    }
  }

  function handleChange(field: keyof ShippingFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <fieldset className="space-y-4">
        <legend className="font-headline text-lg text-on-surface mb-4">
          Información de Envío
        </legend>

        <Input
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
          required
        />

        <Input
          label="Empresa (opcional)"
          placeholder="Ej. Distribuidora del Sur S.A."
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />

        <Input
          label="Dirección"
          placeholder="Calle y número"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          error={errors.street}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            placeholder="Ej. Mérida"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            error={errors.city}
            required
          />

          <Input
            label="Código Postal"
            placeholder="Ej. 97000"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            error={errors.zipCode}
            required
          />
        </div>
      </fieldset>
    </form>
  );
}

export type { ShippingFormData };

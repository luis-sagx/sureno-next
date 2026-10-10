"use client";

import { createProduct, deleteProduct, updateProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  retailPrice: number;
  stockStatus: string;
  volumeMl: number | null;
  abv: number | null;
  type: string;
  category?: { slug: string } | null;
}

interface ProductFormDrawerProps {
  categories: Category[];
  editProduct?: Product | null;
  onClose: () => void;
}

const stockOptions = [
  { value: "HIGH", label: "Stock Alto" },
  { value: "MEDIUM", label: "Stock Medio" },
  { value: "LOW", label: "Stock Bajo" },
  { value: "OUT", label: "Sin Stock" },
];

const typeOptions = [
  { value: "SPIRIT", label: "Destilado" },
  { value: "WINE", label: "Vino" },
  { value: "COCKTAIL", label: "Cóctel" },
  { value: "LIQUEUR", label: "Licor" },
];

export function ProductFormDrawer({ categories, editProduct, onClose }: ProductFormDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isEdit = Boolean(editProduct);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    setError(null);
    startTransition(async () => {
      if (isEdit && editProduct) {
        const result = await updateProduct(editProduct.id, {
          name: fd.get("name") as string,
          description: fd.get("description") as string,
          retailPrice: parseFloat(fd.get("retailPrice") as string),
          stockStatus: fd.get("stockStatus") as string,
        });
        if (!result.success) { setError(result.error ?? "Error"); return; }
      } else {
        const result = await createProduct({
          name: fd.get("name") as string,
          description: fd.get("description") as string,
          retailPrice: parseFloat(fd.get("retailPrice") as string),
          wholesaleBoxPrice: parseFloat(fd.get("wholesaleBoxPrice") as string),
          volumeMl: parseInt(fd.get("volumeMl") as string, 10),
          abv: parseFloat(fd.get("abv") as string),
          type: fd.get("type") as string,
          categorySlug: fd.get("categorySlug") as string,
          stockStatus: (fd.get("stockStatus") as string) || "HIGH",
        });
        if (!result.success) { setError(result.error ?? "Error"); return; }
      }
      router.refresh();
      onClose();
    });
  };

  const handleDelete = () => {
    if (!editProduct) return;
    startTransition(async () => {
      const result = await deleteProduct(editProduct.id);
      if (!result.success) { setError(result.error ?? "Error"); return; }
      router.refresh();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-background border-l border-outline-variant h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-headline text-xl text-on-surface">
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Nombre *
            </label>
            <Input name="name" required defaultValue={editProduct?.name} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editProduct?.description}
              className="w-full rounded-md border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Precio unitario ($) *
              </label>
              <Input
                name="retailPrice"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={editProduct?.retailPrice}
              />
            </div>
            {!isEdit && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Precio caja (12u) ($) *
                </label>
                <Input
                  name="wholesaleBoxPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required={!isEdit}
                />
              </div>
            )}
          </div>

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Volumen (ml) *
                </label>
                <Input name="volumeMl" type="number" min="1" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Graduación (°) *
                </label>
                <Input name="abv" type="number" step="0.1" min="0" max="100" required />
              </div>
            </div>
          )}

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Tipo *
                </label>
                <select
                  name="type"
                  className="w-full h-10 rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {typeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Categoría *
                </label>
                <select
                  name="categorySlug"
                  className="w-full h-10 rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Estado de stock
            </label>
            <select
              name="stockStatus"
              defaultValue={editProduct?.stockStatus ?? "HIGH"}
              className="w-full h-10 rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {stockOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit" variant="primary" size="md" className="flex-1" disabled={isPending}>
              {isPending ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Producto"}
            </Button>
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
          </div>

          {isEdit && (
            <div className="pt-2 border-t border-outline-variant">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar producto
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    ¿Confirmás la eliminación? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="h-8 px-3 text-xs font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="h-8 px-3 text-xs font-semibold rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

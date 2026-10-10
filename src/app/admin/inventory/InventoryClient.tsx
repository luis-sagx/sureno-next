"use client";

import { ProductFormDrawer } from "@/components/admin/ProductFormDrawer";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Edit2, Plus } from "lucide-react";
import { useState } from "react";

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
  imageUrl: string | null;
  category?: { name: string; slug: string } | null;
  brand?: { name: string } | null;
  variants: { stock: number }[];
}

interface InventoryClientProps {
  products: Product[];
  categories: Category[];
}

const stockStatusLabel: Record<string, { label: string; className: string }> = {
  HIGH: { label: "Stock Alto", className: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300" },
  MEDIUM: { label: "Stock Medio", className: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300" },
  LOW: { label: "Stock Bajo", className: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300" },
  OUT: { label: "Sin Stock", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

export function InventoryClient({ products, categories }: InventoryClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const openCreate = () => { setEditProduct(null); setDrawerOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setDrawerOpen(true); };
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-9 px-4 text-xs font-label font-semibold uppercase tracking-wider rounded bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline-variant">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Imagen</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.map((product) => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
              const config = stockStatusLabel[product.stockStatus] ?? stockStatusLabel["MEDIUM"];
              return (
                <tr key={product.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="font-headline text-lg text-on-surface-variant/30 italic">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-on-surface">{product.name}</p>
                    {product.brand && (
                      <p className="text-xs text-on-surface-variant">{product.brand.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-on-surface tabular-nums">
                    {formatPrice(product.retailPrice)}
                  </td>
                  <td className="px-4 py-3 text-on-surface tabular-nums font-medium">
                    {totalStock}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", config.className)}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(product)}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                      aria-label={`Editar ${product.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <ProductFormDrawer
          categories={categories}
          editProduct={editProduct}
          onClose={closeDrawer}
        />
      )}
    </>
  );
}

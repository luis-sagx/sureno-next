"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <EmptyState
        icon={PackageSearch}
        title="Producto no encontrado"
        description="El producto que buscas no existe o ha sido removido de nuestro catálogo."
        actionLabel="Ver Catálogo"
        onAction={() => router.push("/catalog")}
      />
    </div>
  );
}

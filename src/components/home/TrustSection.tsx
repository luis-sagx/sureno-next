import { ShieldCheck, TrendingUp, Truck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Confiabilidad",
    description: "Garantía de autenticidad en cada botella",
  },
  {
    icon: TrendingUp,
    title: "Precio Competitivo",
    description: "Los mejores precios del mercado mayorista",
  },
  {
    icon: Truck,
    title: "Acceso Directo",
    description: "Logística propia con entrega en 24-48 horas",
  },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            <item.icon className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-headline text-xl text-on-surface mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

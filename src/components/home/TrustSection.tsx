import { Reveal } from "@/components/motion/Reveal";
import { Factory, ShieldCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Control y calidad",
    description: "Procesos cuidados y autenticidad en cada presentación que sale de Sureño.",
  },
  {
    icon: Factory,
    title: "Historia local",
    description: "Desde 1998, la marca crece en Quito manteniendo una raíz artesanal y cercana.",
  },
  {
    icon: Truck,
    title: "Compra clara",
    description: "Una misma casa licorera con lectura distinta para compra por unidad o por cajas de 12.",
  },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustItems.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.1}>
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
              <item.icon className="w-10 h-10 text-tertiary mb-4" />
              <h3 className="font-headline text-xl text-on-surface mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

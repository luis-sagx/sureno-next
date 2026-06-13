import { cn } from "@/lib/utils";

type StatusVariant = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const statusConfig: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    className:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300",
  },
  SHIPPED: {
    label: "Enviado",
    className:
      "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
  },
  DELIVERED: {
    label: "Entregado",
    className:
      "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

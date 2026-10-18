"use client";

import { formatPrice } from "@/lib/pricing";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartPoint {
  date: string;
  label: string;
  orders: number;
  revenue: number;
}

export function DashboardCharts({
  data,
  hasOrders,
}: {
  data: DashboardChartPoint[];
  hasOrders: boolean;
}) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2" aria-label="Tendencias de los últimos 30 días">
      <article className="rounded-lg border border-outline-variant bg-surface-container p-5">
        <div className="mb-5">
          <p className="font-label text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            Últimos 30 días
          </p>
          <h2 className="mt-1 font-headline text-xl text-on-surface">Ingresos por día</h2>
        </div>
        {hasOrders ? (
          <div className="h-64 w-full" role="img" aria-label="Gráfica de ingresos diarios en los últimos 30 días">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-outline-variant)" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-on-surface-variant)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={22}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${Math.round(value)}`}
                  tick={{ fill: "var(--color-on-surface-variant)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
                  formatter={(value) => [formatPrice(Number(value)), "Ingresos"]}
                  contentStyle={{
                    backgroundColor: "var(--color-surface-container-highest)",
                    border: "1px solid var(--color-outline-variant)",
                    borderRadius: "4px",
                    color: "var(--color-on-surface)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  activeDot={{ r: 4, fill: "var(--color-primary)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-center">
            <p className="max-w-xs text-sm text-on-surface-variant">
              Aún no hay ingresos registrados en este periodo.
            </p>
          </div>
        )}
      </article>

      <article className="rounded-lg border border-outline-variant bg-surface-container p-5">
        <div className="mb-5">
          <p className="font-label text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            Últimos 30 días
          </p>
          <h2 className="mt-1 font-headline text-xl text-on-surface">Órdenes por día</h2>
        </div>
        {hasOrders ? (
          <div className="h-64 w-full" role="img" aria-label="Gráfica de órdenes diarias en los últimos 30 días">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                <CartesianGrid stroke="var(--color-outline-variant)" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-on-surface-variant)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={22}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--color-on-surface-variant)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
                  formatter={(value) => [Number(value), "Órdenes"]}
                  contentStyle={{
                    backgroundColor: "var(--color-surface-container-highest)",
                    border: "1px solid var(--color-outline-variant)",
                    borderRadius: "4px",
                    color: "var(--color-on-surface)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="var(--color-secondary)" radius={[2, 2, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-center">
            <p className="max-w-xs text-sm text-on-surface-variant">
              Aún no hay órdenes registradas en este periodo.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}

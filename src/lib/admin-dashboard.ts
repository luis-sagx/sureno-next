import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData() {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setUTCDate(periodStart.getUTCDate() - 29);
  periodStart.setUTCHours(0, 0, 0, 0);

  const [periodOrders, activeOrders, recentOrders] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: periodStart } },
      select: { total: true, status: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.count({ where: { status: { in: ["PENDING", "SHIPPED"] } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        fullName: true,
        company: true,
        type: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const daily = new Map<string, { orders: number; revenue: number }>();
  for (let offset = 0; offset < 30; offset += 1) {
    const date = new Date(periodStart);
    date.setUTCDate(date.getUTCDate() + offset);
    daily.set(date.toISOString().slice(0, 10), { orders: 0, revenue: 0 });
  }

  for (const order of periodOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const bucket = daily.get(key);
    if (!bucket) continue;
    bucket.orders += 1;
    if (order.status !== "CANCELLED") bucket.revenue += Number(order.total);
  }

  const chartData = [...daily].map(([date, values]) => ({
    date,
    label: new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }),
    ...values,
  }));
  const revenue = periodOrders.reduce(
    (sum, order) => sum + (order.status === "CANCELLED" ? 0 : Number(order.total)),
    0,
  );
  const validRevenueOrders = periodOrders.filter((order) => order.status !== "CANCELLED");

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: now.toISOString(),
    totalOrders: periodOrders.length,
    activeOrders,
    revenue,
    averageTicket: validRevenueOrders.length ? revenue / validRevenueOrders.length : 0,
    chartData,
    recentOrders: recentOrders.map((order) => ({ ...order, total: Number(order.total) })),
  };
}

"use server";

import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma as PrismaClient } from "@prisma/client";

// ─── Schemas ───────────────────────────────────────────────

const OrderStatusSchema = z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]);
type OrderStatus = z.infer<typeof OrderStatusSchema>;

const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: OrderStatusSchema,
});

const UpdateProductSchema = z.object({
  name: z.string().optional(),
  retailPrice: z.number().positive().optional(),
  stockStatus: z.enum(["HIGH", "MEDIUM", "LOW", "OUT"]).optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
});

// ─── Order Stats ───────────────────────────────────────────

export async function getOrderStats(): Promise<{
  totalRevenue: number;
  activeOrders: number;
  revenueChange: number;
}> {
  // Total revenue: sum of all non-cancelled orders
  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  });

  // Active orders: PENDING + SHIPPED
  const activeOrders = await prisma.order.count({
    where: { status: { in: ["PENDING", "SHIPPED"] } },
  });

  // Revenue from 30 days ago for comparison
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const previousRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      status: { not: "CANCELLED" },
      createdAt: { lt: thirtyDaysAgo },
    },
  });

  const revenue = Number(revenueResult._sum.total ?? 0);
  const prevRevenue = Number(previousRevenue._sum.total ?? 0);
  const revenueChange =
    prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

  return {
    totalRevenue: revenue,
    activeOrders,
    revenueChange: Math.round(revenueChange * 10) / 10,
  };
}

// ─── Order List ─────────────────────────────────────────────

interface GetOrderListFilters {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getOrderList(filters: GetOrderListFilters = {}) {
  const { page = 1, limit = 10, status, dateFrom, dateTo } = filters;

  const where: PrismaClient.OrderWhereInput = {};

  if (status && status !== "Todos") {
    where.status = status as OrderStatus;
  }

  if (dateFrom || dateTo) {
    const dateFilter: PrismaClient.DateTimeFilter = {};
    if (dateFrom) {
      dateFilter.gte = new Date(dateFrom);
    }
    if (dateTo) {
      // Include the full day
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.lte = toDate;
    }
    where.createdAt = dateFilter;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const serialized = serializeDecimal(orders);

  return {
    orders: serialized,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Update Order Status ────────────────────────────────────

interface UpdateOrderResult {
  success: boolean;
  error?: string;
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<UpdateOrderResult> {
  try {
    const parsed = UpdateOrderStatusSchema.safeParse({ orderId, status });

    if (!parsed.success) {
      return { success: false, error: "Estado de orden no válido" };
    }

    await prisma.order.update({
      where: { id: parsed.data.orderId },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar orden";
    return { success: false, error: message };
  }
}

// ─── Products ───────────────────────────────────────────────

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      variants: true,
    },
    orderBy: { name: "asc" },
  });

  return serializeDecimal(products);
}

export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    retailPrice?: number;
    stockStatus?: string;
    description?: string;
    badge?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = UpdateProductSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, error: "Datos de producto no válidos" };
    }

    const updateData = { ...parsed.data } as PrismaClient.ProductUpdateInput;
    if (updateData.retailPrice !== undefined) {
      updateData.retailPrice = updateData.retailPrice;
    }

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath("/admin/inventory");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar producto";
    return { success: false, error: message };
  }
}

// ─── Users ──────────────────────────────────────────────────

interface GetUsersFilters {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export async function getUsers(filters: GetUsersFilters = {}) {
  const { page = 1, limit = 10, type, search } = filters;

  const where: PrismaClient.UserWhereInput = {};

  if (type && type !== "Todos") {
    where.type = type;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const serialized = serializeDecimal(
    users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      type: user.type,
      company: user.company,
      taxId: user.taxId,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orderCount: user._count.orders,
    }))
  );

  return {
    users: serialized,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── User Detail ───────────────────────────────────────────

export async function getUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) return null;

  const serialized = serializeDecimal(user);

  const totalSpent = serialized.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return {
    ...serialized,
    totalSpent,
    orders: serialized.orders.map((o) => ({
      ...o,
      total: Number(o.total),
    })),
    activities: serialized.activities.map((a) => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    })),
  };
}

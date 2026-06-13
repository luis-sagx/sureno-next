import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

// Mock Prisma client
const mockAggregate = vi.fn();
const mockFindMany = vi.fn();
const mockCount = vi.fn();
const mockUpdate = vi.fn();
const mockFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      aggregate: mockAggregate,
      findMany: mockFindMany,
      count: mockCount,
      update: mockUpdate,
      findUnique: mockFindUnique,
    },
    product: {
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/cache
const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

function dec(value: number) {
  return new Prisma.Decimal(value);
}

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrderStats", () => {
    it("returns total revenue, active orders, and revenue change", async () => {
      mockAggregate.mockResolvedValueOnce({ _sum: { total: dec(128450) } });
      mockCount.mockResolvedValueOnce(42);
      mockAggregate.mockResolvedValueOnce({ _sum: { total: dec(114200) } });

      const { getOrderStats } = await import("./admin");
      const stats = await getOrderStats();

      expect(stats.totalRevenue).toBe(128450);
      expect(stats.activeOrders).toBe(42);
      expect(stats.revenueChange).toBeGreaterThan(0);
      expect(mockAggregate).toHaveBeenCalledTimes(2);
    });

    it("handles null aggregates gracefully", async () => {
      mockAggregate.mockResolvedValueOnce({ _sum: { total: null } });
      mockCount.mockResolvedValueOnce(0);
      mockAggregate.mockResolvedValueOnce({ _sum: { total: null } });

      const { getOrderStats } = await import("./admin");
      const stats = await getOrderStats();

      expect(stats.totalRevenue).toBe(0);
      expect(stats.activeOrders).toBe(0);
      expect(stats.revenueChange).toBe(0);
    });
  });

  describe("getOrderList", () => {
    it("returns paginated orders with filters", async () => {
      const mockOrders = [
        {
          id: "order-1",
          orderNumber: "SNO-001",
          fullName: "Juan Pérez",
          company: null,
          street: "Calle 60",
          city: "Mérida",
          zipCode: "97000",
          paymentMethod: "STRIPE",
          retailSubtotal: dec(1700),
          wholesaleSubtotal: null,
          shippingCost: dec(1200),
          total: dec(2900),
          status: "PENDING",
          type: "RETAIL",
          createdAt: new Date("2026-06-01"),
          updatedAt: new Date("2026-06-01"),
          user: { name: "Juan Pérez" },
        },
        {
          id: "order-2",
          orderNumber: "SNO-002",
          fullName: "Empresa Sur",
          company: "Distribuidora Sur",
          street: "Av. Principal",
          city: "Cancún",
          zipCode: "77500",
          paymentMethod: "CONTRAENTREGA",
          retailSubtotal: dec(0),
          wholesaleSubtotal: dec(5000),
          shippingCost: dec(1200),
          total: dec(6200),
          status: "SHIPPED",
          type: "WHOLESALE",
          createdAt: new Date("2026-06-02"),
          updatedAt: new Date("2026-06-03"),
          user: { name: "Carlos López" },
        },
      ];

      mockFindMany.mockResolvedValueOnce(mockOrders);
      mockCount.mockResolvedValueOnce(2);

      const { getOrderList } = await import("./admin");
      const result = await getOrderList({ page: 1, limit: 10 });

      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.orders[0].id).toBe("order-1");
      expect(result.orders[0].total).toBe(2900);
      expect(result.orders[1].total).toBe(6200);
    });

    it("filters orders by status", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      const { getOrderList } = await import("./admin");
      await getOrderList({ page: 1, limit: 10, status: "PENDING" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "PENDING" }),
        })
      );
    });

    it("filters orders by date range", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      const { getOrderList } = await import("./admin");
      await getOrderList({
        page: 1,
        limit: 10,
        dateFrom: "2026-06-01",
        dateTo: "2026-06-05",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
          }),
        })
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("updates order status and revalidates", async () => {
      const mockOrder = {
        id: "order-1",
        orderNumber: "SNO-001",
        status: "SHIPPED",
      };

      mockUpdate.mockResolvedValueOnce(mockOrder);

      const { updateOrderStatus } = await import("./admin");
      const result = await updateOrderStatus("order-1", "SHIPPED");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "SHIPPED" },
      });
      expect(result.success).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalled();
    });

    it("returns error for invalid status", async () => {
      const { updateOrderStatus } = await import("./admin");
      const result = await updateOrderStatus("order-1", "INVALID" as unknown as string);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("getProducts", () => {
    it("returns all products with variants", async () => {
      const { prisma } = await import("@/lib/prisma");
      const mockProductFindMany = prisma.product.findMany as ReturnType<typeof vi.fn>;

      const mockProducts = [
        {
          id: "prod-1",
          slug: "ron-pampero",
          name: "Ron Pampero",
          description: "Ron premium",
          origin: "Venezuela",
          volumeMl: 750,
          abv: dec(40),
          type: "SPIRIT",
          imageUrl: "/ron.jpg",
          badge: null,
          retailPrice: dec(850),
          categoryId: "cat-1",
          brandId: "brand-1",
          aroma: "Dulce",
          palate: "Suave",
          finish: "Largo",
          stockStatus: "HIGH",
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: "cat-1", name: "Ron", slug: "ron", icon: "glass" },
          brand: { id: "brand-1", name: "Pampero", slug: "pampero", imageUrl: null },
          variants: [
            {
              id: "var-1",
              productId: "prod-1",
              label: "750ml",
              price: dec(850),
              stock: 25,
              minOrder: 1,
            },
          ],
        },
      ];

      mockProductFindMany.mockResolvedValueOnce(mockProducts);

      const { getProducts } = await import("./admin");
      const products = await getProducts();

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe("Ron Pampero");
      expect(products[0].retailPrice).toBe(850);
      expect(products[0].variants[0].price).toBe(850);
    });
  });

  describe("getUsers", () => {
    it("returns paginated users with order counts", async () => {
      const { prisma } = await import("@/lib/prisma");
      const mockUserFindMany = prisma.user.findMany as ReturnType<typeof vi.fn>;
      const mockUserCount = prisma.user.count as ReturnType<typeof vi.fn>;

      const mockUsers = [
        {
          id: "user-1",
          email: "juan@test.com",
          name: "Juan Pérez",
          role: "CUSTOMER",
          type: "INDIVIDUAL",
          company: null,
          taxId: null,
          address: "Calle 60, Mérida",
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-06-01"),
          _count: { orders: 5 },
        },
      ];

      mockUserFindMany.mockResolvedValueOnce(mockUsers);
      mockUserCount.mockResolvedValueOnce(1);

      const { getUsers } = await import("./admin");
      const result = await getUsers({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.users[0].name).toBe("Juan Pérez");
      expect(result.users[0].orderCount).toBe(5);
    });

    it("filters users by type", async () => {
      const { prisma } = await import("@/lib/prisma");
      const mockUserFindMany = prisma.user.findMany as ReturnType<typeof vi.fn>;
      const mockUserCount = prisma.user.count as ReturnType<typeof vi.fn>;

      mockUserFindMany.mockResolvedValueOnce([]);
      mockUserCount.mockResolvedValueOnce(0);

      const { getUsers } = await import("./admin");
      await getUsers({ page: 1, limit: 10, type: "WHOLESALE" });

      expect(mockUserFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: "WHOLESALE" }),
        })
      );
    });
  });

  describe("getUserDetail", () => {
    it("returns user with activities", async () => {
      const { prisma } = await import("@/lib/prisma");
      const mockUserFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;

      const mockUser = {
        id: "user-1",
        email: "juan@test.com",
        name: "Juan Pérez",
        role: "CUSTOMER",
        type: "INDIVIDUAL",
        company: "Mi Empresa SA",
        taxId: "TAX123",
        address: "Calle 60, Mérida",
        createdAt: new Date("2026-01-15"),
        updatedAt: new Date("2026-06-01"),
        orders: [
          {
            id: "order-1",
            orderNumber: "SNO-001",
            total: dec(5000),
            status: "DELIVERED",
            createdAt: new Date("2026-06-01"),
          },
        ],
        activities: [
          {
            id: "act-1",
            userId: "user-1",
            action: "Realizó Pedido",
            details: "Pedido #SNO-001",
            createdAt: new Date("2026-06-01T10:00:00Z"),
          },
          {
            id: "act-2",
            userId: "user-1",
            action: "Dirección Actualizada",
            details: null,
            createdAt: new Date("2026-05-15T08:30:00Z"),
          },
        ],
      };

      mockUserFindUnique.mockResolvedValueOnce(mockUser);

      const { getUserDetail } = await import("./admin");
      const user = await getUserDetail("user-1");

      expect(user).not.toBeNull();
      expect(user!.name).toBe("Juan Pérez");
      expect(user!.totalSpent).toBe(5000);
      expect(user!.activities).toHaveLength(2);
    });

    it("returns null when user not found", async () => {
      const { prisma } = await import("@/lib/prisma");
      const mockUserFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;

      mockUserFindUnique.mockResolvedValueOnce(null);

      const { getUserDetail } = await import("./admin");
      const user = await getUserDetail("nonexistent");

      expect(user).toBeNull();
    });
  });
});

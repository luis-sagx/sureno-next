import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

// Mock Prisma client
const mockCreate = vi.fn();
const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
}));

// Mock next/cache
const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Helper to create mock Decimal
function dec(value: number) {
  return new Prisma.Decimal(value);
}

describe("order actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("creates an order with shipping info and cart items", async () => {
      const mockOrder = {
        id: "order-1",
        orderNumber: "SNO-00001",
        fullName: "Juan Pérez",
        company: null,
        street: "Calle 60 #123",
        city: "Mérida",
        zipCode: "97000",
        paymentMethod: "DIRECT_PAYMENT",
        retailSubtotal: dec(1700),
        wholesaleSubtotal: dec(0),
        shippingCost: dec(1200),
        total: dec(2900),
        status: "PENDING",
        type: "RETAIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockOrder);

      const { createOrder } = await import("./order");

      const formData = new FormData();
      formData.append("fullName", "Juan Pérez");
      formData.append("street", "Calle 60 #123");
      formData.append("city", "Mérida");
      formData.append("zipCode", "97000");
      formData.append("paymentMethod", "DIRECT_PAYMENT");
      formData.append(
        "items",
        JSON.stringify([
          {
            variantId: "v1",
            productName: "Ron Pampero",
            variantLabel: "750ml",
            quantity: 2,
            unitPrice: 850,
            type: "RETAIL",
          },
        ])
      );

      const result = await createOrder(formData);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result.orderNumber).toBe("SNO-00001");
      expect(mockRevalidatePath).toHaveBeenCalled();
    });

    it("includes wholesale items in order creation", async () => {
      const mockOrder = {
        id: "order-2",
        orderNumber: "SNO-00002",
        fullName: "Empresa Sur",
        company: "Distribuidora Sur",
        street: "Av. Principal 456",
        city: "Cancún",
        zipCode: "77500",
        paymentMethod: "WHOLESALE_QUOTE",
        retailSubtotal: dec(0),
        wholesaleSubtotal: dec(3000),
        shippingCost: dec(1200),
        total: dec(4200),
        status: "PENDING",
        type: "WHOLESALE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockOrder);

      const { createOrder } = await import("./order");

      const formData = new FormData();
      formData.append("fullName", "Empresa Sur");
      formData.append("company", "Distribuidora Sur");
      formData.append("street", "Av. Principal 456");
      formData.append("city", "Cancún");
      formData.append("zipCode", "77500");
      formData.append("paymentMethod", "WHOLESALE_QUOTE");
      formData.append(
        "items",
        JSON.stringify([
          {
            variantId: "v2",
            productName: "Whisky Premium",
            variantLabel: "Caja 12",
            quantity: 5,
            unitPrice: 600,
            type: "WHOLESALE",
          },
        ])
      );

      const result = await createOrder(formData);

      expect(result.orderNumber).toBe("SNO-00002");
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it("returns error when required fields are missing", async () => {
      const { createOrder } = await import("./order");

      const formData = new FormData();
      formData.append("fullName", "");
      formData.append("street", "");
      formData.append("city", "");
      formData.append("zipCode", "");
      formData.append("paymentMethod", "DIRECT_PAYMENT");
      formData.append("items", JSON.stringify([]));

      const result = await createOrder(formData);

      expect(result).toHaveProperty("error");
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns error when cart items are empty", async () => {
      const { createOrder } = await import("./order");

      const formData = new FormData();
      formData.append("fullName", "Juan Pérez");
      formData.append("street", "Calle 60 #123");
      formData.append("city", "Mérida");
      formData.append("zipCode", "97000");
      formData.append("paymentMethod", "DIRECT_PAYMENT");
      formData.append("items", JSON.stringify([]));

      const result = await createOrder(formData);

      expect(result).toHaveProperty("error");
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("getOrders", () => {
    it("returns a list of orders for a user", async () => {
      const mockOrders = [
        {
          id: "order-1",
          orderNumber: "SNO-00001",
          total: dec(2900),
          status: "PENDING",
          createdAt: new Date(),
          items: [],
        },
      ];

      mockFindMany.mockResolvedValue(mockOrders);

      const { getOrders } = await import("./order");
      const orders = await getOrders("user-1");

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1" },
        })
      );
      expect(orders).toHaveLength(1);
      expect(orders[0].orderNumber).toBe("SNO-00001");
    });

    it("returns an empty array when user has no orders", async () => {
      mockFindMany.mockResolvedValue([]);

      const { getOrders } = await import("./order");
      const orders = await getOrders("user-1");

      expect(orders).toHaveLength(0);
    });
  });

  describe("getOrder", () => {
    it("returns a single order with items", async () => {
      const mockOrder = {
        id: "order-1",
        orderNumber: "SNO-00001",
        fullName: "Juan Pérez",
        street: "Calle 60",
        city: "Mérida",
        zipCode: "97000",
        total: dec(2900),
        status: "PENDING",
        createdAt: new Date(),
        items: [
          {
            id: "oi-1",
            variantId: "v1",
            quantity: 2,
            unitPrice: dec(850),
            type: "RETAIL",
          },
        ],
      };

      mockFindUnique.mockResolvedValue(mockOrder);

      const { getOrder } = await import("./order");
      const order = await getOrder("order-1");

      expect(mockFindUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "order-1" },
        })
      );
      expect(order).not.toBeNull();
      expect(order!.orderNumber).toBe("SNO-00001");
      expect(order!.items).toHaveLength(1);
    });

    it("returns null when order is not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const { getOrder } = await import("./order");
      const order = await getOrder("nonexistent");

      expect(order).toBeNull();
    });
  });
});

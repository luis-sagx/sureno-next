"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CartItemSchema = z.object({
  variantId: z.string().min(1),
  productName: z.string(),
  variantLabel: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  type: z.enum(["RETAIL", "WHOLESALE"]),
});

const CreateOrderSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  company: z.string().optional(),
  street: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  zipCode: z.string().min(1, "El código postal es requerido"),
  paymentMethod: z.enum(["DIRECT_PAYMENT", "WHOLESALE_QUOTE"]),
  items: z.array(CartItemSchema).min(1, "El carrito no puede estar vacío"),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SNO-${timestamp}-${random}`;
}

export async function createOrder(formData: FormData) {
  try {
    const itemsRaw = formData.get("items")?.toString() || "[]";
    const parsedItems = JSON.parse(itemsRaw);

    const data = {
      fullName: formData.get("fullName")?.toString() || "",
      company: formData.get("company")?.toString() || undefined,
      street: formData.get("street")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      zipCode: formData.get("zipCode")?.toString() || "",
      paymentMethod: formData.get("paymentMethod")?.toString() || "",
      items: parsedItems,
    };

    const validated = CreateOrderSchema.parse(data);

    const retailItems = validated.items.filter((i) => i.type === "RETAIL");
    const wholesaleItems = validated.items.filter(
      (i) => i.type === "WHOLESALE"
    );

    const retailSubtotal = retailItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    const wholesaleSubtotal = wholesaleItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    const shippingCost = 1200;
    const total = retailSubtotal + wholesaleSubtotal + shippingCost;

    const orderNumber = generateOrderNumber();
    const orderType =
      wholesaleItems.length > 0 && retailItems.length === 0
        ? "WHOLESALE"
        : "RETAIL";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        fullName: validated.fullName,
        company: validated.company || null,
        street: validated.street,
        city: validated.city,
        zipCode: validated.zipCode,
        paymentMethod: validated.paymentMethod,
        retailSubtotal,
        wholesaleSubtotal:
          wholesaleSubtotal > 0 ? wholesaleSubtotal : null,
        shippingCost,
        total,
        status: "PENDING",
        type: orderType,
        items: {
          create: validated.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            type: item.type,
          })),
        },
      },
    });

    revalidatePath("/checkout");

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de validación";
    return {
      success: false,
      error: message,
    };
  }
}

export async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    ...order,
    retailSubtotal: Number(order.retailSubtotal),
    wholesaleSubtotal: order.wholesaleSubtotal
      ? Number(order.wholesaleSubtotal)
      : null,
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
    })),
  }));
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return null;

  return {
    ...order,
    retailSubtotal: Number(order.retailSubtotal),
    wholesaleSubtotal: order.wholesaleSubtotal
      ? Number(order.wholesaleSubtotal)
      : null,
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
    })),
  };
}

export interface SubmitOrderState {
  error: string | null;
}

export async function submitOrder(
  _prev: SubmitOrderState,
  formData: FormData
): Promise<SubmitOrderState> {
  const result = await createOrder(formData);

  if (result.success && result.orderNumber) {
    redirect(`/checkout/success?order=${result.orderNumber}`);
  }

  return {
    error:
      ("error" in result && result.error) ||
      "No se pudo procesar el pedido. Intenta de nuevo.",
  };
}

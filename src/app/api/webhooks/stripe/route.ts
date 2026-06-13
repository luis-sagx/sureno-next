import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!secret || !signature) {
    return NextResponse.json(
      { error: "Firma de webhook ausente" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json(
      { error: "Firma de webhook inválida" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.order.updateMany({
        where: { stripeSessionId: session.id },
        data: { paymentStatus: "PAID", paidAt: new Date() },
      });
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.order.updateMany({
        where: { stripeSessionId: session.id },
        data: { paymentStatus: "FAILED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

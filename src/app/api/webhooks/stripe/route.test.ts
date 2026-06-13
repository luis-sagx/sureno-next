import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMany, constructEvent } = vi.hoisted(() => ({
  updateMany: vi.fn().mockResolvedValue({ count: 1 }),
  constructEvent: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { order: { updateMany } },
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ webhooks: { constructEvent } }),
}));

import { POST } from "./route";

function makeRequest(body = "{}", signature: string | null = "sig_test") {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers,
    body,
  });
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("returns 400 when the signature header is missing", async () => {
    const res = await POST(makeRequest("{}", null));
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
  });

  it("marks the order as PAID on checkout.session.completed", async () => {
    constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { id: "cs_test_123" } },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(updateMany).toHaveBeenCalledWith({
      where: { stripeSessionId: "cs_test_123" },
      data: { paymentStatus: "PAID", paidAt: expect.any(Date) },
    });
  });

  it("marks the order as FAILED on checkout.session.expired", async () => {
    constructEvent.mockReturnValue({
      type: "checkout.session.expired",
      data: { object: { id: "cs_test_456" } },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(updateMany).toHaveBeenCalledWith({
      where: { stripeSessionId: "cs_test_456" },
      data: { paymentStatus: "FAILED" },
    });
  });
});

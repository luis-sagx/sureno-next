import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn().mockReturnValue({ auth: {} }),
}));

import { createBrowserClient } from "@supabase/ssr";

describe("client.ts — Supabase browser client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  });

  it("createClient returns a browser client with correct params (structural)", async () => {
    const { createClient } = await import("./client");
    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key"
    );
    expect(client).toBeDefined();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @supabase/ssr
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn().mockReturnValue({ auth: { getSession: () => null } }),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { createServerClient } from "@supabase/ssr";

describe("server.ts — Supabase server client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  });

  it("createClient builds a server client with anon key (structural)", async () => {
    const { createClient } = await import("./server");
    const client = await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) })
    );
    expect(client).toBeDefined();
  });

  it("createAdminClient builds a server client with service role key (structural)", async () => {
    const { createAdminClient } = await import("./server");
    const client = await createAdminClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "service-role-key",
      expect.objectContaining({ cookies: expect.any(Object) })
    );
    expect(client).toBeDefined();
  });

  it("createClient uses anon key (not admin key)", async () => {
    const { createClient } = await import("./server");
    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key",
      expect.any(Object)
    );
    // Should NOT be called with service role key
    expect(createServerClient).not.toHaveBeenCalledWith(
      "https://test.supabase.co",
      "service-role-key",
      expect.any(Object)
    );
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

// Mock next/server
const mockNextResponse = {
  next: vi.fn().mockReturnValue({
    cookies: {
      set: vi.fn(),
    },
  }),
  redirect: vi.fn().mockReturnValue("redirected"),
};

vi.mock("next/server", () => ({
  NextResponse: mockNextResponse,
}));

// Mock @supabase/ssr
const mockGetUser = vi.fn();
const mockCreateServerClient = vi.fn().mockReturnValue({
  auth: { getUser: mockGetUser },
});

vi.mock("@supabase/ssr", () => ({
  createServerClient: mockCreateServerClient,
}));

describe("middleware.ts — updateSession", () => {
  let mockRequest: {
    cookies: {
      getAll: ReturnType<typeof vi.fn>;
      set: ReturnType<typeof vi.fn>;
    };
    nextUrl: URL;
    url: string;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    mockRequest = {
      cookies: {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      },
      nextUrl: new URL("http://localhost:3000/test"),
      url: "http://localhost:3000/test",
    };

    mockNextResponse.next.mockReturnValue({
      cookies: { set: vi.fn() },
    });
  });

  it("returns NextResponse.next for unprotected routes when no user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { updateSession } = await import("./middleware");
    const result = await updateSession(mockRequest as unknown as NextRequest);

    expect(result).toBeDefined();
    expect(mockCreateServerClient).toHaveBeenCalled();
    expect(mockNextResponse.redirect).not.toHaveBeenCalled();
  });

  it("redirects to /auth/login when accessing /admin without user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockRequest.nextUrl = new URL("http://localhost:3000/admin/orders");

    const { updateSession } = await import("./middleware");
    await updateSession(mockRequest as unknown as NextRequest);

    expect(mockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/auth/login",
      })
    );
  });

  it("allows access to /admin when user is authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "admin@test.com" } },
    });
    mockRequest.nextUrl = new URL("http://localhost:3000/admin/orders");

    const { updateSession } = await import("./middleware");
    const result = await updateSession(mockRequest as unknown as NextRequest);

    expect(result).toBeDefined();
    expect(mockNextResponse.redirect).not.toHaveBeenCalled();
  });

  it("sets cookies from supabase response", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    mockCreateServerClient.mockImplementation(
      (_url: string, _key: string, opts: { cookies: { setAll: (cookies: Array<{ name: string; value: string; options: { path: string } }>) => void } }) => {
        // Simulate supabase calling setAll with cookies
        opts.cookies.setAll([
          { name: "sb-token", value: "abc", options: { path: "/" } },
        ]);
        return { auth: { getUser: mockGetUser } };
      }
    );

    const mockCookieSet = vi.fn();
    mockNextResponse.next.mockReturnValue({
      cookies: { set: mockCookieSet },
    });

    const { updateSession } = await import("./middleware");
    await updateSession(mockRequest as unknown as NextRequest);

    // Should have called cookies.set on request for each cookie
    expect(mockRequest.cookies.set).toHaveBeenCalledWith("sb-token", "abc");
    // Should have set cookie on response too
    expect(mockCookieSet).toHaveBeenCalledWith("sb-token", "abc", { path: "/" });
  });
});

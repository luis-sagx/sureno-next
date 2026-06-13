import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the supabase server client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
  }),
}));

// Mock next/headers cookies for revalidatePath
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue({
    getAll: vi.fn().mockReturnValue([]),
  }),
}));

// Mock next/cache
const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock next/navigation
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("calls signInWithPassword with email and password from FormData", async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: { id: "user-1", email: "test@test.com" } },
        error: null,
      });

      const { login } = await import("./auth");
      const formData = new FormData();
      formData.append("email", "test@test.com");
      formData.append("password", "password123");

      await login(formData);

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("returns an error message when login fails", async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid login credentials" },
      });

      const { login } = await import("./auth");
      const formData = new FormData();
      formData.append("email", "bad@test.com");
      formData.append("password", "wrong");

      const result = await login(formData);

      expect(result).toEqual(
        expect.objectContaining({
          error: expect.stringContaining("Invalid login credentials"),
        })
      );
    });
  });

  describe("register", () => {
    it("calls signUp with name, email, password from FormData", async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: "new-user", email: "new@test.com" } },
        error: null,
      });

      const { register } = await import("./auth");
      const formData = new FormData();
      formData.append("name", "Juan Pérez");
      formData.append("email", "new@test.com");
      formData.append("password", "securepass");

      await register(formData);

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@test.com",
          password: "securepass",
          options: expect.objectContaining({
            data: expect.objectContaining({ full_name: "Juan Pérez" }),
          }),
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("returns error when signUp fails", async () => {
      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: "User already registered" },
      });

      const { register } = await import("./auth");
      const formData = new FormData();
      formData.append("name", "Existing User");
      formData.append("email", "exists@test.com");
      formData.append("password", "pass123");

      const result = await register(formData);

      expect(result).toEqual(
        expect.objectContaining({
          error: expect.stringContaining("User already registered"),
        })
      );
    });
  });

  describe("logout", () => {
    it("calls signOut and redirects", async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const { logout } = await import("./auth");

      try {
        await logout();
      } catch (e) {
        // redirect throws in test environment
      }

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });
  });

  describe("getSession", () => {
    it("returns the current user session", async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: "user-1", email: "test@test.com" },
          },
        },
        error: null,
      });

      const { getSession } = await import("./auth");
      const result = await getSession();

      expect(result).toEqual({
        user: { id: "user-1", email: "test@test.com" },
      });
    });

    it("returns null when no session exists", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { getSession } = await import("./auth");
      const result = await getSession();

      expect(result).toBeNull();
    });
  });
});

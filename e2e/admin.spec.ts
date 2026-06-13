import { test, expect } from "@playwright/test";

test.describe("Admin Pages (Unauthenticated)", () => {
  test("/admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    // Middleware redirects unauthenticated users from /admin/* to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("/admin/orders redirects to login", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("login page renders correctly after admin redirect", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Iniciar Sesión")).toBeVisible();
  });
});

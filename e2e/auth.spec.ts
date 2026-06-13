import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
  test("login page renders with Iniciar Sesión heading", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(
      page.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeVisible();
  });

  test("register page renders with Crear Cuenta heading", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(
      page.getByRole("heading", { name: /crear cuenta/i })
    ).toBeVisible();
  });

  test("navigation from login to register works", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: /regístrate/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(
      page.getByRole("heading", { name: /crear cuenta/i })
    ).toBeVisible();
  });

  test("navigation from register to login works", async ({ page }) => {
    await page.goto("/auth/register");
    await page.getByRole("link", { name: /iniciar sesión/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(
      page.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeVisible();
  });
});

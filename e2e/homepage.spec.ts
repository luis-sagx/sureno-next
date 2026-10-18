import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders the hero with its CTAs", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("heading", {
      name: /un mismo origen para mayoreo y minorista/i,
    });
    await expect(hero.first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Mayoreo", exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Minorista", exact: true }).first()
    ).toBeVisible();
  });

  test("shows the featured products shelf", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Productos destacados" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^mayoreo$/i }).first()
    ).toBeVisible();
  });

  test("shows the category collection", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Explora nuestra colección" })
    ).toBeVisible();
  });

  test("shows the trust triptych", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Control y calidad" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Compra clara" })
    ).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: /^mayoreo$/i }).click();
    await expect(page).toHaveURL(/\/mayoreo/);
  });

  test("footer is present", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByText("Licorería Sureño").first()).toBeVisible();
    await expect(
      footer.getByText(/todos los derechos reservados/i)
    ).toBeVisible();
  });
});

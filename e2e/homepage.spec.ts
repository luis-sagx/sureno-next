import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders hero section with CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Establecido con Excelencia")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /catálogo mayorista/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /explorar destilados/i })
    ).toBeVisible();
  });

  test("shows category grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Explora Nuestro Catálogo")).toBeVisible();
  });

  test("shows trust section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Confiabilidad")).toBeVisible();
    await expect(page.getByText("Precio Competitivo")).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: /mayoreo/i }).click();
    await page.waitForURL(/catalog/);
  });

  test("footer is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer").getByText("Licorería Sureño")).toBeVisible();
    await expect(
      page.getByText(/todos los derechos reservados/i)
    ).toBeVisible();
  });
});

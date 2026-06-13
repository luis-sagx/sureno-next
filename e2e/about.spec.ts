import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("renders hero section", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Tradición y Calidad")).toBeVisible();
  });

  test("shows Nuestra Historia section", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Nuestra Historia")).toBeVisible();
  });

  test("shows stats: 30+ Años and 1500+ Etiquetas", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("30+")).toBeVisible();
    await expect(page.getByText("Años de Experiencia")).toBeVisible();
    await expect(page.getByText("1500+")).toBeVisible();
    await expect(page.getByText("Etiquetas Exclusivas")).toBeVisible();
  });
});

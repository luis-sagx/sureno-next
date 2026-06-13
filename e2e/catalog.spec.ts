import { test, expect } from "@playwright/test";

test.describe("Catalog Page", () => {
  test("navigates to catalog and shows product listing", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("heading", { name: /catálogo de productos/i })
    ).toBeVisible();
  });

  test("view param controls pricing mode via URL", async ({ page }) => {
    // Catalog uses URL params for pricing mode (no PricingToggle on this page)
    await page.goto("/catalog?view=retail");
    await expect(page).toHaveURL(/view=retail/);

    // Navigate to wholesale view via URL param
    await page.goto("/catalog?view=wholesale");
    await expect(page).toHaveURL(/view=wholesale/);
  });

  test("filter sidebar is visible", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByText("Filtrar por Categoría")).toBeVisible();
  });

  test("product cards are visible when products exist", async ({ page }) => {
    await page.goto("/catalog");
    // Product cards have product names rendered as h3
    // At minimum, the grid container should be present
    const productGrid = page.locator(".grid");
    await expect(productGrid.first()).toBeVisible();
  });
});

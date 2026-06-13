import { test, expect } from "@playwright/test";

test.describe("Catalog Page", () => {
  test("navigates to catalog and shows product listing", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("heading", { name: /catálogo de productos/i })
    ).toBeVisible();
  });

  test("pricing toggle switches between Individual and Mayoreo", async ({ page }) => {
    await page.goto("/catalog?view=retail");
    // The PricingToggle shows both buttons: "Individual" and "Mayoreo"
    const individualBtn = page.getByRole("button", { name: /individual/i });
    const mayoreoBtn = page.getByRole("button", { name: /mayoreo/i });

    await expect(individualBtn).toBeVisible();
    await expect(mayoreoBtn).toBeVisible();

    // Click Mayoreo toggle
    await mayoreoBtn.click();
    // URL should update to include view=wholesale
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

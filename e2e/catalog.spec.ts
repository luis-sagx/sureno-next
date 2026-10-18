import { test, expect } from "@playwright/test";

test.describe("Catalog Page", () => {
  test("navigates to catalog and shows product listing", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("heading", { name: "Catálogo de productos" })
    ).toBeVisible();
  });

  test("filter rail shows categories and price range", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByRole("heading", { name: "Filtros" })).toBeVisible();
    await expect(page.getByText("Categoría", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Aguardientes" })
    ).toBeVisible();
    await expect(page.getByText("Rango de precio")).toBeVisible();
    await expect(
      page.getByRole("spinbutton", { name: "Precio mínimo" })
    ).toBeVisible();
  });

  test("category tile filters the shelf through the URL", async ({ page }) => {
    await page.goto("/catalog");
    const tile = page.getByRole("button", { name: "Aguardientes" });
    await tile.click();
    await expect(page).toHaveURL(/category=aguardientes/);
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("heading", { name: "Aguardientes" })
    ).toBeVisible();
  });

  test("pricing mode travels in the URL", async ({ page }) => {
    await page.goto("/catalog?view=retail");
    const toggle = page.getByRole("group", { name: "Tipo de precio" });
    await toggle.getByRole("link", { name: "Mayoreo" }).click();
    await expect(page).toHaveURL(/view=wholesale/);
    await toggle.getByRole("link", { name: "Individual" }).click();
    await expect(page).not.toHaveURL(/view=wholesale/);
  });

  test("product cards are visible when products exist", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("heading", { level: 3 }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Agregar al carrito" }).first()
    ).toBeVisible();
  });
});

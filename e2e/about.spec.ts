import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("renders the story masthead", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", {
        name: "Una historia nacida en el sur de Quito.",
      })
    ).toBeVisible();
  });

  test("shows mission and vision entries", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Misión" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Visión" })
    ).toBeVisible();
  });

  test("shows products and shipping sections", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Nuestros productos" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Información de envío" })
    ).toBeVisible();
  });

  test("footer shipping link lands on the shipping anchor", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: /información de envío/i }).click();
    await expect(page).toHaveURL(/\/about#shipping$/);
    await expect(page.locator("#shipping")).toBeVisible();
  });
});

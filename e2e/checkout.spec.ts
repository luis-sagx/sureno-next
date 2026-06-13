import { test, expect } from "@playwright/test";

test.describe("Checkout — contraentrega mayorista", () => {
  test("wholesale caja order can be paid contraentrega end to end", async ({
    page,
  }) => {
    // Navigate directly to a known product PDP (catalog cards have no links)
    await page.goto("/product/ron-anejo-extra-viejo");

    // Switch to wholesale (Mayoreo) pricing mode
    await page.getByRole("button", { name: /mayoreo/i }).click();

    // Add a caja (12 units) to cart
    await page.getByRole("button", { name: /agregar al carrito/i }).click();

    // Go to checkout from the cart drawer
    await page.getByRole("link", { name: /ir al checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // Contraentrega must be enabled for a pure-caja cart
    const cod = page.getByRole("button", { name: /contra entrega/i });
    await expect(cod).toBeEnabled();
    await cod.click();

    // Fill shipping and submit
    await page.getByLabel(/nombre completo/i).fill("Juan Pérez");
    await page.getByLabel(/dirección/i).fill("Calle 60 #123");
    await page.getByLabel(/ciudad/i).fill("Mérida");
    await page.getByLabel(/código postal/i).fill("97000");
    await page.getByRole("button", { name: /completar pedido/i }).click();

    await expect(page).toHaveURL(/checkout\/success/);
    await expect(page.getByText(/pagarás en efectivo/i)).toBeVisible();
  });

  test("contraentrega is disabled for retail carts", async ({ page }) => {
    // Navigate directly to a known product PDP
    await page.goto("/product/ron-anejo-extra-viejo");

    // Stay in retail mode (default) and add to cart
    await page.getByRole("button", { name: /agregar al carrito/i }).click();

    // Go to checkout from the cart drawer
    await page.getByRole("link", { name: /ir al checkout/i }).click();

    await expect(
      page.getByRole("button", { name: /contra entrega/i })
    ).toBeDisabled();
  });
});

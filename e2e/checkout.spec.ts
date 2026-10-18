import { test, expect, type Page } from "@playwright/test";

// Checkout sits behind the auth middleware: these tests sign in with a real
// Supabase account. Provide it through the environment so no credentials are
// checked into the repo; the suite skips the flow when they are absent.
const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

async function signIn(page: Page) {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(E2E_EMAIL!);
  await page.getByLabel("Contraseña").fill(E2E_PASSWORD!);
  await page.getByRole("button", { name: /iniciar sesión/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"));
}

test.describe("Checkout — contraentrega mayorista", () => {
  test.skip(
    !E2E_EMAIL || !E2E_PASSWORD,
    "Define E2E_EMAIL y E2E_PASSWORD para cubrir el checkout autenticado."
  );

  test("wholesale caja order can be paid contraentrega end to end", async ({
    page,
  }) => {
    await signIn(page);

    // Known PDP (the catalog cards are not links).
    await page.goto("/product/media-ron-oro");

    // Switch to wholesale (Mayoreo) pricing mode.
    await page.getByRole("button", { name: "Mayoreo" }).click();

    // Add a caja (12 units) to the cart.
    await page.getByRole("button", { name: "Agregar al carrito" }).click();

    // Go to checkout from the cart drawer.
    await page.getByRole("link", { name: /ir al checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // Contraentrega must be enabled for a pure-caja cart.
    const cod = page.getByRole("button", { name: /pago contra entrega/i });
    await expect(cod).toBeEnabled();
    await cod.click();

    // Fill shipping and submit.
    await page.getByLabel(/nombre completo/i).fill("QA Playwright");
    await page.getByLabel(/dirección/i).fill("Calle 60 #123");
    await page.getByLabel(/ciudad/i).fill("Quito");
    await page.getByLabel(/código postal/i).fill("170101");
    await page.getByRole("button", { name: /completar pedido/i }).click();

    await expect(page).toHaveURL(/checkout\/success/);
    await expect(page.getByText(/pagarás en efectivo/i)).toBeVisible();
  });

  test("contraentrega is disabled for retail carts", async ({ page }) => {
    await signIn(page);

    // Stay in retail mode (default) and add to cart.
    await page.goto("/product/media-ron-oro");
    await page.getByRole("button", { name: "Agregar al carrito" }).click();
    await page.getByRole("link", { name: /ir al checkout/i }).click();

    await expect(
      page.getByRole("button", { name: /pago contra entrega/i })
    ).toBeDisabled();
  });
});

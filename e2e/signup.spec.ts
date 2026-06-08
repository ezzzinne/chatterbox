import { expect, test } from "@playwright/test";

test("user can open signup page", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByText(/Create account/i)).toBeVisible();
});

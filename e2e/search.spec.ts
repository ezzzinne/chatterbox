import { expect, test } from "@playwright/test";
import { login } from "./helpers/auth";

test("user can search posts", async ({ page }) => {
  await login(page);

  await page.goto("/dashboard/search?q=test");

  await expect(page).toHaveURL(/\/dashboard\/search\?q=test/);

  await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
});

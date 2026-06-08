import { expect, test } from "@playwright/test";
import { login } from "./helpers/auth";

test("user can write and publish a post", async ({ page }) => {
  await login(page);

  await page.goto("/dashboard/posts/new");

  await page.getByPlaceholder(/Post title/i).fill("My Playwright Test Post");

  await page.getByPlaceholder(/Short excerpt/i).fill("Testing publish flow.");

  const editor = page.locator(".w-md-editor textarea");

  await editor.fill("This is a test post created by Playwright.");

  await page.getByRole("button", { name: "Preview", exact: true }).click();

  await expect(page).toHaveURL(/dashboard\/drafts/);

  await expect(page.getByText("My Playwright Test Post")).toBeVisible();

  await page.getByRole("button", { name: "Publish", exact: true }).click();

  await expect(page).toHaveURL(/dashboard\/articles/);
});

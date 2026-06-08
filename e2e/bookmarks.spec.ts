import { expect, test } from "@playwright/test";
import { login } from "./helpers/auth";

test("user can bookmark a post and see it in bookmarks", async ({ page }) => {
  await login(page);

  const postId = "efb9713f-48e0-46ee-9ea5-072ffd8bd1c6";

  await page.goto(`/dashboard/articles/${postId}`);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("button", { name: "Saved" })).toBeVisible();

  await page.goto("/dashboard/bookmarks");

  await expect(page.getByRole("heading", { name: "Bookmarks" })).toBeVisible();
});

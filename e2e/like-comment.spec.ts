import { expect, test } from "@playwright/test";
import { login } from "./helpers/auth";

test("user can like and comment on a post", async ({ page }) => {
  await login(page);

  const postId = "efb9713f-48e0-46ee-9ea5-072ffd8bd1c6";

  await page.goto(`/dashboard/articles/${postId}`);

  await page.getByRole("button", { name: "Like" }).click();

  await expect(page.getByRole("button", { name: "Liked" })).toBeVisible();

  await page.getByPlaceholder(/Write a comment.../i).fill("Great post!");

  await page.getByRole("button", { name: "Post comment" }).click();

  await expect(page.getByText("Great post!")).toBeVisible();
});

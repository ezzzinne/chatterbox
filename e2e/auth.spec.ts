import { expect, test } from "@playwright/test";

test("auth-protected redirect: unauthenticated user cannot access dashboard", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/login/);
});

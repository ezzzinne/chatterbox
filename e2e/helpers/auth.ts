import { Page, expect } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/login");

  await page.getByLabel(/email/i).fill(process.env.E2E_EMAIL ?? "");

  await page.getByLabel(/password/i).fill(process.env.E2E_PASSWORD ?? "");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

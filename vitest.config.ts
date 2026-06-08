import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    css: true,

    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    exclude: ["node_modules", "e2e", "playwright-report", "test-results"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

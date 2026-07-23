import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["server/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["server/**/*.js"],
      exclude: ["server/**/*.test.js", "server/index.js"],
    },
  },
});

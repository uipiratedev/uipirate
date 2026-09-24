import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    include: [
      "__tests__/lib/analytics/**/*.test.ts",
      "__tests__/lib/auth/**/*.test.ts",
      "__tests__/lib/admin/**/*.test.ts",
      "__tests__/lib/rateLimit.test.ts",
      "__tests__/lib/cssToTailwind.test.ts",
      "__tests__/lib/layeredShadow.test.ts",
      "__tests__/lib/concentricRadius.test.ts",
      "__tests__/lib/squircle.test.ts",
      "__tests__/lib/ssrfGuard.test.ts",
      "__tests__/lib/dashboardAudit.test.ts",
      "__tests__/indexing.test.ts",
    ],
  },
});

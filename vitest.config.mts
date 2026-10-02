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
      "__tests__/lib/readability.test.ts",
      "__tests__/lib/breakpointLayout.test.ts",
      "__tests__/lib/onboardingAudit.test.ts",
      "__tests__/lib/colorContrast.test.ts",
      "__tests__/lib/colorPalette.test.ts",
      "__tests__/lib/spacingScale.test.ts",
      "__tests__/lib/svgOptimizer.test.ts",
      "__tests__/lib/seoMetadata.test.ts",
      "__tests__/lib/geoBenchmark.test.ts",
      "__tests__/lib/marketingSiteAudit.test.ts",
      "__tests__/lib/ctaAnalyzer.test.ts",
      "__tests__/lib/performanceSignals.test.ts",
      "__tests__/indexing.test.ts",
    ],
  },
});

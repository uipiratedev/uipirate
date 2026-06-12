import dbConnect from "./mongodb";

import Admin from "@/models/pirateCOS/Admin";

export class CreditLimitError extends Error {
  public upgradeUrl: string;

  constructor(message: string, upgradeUrl: string) {
    super(message);
    this.name = "CreditLimitError";
    this.upgradeUrl = upgradeUrl;
  }
}

/**
 * Validates and deducts credits for tenant transactions.
 * Bypasses checks if Bring Your Own Key (BYOK) is active for the requested engine.
 *
 * @param tenantId The current logged in Admin ID (acting as tenant boundary)
 * @param actionType The action being performed (blog, seo, enhance, publish, suggest)
 * @param engine The engine being targeted (openai, gemini, mistral, anthropic)
 */
export async function deductCredits(
  tenantId: string,
  actionType: "blog" | "seo" | "enhance" | "publish" | "suggest",
  engine?: "openai" | "gemini" | "mistral" | "anthropic" | "grok" | "openrouter",
): Promise<void> {
  await dbConnect();

  const admin = await Admin.findById(tenantId);

  if (!admin) {
    throw new Error("Tenant context not found");
  }

  const isAIAction = ["blog", "seo", "enhance", "suggest"].includes(actionType);

  // Determine if BYOK is active
  let usesBYOK = false;

  if (isAIAction) {
    const isPremiumPlan = ["pro", "enterprise"].includes(admin.plan || "free");
    if (isPremiumPlan) {
      if (engine && admin.byokEnabled && (admin.byokEnabled as any)[engine]) {
        usesBYOK = true;
      } else if (
        admin.byokEnabled &&
        (admin.byokEnabled.openai ||
          admin.byokEnabled.gemini ||
          admin.byokEnabled.mistral ||
          admin.byokEnabled.anthropic ||
          (admin.byokEnabled as any).grok ||
          (admin.byokEnabled as any).openrouter)
      ) {
        // General fallback if engine not specifically selected but keys exist
        usesBYOK = true;
      }
    }
  }

  // BYOK users enjoy unlimited, direct runs with 0% operational cost to the platform
  if (usesBYOK) {
    console.log(
      `BYOK Active [engine=${engine || "any"}]: Bypassing credit check for tenant ${tenantId}`,
    );

    return;
  }

  // Define credit costs matching the command center rules
  const creditCosts = {
    blog: 5.0,
    seo: 1.0,
    enhance: 0.5,
    publish: 1.0,
    suggest: 0.1,
  };

  const cost = creditCosts[actionType] || 0.5;

  // Enforce strict credit checks on Free tiers
  if (admin.creditsRemaining < cost && admin.plan === "free") {
    throw new CreditLimitError(
      `Insufficient credits. You need ${cost} credits, but currently have ${admin.creditsRemaining.toFixed(1)}.`,
      `/pirateCOS/settings/billing?reason=insufficient_credits&cost=${cost}`,
    );
  }

  // Deduct credits and update monthly telemetry counters
  await Admin.updateOne(
    { _id: tenantId },
    {
      $inc: {
        creditsRemaining: -cost,
        "usageThisMonth.aiRequests": isAIAction ? 1 : 0,
        "usageThisMonth.distributions": actionType === "publish" ? 1 : 0,
      },
    },
  );

  console.log(
    `Deducted ${cost} credits from tenant ${tenantId}. Action: ${actionType}.`,
  );
}

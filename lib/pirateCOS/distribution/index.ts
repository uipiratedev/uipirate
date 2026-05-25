import { decrypt } from "@/lib/pirateCOS/encrypt";
import { IPost } from "@/models/Post";
import Integration, { SupportedPlatform } from "@/models/pirateCOS/Integration";
import { BufferAdapter } from "./adapters/buffer.adapter";
import { GhostAdapter } from "./adapters/ghost.adapter";
import { MediumAdapter } from "./adapters/medium.adapter";
import { WordPressAdapter } from "./adapters/wordpress.adapter";
import { LinkedInAdapter } from "./adapters/linkedin.adapter";
import { DistributionResult, PublishOptions } from "./adapters/base.adapter";

const ADAPTER_MAP: Record<SupportedPlatform, any> = {
  wordpress: WordPressAdapter,
  medium: MediumAdapter,
  ghost: GhostAdapter,
  buffer: BufferAdapter,
  linkedin: LinkedInAdapter,
};

interface DispatchParams {
  post: IPost;
  platforms: SupportedPlatform[];
  options?: PublishOptions;
  tenantId: string;
}

export async function dispatch({
  post,
  platforms,
  options,
  tenantId,
}: DispatchParams): Promise<DistributionResult[]> {
  const promises = platforms.map(async (platform): Promise<DistributionResult> => {
    try {
      const integration = await Integration.findOne({
        tenantId,
        platform,
        isActive: true,
      });

      if (!integration) {
        throw new Error(`${platform.toUpperCase()} integration is not connected or active`);
      }

      const AdapterClass = ADAPTER_MAP[platform];
      if (!AdapterClass) {
        throw new Error(`No adapter found for platform ${platform}`);
      }

      const adapter = new AdapterClass(integration.credentials, decrypt);
      return await adapter.publish(post, options);
    } catch (err: any) {
      return {
        platform,
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: err.message || `Failed to distribute to ${platform}`,
        distributedAt: new Date(),
      };
    }
  });

  const settled = await Promise.allSettled(promises);

  return settled.map((result, index) => {
    const platform = platforms[index];
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        platform,
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: result.reason?.message || `Execution rejected on ${platform}`,
        distributedAt: new Date(),
      };
    }
  });
}

interface VerifyParams {
  platform: SupportedPlatform;
  externalId: string;
  tenantId: string;
}

export async function verifyDistribution({
  platform,
  externalId,
  tenantId,
}: VerifyParams): Promise<{ exists: boolean; errorMessage?: string }> {
  try {
    const integration = await Integration.findOne({
      tenantId,
      platform,
      isActive: true,
    });

    if (!integration) {
      throw new Error(`${platform.toUpperCase()} integration not connected`);
    }

    const AdapterClass = ADAPTER_MAP[platform];
    if (!AdapterClass) {
      throw new Error(`No adapter found for platform ${platform}`);
    }

    const adapter = new AdapterClass(integration.credentials, decrypt);
    return await adapter.verify(externalId);
  } catch (err: any) {
    console.error("Verification engine failed", err);
    return { exists: true }; // Defensive fallback
  }
}

interface DeleteParams {
  platform: SupportedPlatform;
  externalId: string;
  tenantId: string;
}

export async function deleteDistribution({
  platform,
  externalId,
  tenantId,
}: DeleteParams): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const integration = await Integration.findOne({
      tenantId,
      platform,
      isActive: true,
    });

    if (!integration) {
      throw new Error(`${platform.toUpperCase()} integration not connected`);
    }

    const AdapterClass = ADAPTER_MAP[platform];
    if (!AdapterClass) {
      throw new Error(`No adapter found for platform ${platform}`);
    }

    const adapter = new AdapterClass(integration.credentials, decrypt);
    return await adapter.delete(externalId);
  } catch (err: any) {
    console.error("Delete operation failed", err);
    return { success: false, errorMessage: err.message || "Failed to delete from platform" };
  }
}

export type { DistributionResult, PublishOptions };

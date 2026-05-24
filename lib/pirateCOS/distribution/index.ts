import { decrypt } from "@/lib/pirateCOS/encrypt";
import { IPost } from "@/models/Post";
import Integration, { SupportedPlatform } from "@/models/pirateCOS/Integration";
import { BufferAdapter } from "./adapters/buffer.adapter";
import { GhostAdapter } from "./adapters/ghost.adapter";
import { MediumAdapter } from "./adapters/medium.adapter";
import { WordPressAdapter } from "./adapters/wordpress.adapter";
import { DistributionResult, PublishOptions } from "./adapters/base.adapter";

const ADAPTER_MAP: Record<SupportedPlatform, any> = {
  wordpress: WordPressAdapter,
  medium: MediumAdapter,
  ghost: GhostAdapter,
  buffer: BufferAdapter,
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
export type { DistributionResult, PublishOptions };

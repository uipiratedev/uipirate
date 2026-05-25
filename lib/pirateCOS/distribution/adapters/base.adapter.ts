import { IPost } from "@/models/Post";
import { IPlatformCredentials, SupportedPlatform } from "@/models/pirateCOS/Integration";

export interface DistributionResult {
  platform: SupportedPlatform;
  externalId: string;
  url: string;
  status: "success" | "failed";
  errorMessage?: string;
  distributedAt: Date;
}

export interface PublishOptions {
  updateIfExists?: boolean;
  scheduleAt?: string;
}

export abstract class BaseAdapter {
  constructor(
    protected credentials: IPlatformCredentials,
    protected decrypt: (cipher: string) => string,
  ) {}

  abstract publish(post: IPost, options?: PublishOptions): Promise<DistributionResult>;
  abstract update(post: IPost, externalId: string): Promise<DistributionResult>;
  abstract verify(externalId: string): Promise<{ exists: boolean; errorMessage?: string }>;
}

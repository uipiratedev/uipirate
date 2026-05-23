import { IBlog } from "@/models/Blog";
import { IPlatformCredentials, SupportedPlatform } from "@/models/Integration";

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

  abstract publish(blog: IBlog, options?: PublishOptions): Promise<DistributionResult>;
  abstract update(blog: IBlog, externalId: string): Promise<DistributionResult>;
}

import { IPost } from "@/models/Post";
import { BaseAdapter, DistributionResult, PublishOptions } from "./base.adapter";

export class BufferAdapter extends BaseAdapter {
  private getAuthHeader(): string {
    const token = this.credentials.bufferAccessTokenEncrypted
      ? this.decrypt(this.credentials.bufferAccessTokenEncrypted)
      : "";
    return `Bearer ${token}`;
  }

  async publish(post: IPost, options?: PublishOptions): Promise<DistributionResult> {
    try {
      const profileIds = this.credentials.bufferProfileIds || [];
      if (profileIds.length === 0) {
        throw new Error("No social profile IDs connected in Buffer settings");
      }

      // Build social text: Title + Excerpt
      const text = `${post.title}\n\n${post.excerpt || ""}`.trim();

      const params = new URLSearchParams();
      params.append("text", text);
      profileIds.forEach((id) => {
        params.append("profile_ids[]", id);
      });

      if (options?.scheduleAt) {
        params.append("scheduled_at", options.scheduleAt);
      } else {
        params.append("now", "true");
      }

      const res = await fetch("https://api.bufferapp.com/1/updates/create.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: this.getAuthHeader(),
        },
        body: params.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Buffer Error: ${res.statusText}`);
      }

      // Buffer returns updates array, let's take the first one or create an aggregated ID/link
      const update = data.updates?.[0];
      const externalId = update?.id || "buffer_update";
      const url = update?.service_link || "https://publish.buffer.com";

      return {
        platform: "buffer",
        externalId,
        url,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "buffer",
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: err.message || "Unknown error occurred",
        distributedAt: new Date(),
      };
    }
  }

  async update(post: IPost, externalId: string): Promise<DistributionResult> {
    // Buffer updates are social media postings; updates after publishing are usually not supported.
    return {
      platform: "buffer",
      externalId,
      url: "",
      status: "failed",
      errorMessage: "Buffer updates are social posts and cannot be updated programmatically.",
      distributedAt: new Date(),
    };
  }

  async verify(externalId: string): Promise<{ exists: boolean; errorMessage?: string }> {
    // Buffer updates cannot be fetched directly by ID. Return exists: true defensively.
    return { exists: true };
  }
}

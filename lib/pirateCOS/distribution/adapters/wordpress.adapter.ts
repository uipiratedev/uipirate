import {
  BaseAdapter,
  DistributionResult,
  PublishOptions,
} from "./base.adapter";

import { IPost } from "@/models/Post";

export class WordPressAdapter extends BaseAdapter {
  private getApiUrl(endpoint = ""): string {
    let siteUrl = this.credentials.siteUrl || "";

    if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
      siteUrl = `https://${siteUrl}`;
    }
    // Remove trailing slash
    siteUrl = siteUrl.replace(/\/$/, "");

    return `${siteUrl}/wp-json/wp/v2${endpoint}`;
  }

  private getAuthHeader(): string {
    const username = this.credentials.wpUsername || "";
    const appPassword = this.credentials.wpAppPasswordEncrypted
      ? this.decrypt(this.credentials.wpAppPasswordEncrypted)
      : "";
    const credentialsBase64 = Buffer.from(
      `${username}:${appPassword}`,
    ).toString("base64");

    return `Basic ${credentialsBase64}`;
  }

  async publish(
    post: IPost,
    options?: PublishOptions,
  ): Promise<DistributionResult> {
    try {
      // If post already has a WordPress external ID and updateIfExists is true, we update instead of publishing new
      const existingRecord = post.distributionRecords?.find(
        (r) => r.platform === "wordpress" && r.status === "success",
      );

      if (existingRecord?.externalId && options?.updateIfExists) {
        return await this.update(post, existingRecord.externalId);
      }

      const res = await fetch(this.getApiUrl("/posts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          status: "publish", // Publish immediately
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `WordPress Error: ${res.statusText}`);
      }

      return {
        platform: "wordpress",
        externalId: String(data.id),
        url: data.link,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "wordpress",
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: err.message || "Unknown error occurred",
        distributedAt: new Date(),
      };
    }
  }

  async update(post: IPost, externalId: string): Promise<DistributionResult> {
    try {
      const res = await fetch(this.getApiUrl(`/posts/${externalId}`), {
        method: "POST", // WordPress updates posts via POST to /posts/:id or PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          status: "publish",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `WordPress Error: ${res.statusText}`);
      }

      return {
        platform: "wordpress",
        externalId: String(data.id),
        url: data.link,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "wordpress",
        externalId,
        url: "",
        status: "failed",
        errorMessage: err.message || "Failed to update WordPress post",
        distributedAt: new Date(),
      };
    }
  }

  async verify(
    externalId: string,
  ): Promise<{ exists: boolean; errorMessage?: string }> {
    try {
      const res = await fetch(this.getApiUrl(`/posts/${externalId}`), {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
        },
      });

      if (res.status === 404) {
        return {
          exists: false,
          errorMessage: "Post was deleted on WordPress.",
        };
      }

      return {
        exists: res.ok,
        errorMessage: res.ok
          ? undefined
          : "Post verification probe returned failure status.",
      };
    } catch (err: any) {
      return { exists: true };
    }
  }
}

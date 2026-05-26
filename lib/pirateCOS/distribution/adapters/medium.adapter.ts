import { htmlToMarkdown } from "../transform/html-to-markdown";

import {
  BaseAdapter,
  DistributionResult,
  PublishOptions,
} from "./base.adapter";

import { IPost } from "@/models/Post";

export class MediumAdapter extends BaseAdapter {
  private getAuthHeader(): string {
    const token = this.credentials.mediumTokenEncrypted
      ? this.decrypt(this.credentials.mediumTokenEncrypted)
      : "";

    return `Bearer ${token}`;
  }

  private async fetchAuthorId(): Promise<string> {
    const res = await fetch("https://api.medium.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch Medium profile data",
      );
    }

    return data.data?.id;
  }

  async publish(
    post: IPost,
    options?: PublishOptions,
  ): Promise<DistributionResult> {
    try {
      let authorId = this.credentials.mediumAuthorId?.trim();

      if (!authorId) {
        authorId = await this.fetchAuthorId();
      }

      const markdownContent = htmlToMarkdown(post.content);

      const res = await fetch(
        `https://api.medium.com/v1/users/${authorId}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            contentFormat: "markdown",
            content: `# ${post.title}\n\n${markdownContent}`,
            tags: post.tags || [],
            publishStatus: "public",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.errors?.[0]?.message || `Medium Error: ${res.statusText}`,
        );
      }

      return {
        platform: "medium",
        externalId: data.data.id,
        url: data.data.url,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "medium",
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: err.message || "Unknown error occurred",
        distributedAt: new Date(),
      };
    }
  }

  async update(post: IPost, externalId: string): Promise<DistributionResult> {
    // Medium API does not officially support editing/updating posts programmatically after publication.
    // So we return a message indicating updates must be done directly.
    return {
      platform: "medium",
      externalId,
      url: "",
      status: "failed",
      errorMessage:
        "Medium API does not support post updates programmatically.",
      distributedAt: new Date(),
    };
  }

  async verify(
    externalId: string,
  ): Promise<{ exists: boolean; errorMessage?: string }> {
    // Medium API does not support fetching posts by ID. We return exists: true defensively.
    return { exists: true };
  }
}

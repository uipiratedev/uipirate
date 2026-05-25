import { IPost } from "@/models/Post";
import { BaseAdapter, DistributionResult, PublishOptions } from "./base.adapter";

export class LinkedInAdapter extends BaseAdapter {
  private getAuthHeader(): string {
    const token = this.credentials.linkedinTokenEncrypted
      ? this.decrypt(this.credentials.linkedinTokenEncrypted)
      : "";
    return `Bearer ${token}`;
  }

  private async fetchMemberId(): Promise<string> {
    // Attempt standard OpenID Connect userinfo or standard /v2/me profile call
    try {
      const res = await fetch("https://api.linkedin.com/v2/userinfo", {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sub) {
          return data.sub; // OpenID Connect unique subject identifier
        }
      }
    } catch (e) {
      // Fall back to /v2/me
    }

    const res = await fetch("https://api.linkedin.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch LinkedIn profile ID");
    }

    return data.id;
  }

  async publish(post: IPost, options?: PublishOptions): Promise<DistributionResult> {
    try {
      let memberId = this.credentials.linkedinUserId?.trim();
      if (!memberId) {
        memberId = await this.fetchMemberId();
      }

      // Clean HTML tags from content/excerpt for commentary text
      const cleanExcerpt = post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 300).trim() + "...";
      const hashtags = post.tags?.length
        ? "\n\n" + post.tags.slice(0, 5).map(tag => `#${tag.replace(/\s/g, "")}`).join(" ")
        : "";

      const commentary = `${post.title}\n\n${cleanExcerpt}${hashtags}`;

      // Decide whether to publish as Article or standard short-form Post
      const preferArticles = this.credentials.linkedinPreferArticles !== false;
      const canonicalUrl = post.seo?.canonicalUrl || "";

      let requestBody: Record<string, any>;

      if (preferArticles && canonicalUrl) {
        requestBody = {
          author: `urn:li:person:${memberId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: commentary,
              },
              shareMediaCategory: "ARTICLE",
              media: [
                {
                  status: "READY",
                  description: {
                    text: cleanExcerpt,
                  },
                  originalUrl: canonicalUrl,
                  title: {
                    text: post.title,
                  },
                },
              ],
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        };
      } else {
        requestBody = {
          author: `urn:li:person:${memberId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: commentary,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        };
      }

      const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `LinkedIn Error: ${res.statusText}`);
      }

      // Extract generated Post/UGC ID and construct a clean url
      const externalId = data.id || "";
      const url = externalId ? `https://www.linkedin.com/feed/update/${externalId}` : "";

      return {
        platform: "linkedin",
        externalId,
        url,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "linkedin",
        externalId: "",
        url: "",
        status: "failed",
        errorMessage: err.message || "Unknown error occurred",
        distributedAt: new Date(),
      };
    }
  }

  async update(post: IPost, externalId: string): Promise<DistributionResult> {
    // LinkedIn UGC/Share API does not support post updates programmatically.
    return {
      platform: "linkedin",
      externalId,
      url: `https://www.linkedin.com/feed/update/${externalId}`,
      status: "failed",
      errorMessage: "LinkedIn API does not support post updates programmatically.",
      distributedAt: new Date(),
    };
  }
}

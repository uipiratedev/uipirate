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
          commentary: commentary,
          visibility: "PUBLIC",
          distribution: {
            feedDistribution: "MAIN_FEED",
          },
          content: {
            article: {
              source: canonicalUrl,
              title: post.title,
              description: cleanExcerpt,
            },
          },
          lifecycleState: "PUBLISHED",
        };
      } else {
        requestBody = {
          author: `urn:li:person:${memberId}`,
          commentary: commentary,
          visibility: "PUBLIC",
          distribution: {
            feedDistribution: "MAIN_FEED",
          },
          lifecycleState: "PUBLISHED",
        };
      }

      const res = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
          "LinkedIn-Version": "202605",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        let errorMsg = `LinkedIn Error: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (_) {
          // Ignore json parse error
        }
        throw new Error(errorMsg);
      }

      // Extract generated Post URN from x-restli-id header
      const externalId = res.headers.get("x-restli-id") || "";
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
    // LinkedIn REST Posts API does not support post updates programmatically.
    return {
      platform: "linkedin",
      externalId,
      url: `https://www.linkedin.com/feed/update/${externalId}`,
      status: "failed",
      errorMessage: "LinkedIn API does not support post updates programmatically.",
      distributedAt: new Date(),
    };
  }

  async verify(externalId: string): Promise<{ exists: boolean; errorMessage?: string }> {
    try {
      const res = await fetch(`https://api.linkedin.com/rest/posts/${encodeURIComponent(externalId)}`, {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
          "LinkedIn-Version": "202605",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      console.log(`[LinkedIn Verify] Probing externalId: ${externalId}, HTTP Status: ${res.status}`);

      if (res.status === 404 || res.status === 410) {
        console.log(`[LinkedIn Verify] Post is confirmed deleted (status ${res.status})`);
        return { exists: false, errorMessage: "Post was deleted or is no longer accessible on LinkedIn." };
      }

      if (res.status === 403 || res.status === 401) {
        console.log(`[LinkedIn Verify] Access restricted (status ${res.status}). Treating as exists defensively.`);
        return { exists: true };
      }

      let data: any = {};
      try {
        const text = await res.text();
        console.log(`[LinkedIn Verify] Response body:`, text);
        if (text) {
          data = JSON.parse(text);
        }
      } catch (e) {
        console.log(`[LinkedIn Verify] Failed to read or parse response body:`, e);
      }

      if (!res.ok) {
        throw new Error(data.message || `LinkedIn Error: ${res.statusText}`);
      }

      const isDeleted = data.lifecycleState === "DELETED";
      console.log(`[LinkedIn Verify] Lifecycle state: ${data.lifecycleState}, isDeleted: ${isDeleted}`);
      return { exists: !isDeleted, errorMessage: isDeleted ? "Post was deleted on LinkedIn." : undefined };
    } catch (err: any) {
      console.error("LinkedIn verification probe failed:", err);
      const errMsg = String(err.message || err).toLowerCase();
      if (
        errMsg.includes("does not exist") ||
        errMsg.includes("not found") ||
        errMsg.includes("deleted") ||
        errMsg.includes("404")
      ) {
        return { exists: false, errorMessage: "Post was deleted or is no longer accessible on LinkedIn." };
      }
      // Return true defensively for transient network errors
      return { exists: true };
    }
  }
}


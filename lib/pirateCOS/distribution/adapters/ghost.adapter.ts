import jwt from "jsonwebtoken";
import { IPost } from "@/models/Post";
import { BaseAdapter, DistributionResult, PublishOptions } from "./base.adapter";

export class GhostAdapter extends BaseAdapter {
  private getApiUrl(endpoint = ""): string {
    let siteUrl = this.credentials.ghostSiteUrl || "";
    if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
      siteUrl = `https://${siteUrl}`;
    }
    siteUrl = siteUrl.replace(/\/$/, "");
    // Default Ghost admin API path is /ghost/api/admin
    return `${siteUrl}/ghost/api/admin${endpoint}`;
  }

  private getJWT(): string {
    const adminKey = this.credentials.ghostAdminKeyEncrypted
      ? this.decrypt(this.credentials.ghostAdminKeyEncrypted)
      : "";

    const parts = adminKey.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid Ghost Admin API Key format — expected id:secret.");
    }

    const [id, secret] = parts;

    // Sign the JWT using the secret parsed as hex bytes
    return jwt.sign({}, Buffer.from(secret, "hex"), {
      keyid: id,
      algorithm: "HS256",
      expiresIn: "5m",
      audience: "/admin/",
    });
  }

  async publish(post: IPost, options?: PublishOptions): Promise<DistributionResult> {
    try {
      const token = this.getJWT();

      const existingRecord = post.distributionRecords?.find(
        (r) => r.platform === "ghost" && r.status === "success",
      );

      if (existingRecord?.externalId && options?.updateIfExists) {
        return await this.update(post, existingRecord.externalId);
      }

      // Ghost allows HTML intake via ?source=html query parameter
      const res = await fetch(this.getApiUrl("/posts/?source=html"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Ghost ${token}`,
        },
        body: JSON.stringify({
          posts: [
            {
              title: post.title,
              html: post.content,
              custom_excerpt: post.excerpt || "",
              status: "published", // Publish immediately
              tags: post.tags || [],
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || `Ghost Error: ${res.statusText}`);
      }

      const ghostPost = data.posts?.[0];
      if (!ghostPost) {
        throw new Error("No post returned from Ghost Admin API");
      }

      return {
        platform: "ghost",
        externalId: ghostPost.id,
        url: ghostPost.url,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "ghost",
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
      const token = this.getJWT();

      // Retrieve post first to obtain the latest updatedAt/revision timestamp, as Ghost API requires it
      const getRes = await fetch(this.getApiUrl(`/posts/${externalId}/`), {
        method: "GET",
        headers: {
          Authorization: `Ghost ${token}`,
        },
      });

      const getData = await getRes.json();
      if (!getRes.ok) {
        throw new Error(getData.errors?.[0]?.message || "Failed to retrieve existing Ghost post");
      }

      const existingPost = getData.posts?.[0];
      if (!existingPost) {
        throw new Error("Existing Ghost post not found");
      }

      // Update post using PUT and ?source=html
      const res = await fetch(this.getApiUrl(`/posts/${externalId}/?source=html`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Ghost ${token}`,
        },
        body: JSON.stringify({
          posts: [
            {
              title: post.title,
              html: post.content,
              custom_excerpt: post.excerpt || "",
              updated_at: existingPost.updated_at, // Send to prevent edit conflicts
              tags: post.tags || [],
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || `Ghost Error: ${res.statusText}`);
      }

      const ghostPost = data.posts?.[0];

      return {
        platform: "ghost",
        externalId: ghostPost.id,
        url: ghostPost.url,
        status: "success",
        distributedAt: new Date(),
      };
    } catch (err: any) {
      return {
        platform: "ghost",
        externalId,
        url: "",
        status: "failed",
        errorMessage: err.message || "Failed to update Ghost post",
        distributedAt: new Date(),
      };
    }
  }

  async verify(externalId: string): Promise<{ exists: boolean; errorMessage?: string }> {
    try {
      const token = this.getJWT();
      const res = await fetch(this.getApiUrl(`/posts/${externalId}/`), {
        method: "GET",
        headers: {
          Authorization: `Ghost ${token}`,
        },
      });

      if (res.status === 404) {
        return { exists: false, errorMessage: "Post was deleted on Ghost." };
      }

      return { exists: res.ok, errorMessage: res.ok ? undefined : "Ghost post verification probe returned failure status." };
    } catch (err: any) {
      return { exists: true };
    }
  }
}

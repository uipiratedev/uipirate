import jwt from "jsonwebtoken";
import { IBlog } from "@/models/Blog";
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

  async publish(blog: IBlog, options?: PublishOptions): Promise<DistributionResult> {
    try {
      const token = this.getJWT();

      const existingRecord = blog.distributionRecords?.find(
        (r) => r.platform === "ghost" && r.status === "success",
      );

      if (existingRecord?.externalId && options?.updateIfExists) {
        return await this.update(blog, existingRecord.externalId);
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
              title: blog.title,
              html: blog.content,
              custom_excerpt: blog.excerpt || "",
              status: "published", // Publish immediately
              tags: blog.tags || [],
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || `Ghost Error: ${res.statusText}`);
      }

      const post = data.posts?.[0];
      if (!post) {
        throw new Error("No post returned from Ghost Admin API");
      }

      return {
        platform: "ghost",
        externalId: post.id,
        url: post.url,
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

  async update(blog: IBlog, externalId: string): Promise<DistributionResult> {
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
              title: blog.title,
              html: blog.content,
              custom_excerpt: blog.excerpt || "",
              updated_at: existingPost.updated_at, // Send to prevent edit conflicts
              tags: blog.tags || [],
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || `Ghost Error: ${res.statusText}`);
      }

      const post = data.posts?.[0];

      return {
        platform: "ghost",
        externalId: post.id,
        url: post.url,
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
}

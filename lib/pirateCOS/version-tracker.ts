/**
 * Phase 4F.2: Version Tracker
 * 
 * Git-style version control utilities for content history
 * Provides snapshot creation, diff calculation, and version restoration
 */

import mongoose from "mongoose";
import ContentHistory, { IContentHistory } from "@/models/pirateCOS/ContentHistory";
import Post from "@/models/Post";

/**
 * Create a content snapshot (version)
 * 
 * @param postId - Post ID
 * @param content - Current content (HTML)
 * @param tenantId - Tenant ID
 * @param changedBy - User ID or "ai"
 * @param changeType - Type of change
 * @param options - Additional metadata
 * @returns Created version document
 */
export async function createSnapshot(
  postId: string,
  content: string,
  tenantId: string,
  changedBy: string,
  changeType: IContentHistory["changeType"],
  options?: {
    commitMessage?: string;
    title?: string;
    postType?: string;
    aiMetadata?: {
      generationId?: string;
      action?: string;
      model?: string;
      provider?: string;
      tokensUsed?: number;
    };
  }
): Promise<IContentHistory> {
  // Get the latest version number for this post
  const latestVersion = await ContentHistory.findOne({ postId })
    .sort({ version: -1 })
    .select("version snapshot");

  // Skip duplicate snapshots: if content is identical to the latest version,
  // return the existing version instead of creating a redundant entry.
  // This guards against frequent autosaves / no-op PATCH calls.
  if (latestVersion && latestVersion.snapshot === content) {
    const existing = await ContentHistory.findOne({
      postId,
      version: latestVersion.version,
    });
    if (existing) {
      return existing;
    }
  }

  const newVersion = latestVersion ? latestVersion.version + 1 : 1;

  // Calculate diff if there's a previous version
  let diff: string | undefined;
  let charDelta: number | undefined;

  if (latestVersion) {
    diff = calculateDiff(latestVersion.snapshot, content);
    charDelta = content.length - latestVersion.snapshot.length;
  }

  // Create the new version
  const snapshot = await ContentHistory.create({
    postId: new mongoose.Types.ObjectId(postId),
    tenantId: new mongoose.Types.ObjectId(tenantId),
    version: newVersion,
    snapshot: content,
    diff,
    charDelta,
    changedBy: changedBy === "ai" ? "ai" : new mongoose.Types.ObjectId(changedBy),
    changeType,
    commitMessage: options?.commitMessage,
    title: options?.title,
    postType: options?.postType,
    aiMetadata: options?.aiMetadata,
    timestamp: new Date(),
  });

  return snapshot;
}

/**
 * Calculate unified diff between old and new content
 * 
 * Simple implementation using line-based diff
 * For production, consider using a library like 'diff' for better results
 * 
 * @param oldContent - Previous content
 * @param newContent - New content
 * @returns Unified diff string
 */
export function calculateDiff(oldContent: string, newContent: string): string {
  // Simple line-based diff
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  const diffLines: string[] = [];
  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] || "";
    const newLine = newLines[i] || "";

    if (oldLine !== newLine) {
      if (oldLine) {
        diffLines.push(`- ${oldLine}`);
      }
      if (newLine) {
        diffLines.push(`+ ${newLine}`);
      }
    }
  }

  return diffLines.length > 0 ? diffLines.join("\n") : "No changes";
}

/**
 * Get version history for a post
 * 
 * @param postId - Post ID
 * @param limit - Maximum number of versions to return (default: 50)
 * @returns Array of version documents
 */
export async function getVersionHistory(
  postId: string,
  limit: number = 50
): Promise<any[]> {
  return await ContentHistory.find({ postId })
    .sort({ version: -1 })
    .limit(limit)
    .lean();
}

/**
 * Restore a specific version
 * 
 * Creates a new version with the content from the specified version
 * 
 * @param postId - Post ID
 * @param version - Version number to restore
 * @param tenantId - Tenant ID
 * @param restoredBy - User ID performing the restore
 * @returns New version document
 */
export async function restoreVersion(
  postId: string,
  version: number,
  tenantId: string,
  restoredBy: string
): Promise<{ post: any; snapshot: IContentHistory }> {
  // Find the version to restore
  const versionToRestore = await ContentHistory.findOne({ postId, version });

  if (!versionToRestore) {
    throw new Error(`Version ${version} not found for post ${postId}`);
  }

  // Update the post with the restored content
  const post = await Post.findByIdAndUpdate(
    postId,
    { content: versionToRestore.snapshot },
    { new: true }
  );

  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  // Create a new snapshot marking this as a restore
  const snapshot = await createSnapshot(
    postId,
    versionToRestore.snapshot,
    tenantId,
    restoredBy,
    "restore",
    {
      commitMessage: `Restored from version ${version}`,
      title: post.title,
      postType: post.postType,
    }
  );

  return { post, snapshot };
}

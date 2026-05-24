import { createHash } from "crypto";

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import ViewLog from "@/models/ViewLog";

// Known bot/crawler User-Agent patterns — these are never counted as views
const BOT_PATTERN =
  /bot|crawler|spider|scraper|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|DuckDuckBot|baiduspider|yandexbot|sogou|exabot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|BingPreview|Googlebot|bingbot|slurp|facebookexternalhit/i;

/**
 * Extracts the real client IP from request headers.
 * Priority order handles CDN/proxy chains (Cloudflare, nginx, etc.)
 */
function extractIp(headers: ReadonlyHeaders): string {
  // Cloudflare — most reliable when behind CF
  const cfIp = headers.get("cf-connecting-ip");

  if (cfIp) return cfIp.trim();

  // Standard proxy forward — take first IP (original client)
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    const first = forwardedFor.split(",")[0].trim();

    if (first) return first;
  }

  // nginx real IP header
  const realIp = headers.get("x-real-ip");

  if (realIp) return realIp.trim();

  // Vercel-specific
  const vercelIp = headers.get("x-vercel-forwarded-for");

  if (vercelIp) return vercelIp.split(",")[0].trim();

  // Fallback for local dev
  return "127.0.0.1";
}

/**
 * One-way SHA-256 hash of an IP address.
 * This means we never store raw IPs — only an irreversible fingerprint.
 */
function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * Checks if the User-Agent is a known bot/crawler.
 */
function isBot(headers: ReadonlyHeaders): boolean {
  const ua = headers.get("user-agent") || "";

  return BOT_PATTERN.test(ua);
}

/**
 * Tracks a view for a blog post with full analytics breakdown.
 *
 * Increments one or more of these counters on the Post document:
 *   - totalViews  — always incremented (every raw hit)
 *   - botViews    — incremented when User-Agent matches a known crawler
 *   - views       — incremented only for unique human visitors (new IP+slug in 24h)
 *   - duplicateViews — incremented for repeat human visitors (same IP, within 24h)
 *
 * @param slug     - the blog slug being viewed
 * @param headers  - Next.js ReadonlyHeaders from headers()
 * @param isAdmin  - admin views are never tracked
 */
export async function trackView(
  slug: string,
  headers: ReadonlyHeaders,
  isAdmin = false,
): Promise<void> {
  try {
    // Never track admin previews
    if (isAdmin) return;

    const normalizedSlug = slug.toLowerCase();

    await dbConnect();

    // ── Bot traffic ──────────────────────────────────────────────────────
    if (isBot(headers)) {
      // Count bot hits separately — never touch unique views
      await Post.findOneAndUpdate(
        { slug: normalizedSlug },
        { $inc: { botViews: 1, totalViews: 1 } },
      );

      return;
    }

    // ── Human traffic — deduplicate by hashed IP ─────────────────────────
    const ip = extractIp(headers);
    const ipHash = hashIp(ip);

    try {
      // Atomic insert: succeeds only if this IP hasn't visited this slug in 24h
      await ViewLog.create({
        ipHash,
        slug: normalizedSlug,
        viewedAt: new Date(),
      });

      // ✅ Unique visit — increment unique views + total
      await Post.findOneAndUpdate(
        { slug: normalizedSlug },
        { $inc: { views: 1, totalViews: 1 } },
      );
    } catch (err: any) {
      if (err?.code === 11000) {
        // 🔁 Duplicate visit (same IP within 24h) — count separately
        await Post.findOneAndUpdate(
          { slug: normalizedSlug },
          { $inc: { duplicateViews: 1, totalViews: 1 } },
        );
      } else {
        throw err;
      }
    }
  } catch {
    // View tracking must never crash the page render
  }
}

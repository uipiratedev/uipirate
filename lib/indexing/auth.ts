import * as jose from "jose";

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

const tokenCache = new Map<string, CachedToken>();

export function getParsedServiceAccount(): ServiceAccountKey | null {
  const raw =
    process.env.GOOGLE_INDEXING_SA_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    let jsonStr = raw.trim();
    // Handle base64 encoded JSON
    if (!jsonStr.startsWith("{")) {
      jsonStr = Buffer.from(jsonStr, "base64").toString("utf-8");
    }
    const parsed = JSON.parse(jsonStr);
    if (!parsed.client_email || !parsed.private_key) {
      console.warn("GOOGLE_INDEXING_SA_JSON is missing client_email or private_key");
      return null;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse GOOGLE_INDEXING_SA_JSON:", err);
    return null;
  }
}

/**
 * Retrieves a valid Google OAuth 2.0 access token for Google Indexing & Search Console APIs.
 * Tokens are cached in-memory until 5 minutes before expiration.
 */
export async function getGoogleAccessToken(
  scopes = [
    "https://www.googleapis.com/auth/indexing",
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters",
  ],
): Promise<string | null> {
  const sa = getParsedServiceAccount();
  if (!sa) {
    return null;
  }

  const cacheKey = `${sa.client_email}:${scopes.sort().join(",")}`;
  const now = Date.now();
  const cached = tokenCache.get(cacheKey);

  if (cached && cached.expiresAt > now + 60 * 1000) {
    return cached.accessToken;
  }

  try {
    const privateKey = await jose.importPKCS8(sa.private_key, "RS256");

    const jwt = await new jose.SignJWT({
      scope: scopes.join(" "),
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuer(sa.client_email)
      .setAudience("https://oauth2.googleapis.com/token")
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error(`Google token exchange failed (${tokenRes.status}):`, errBody);
      return null;
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresInSec = tokenData.expires_in || 3600;

    tokenCache.set(cacheKey, {
      accessToken,
      expiresAt: now + expiresInSec * 1000,
    });

    return accessToken;
  } catch (err) {
    console.error("Error generating Google access token:", err);
    return null;
  }
}

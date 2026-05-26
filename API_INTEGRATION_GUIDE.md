# Public Content API — Integration Guide

Welcome to the **pirateCOS Public Content API**. This guide details how developers can programmatically query, embed, and syndication published posts from the pirateCOS platform into external websites, static site generators, and mobile applications.

---

## 🔒 1. Authentication & API Key Management

To authenticate programmatic requests, you generate a **Programmatic API Key (Secret Token)** from the dashboard. This token functions as both a credential and a secret in a single string, providing secure, isolated access to your tenant endpoints.

### Step-by-Step Key Generation

1. **Access Settings**: Log into your **pirateCOS Dashboard** and navigate to the **Integrations** tab in the sidebar (`/settings/integrations`).
2. **Launch Creator**: Scroll down to the **Programmatic API Keys** card and click the orange **+ Create Key** button.
3. **Configure Parameters**:
   * **Key Name**: Enter a descriptive identifier (e.g. `Zapier Lead Sync`, `CI Build Sync`) so you can track usage in the list.
   * **Permission Scopes**:
     * `read` *(Required)*: Grants query rights to fetch published post directories and detailed body slugs.
     * `write` *(Optional)*: Grants rights to create/import new post drafts programmatically.
4. **Generate & Copy**: Click **Generate Key**. An overlay modal will open showing your new raw secret token:
   `uip_live_` followed by a cryptographically secure 40-character hex string (e.g., `uip_live_9fa8d0...`).
5. **Secure the Secret**: Copy the token immediately. 

> [!IMPORTANT]
> **This is the ONLY time the raw secret token will ever be displayed.** Once you close the modal, the platform cannot recover it. The server stores only a one-way **SHA-256 hash** of the key encrypted with AES-256-GCM for verification.

---

### Header Authentication Format
To query any content endpoints, pass the copied token in your HTTP headers as a `Bearer` token:

```http
Authorization: Bearer uip_live_your_copied_secret_token_here
Accept: application/json
```

> [!CAUTION]
> **Security Guardrails:** Never share your secret tokens or commit them to public client-side files (like frontend Javascript code or raw git repos). Always store them in backend environment configurations (`process.env` or server secrets managers). If a key is compromised, immediately click **Revoke** next to its name on the settings page to destroy access timing-safely.

---

## 🌐 2. API Endpoints Reference

All endpoints are hosted relative to your main platform origin.

### 2.1 List Published Posts
Fetches a paginated, sorted list of all active, published posts scoped to your tenant.

* **Endpoint**: `GET /api/pirateCOS/v1/content`
* **Query Parameters**:
  * `limit` *(optional, number)*: Number of records to return. Default: `10`.
  * `page` *(optional, number)*: Current page number. Default: `1`.
  * `tag` *(optional, string)*: Filter posts by a specific tag.
  * `postType` *(optional, string)*: Filter by type (`blog` | `tutorial` | `case-study` | `community-insight`).

#### Sample Response
```json
{
  "success": true,
  "posts": [
    {
      "_id": "60c72b2f9b1d8b2f94c489d1",
      "title": "Scaling Modern SaaS Platforms",
      "slug": "scaling-modern-saas-platforms",
      "excerpt": "A deep dive into distributed architectures and tenant isolation...",
      "featuredImage": "https://cdn.uipirate.com/images/saas-scaling.jpg",
      "tags": ["SaaS", "Architecture", "Scaling"],
      "publishedAt": "2026-05-24T18:30:00.000Z",
      "readTime": 6,
      "postType": "blog",
      "seo": {
        "metaTitle": "Scaling Modern SaaS Platforms | UI Pirate",
        "metaDescription": "Learn strategies for building distributed tenant isolated databases."
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 2.2 Get Single Post by Slug
Retrieves the full content body and detailed SEO metadata for a specific post.

* **Endpoint**: `GET /api/pirateCOS/v1/content/[slug]`

#### Sample Response
```json
{
  "success": true,
  "post": {
    "_id": "60c72b2f9b1d8b2f94c489d1",
    "title": "Scaling Modern SaaS Platforms",
    "slug": "scaling-modern-saas-platforms",
    "content": "<h2>Introduction</h2><p>Building standard multi-tenant isolation patterns...</p>",
    "excerpt": "A deep dive into distributed architectures and tenant isolation...",
    "featuredImage": "https://cdn.uipirate.com/images/saas-scaling.jpg",
    "tags": ["SaaS", "Architecture", "Scaling"],
    "publishedAt": "2026-05-24T18:30:00.000Z",
    "readTime": 6,
    "postType": "blog",
    "seo": {
      "metaTitle": "Scaling Modern SaaS Platforms | UI Pirate",
      "metaDescription": "Learn strategies for building distributed tenant isolated databases.",
      "focusKeyword": "SaaS Platform",
      "canonicalUrl": "https://uipirate.com/posts/scaling-modern-saas-platforms"
    }
  }
}
```

---

### 2.3 Create Post Programmatically
Enables writing or importing posts programmatically. Requires the `write` permission scope.

* **Endpoint**: `POST /api/pirateCOS/v1/content`
* **JSON Payload Parameters**:
  * `title` *(required, string)*: Post title.
  * `content` *(required, string)*: Raw post content (supports HTML/markdown).
  * `excerpt` *(optional, string)*: Brief summary excerpt.
  * `tags` *(optional, string array)*: Tags array.
  * `postType` *(optional, string)*: Post format (`blog` | `tutorial` | `case-study` | `community-insight`).
  * `published` *(optional, boolean)*: Directly set active publish state. Default: `false`.

---

## 💻 3. Integration Code Examples

### 3.1 Fetching Posts in cURL
```bash
curl -X GET "https://cos.uipirate.com/api/pirateCOS/v1/content?limit=5" \
  -H "Authorization: Bearer uip_live_your_actual_key_here" \
  -H "Accept: application/json"
```

### 3.2 Dynamic Next.js Embedding (App Router / Static Generation)
Utilize `revalidate` for incremental static regeneration (ISR) to balance performance and freshness:

```typescript
// app/blog/page.tsx
interface Post {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://cos.uipirate.com/api/pirateCOS/v1/content?limit=10", {
    headers: {
      Authorization: `Bearer ${process.env.UIPIRATE_API_KEY}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // Cache on CDN for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to retrieve content posts from server");
  }

  const data = await res.json();
  return data.posts || [];
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Latest Updates</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="p-6 border rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <span className="text-xs text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </article>
        ))}
      </div>
    </main>
  );
}
```

### 3.3 Integration script in Python
```python
import requests
import json

api_url = "https://cos.uipirate.com/api/pirateCOS/v1/content"
headers = {
    "Authorization": "Bearer uip_live_your_actual_key_here",
    "Content-Type": "application/json"
}

# Fetch published post list
response = requests.get(f"{api_url}?limit=3", headers=headers)
if response.status_code == 200:
    data = response.json()
    for post in data.get("posts", []):
        print(f"Post Title: {post['title']}")
        print(f"Post Slug: {post['slug']}")
        print("-" * 20)
else:
    print(f"Error: {response.status_code} - {response.text}")
```

---

## 🛠️ 4. Rate Limits & Support
* **Rate Limiting**: There is currently no strict hard-limit threshold for active, paid developer API accounts. To ensure stability, caching results at the client level (e.g. through ISR or CDN caching) is strongly recommended.
* **Support**: For inquiries, custom model setups, or developer integration tickets, feel free to contact priority B2B support directly via your account manager or email.

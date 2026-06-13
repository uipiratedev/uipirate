"use client";

import { useState } from "react";

const ACCENT = "#FF5B04";

const ENDPOINTS: {
  method: string;
  path: string;
  desc: string;
}[] = [
  {
    method: "GET",
    path: "/api/pirateCOS/v1/content",
    desc: "List published posts. Paginated. Filters: tag, postType, updatedSince, fields, sort. Excludes content by default.",
  },
  {
    method: "GET",
    path: "/api/pirateCOS/v1/content/{slug}",
    desc: "Single published post by slug. Supports ETag / If-None-Match (304).",
  },
  {
    method: "GET",
    path: "/api/pirateCOS/v1/content/id/{id}",
    desc: "Single published post by stable MongoDB id. Supports ETag.",
  },
  {
    method: "GET",
    path: "/api/pirateCOS/v1/tags",
    desc: "Distinct tags across published posts, with counts.",
  },
  {
    method: "GET",
    path: "/api/pirateCOS/v1/me",
    desc: "Echo your key's tenant, name, and current rate-limit budget. Useful for debugging auth.",
  },
];

const QUERY_PARAMS: { name: string; desc: string }[] = [
  { name: "page", desc: "Page number, ≥ 1. Default 1." },
  { name: "limit", desc: "Items per page, 1–100. Default 10." },
  { name: "tag", desc: "Filter to posts carrying this tag." },
  { name: "postType", desc: "Filter by content type (e.g. blog, tutorial)." },
  {
    name: "updatedSince",
    desc: "ISO-8601 timestamp. Return only posts updated after it — ideal for incremental static builds.",
  },
  {
    name: "fields",
    desc: "Comma-separated field allow-list, e.g. fields=slug,title,excerpt. id is always included. Add content to opt into the heavy HTML body.",
  },
  {
    name: "sort",
    desc: "publishedAt | -publishedAt | updatedAt | -updatedAt. Default -publishedAt.",
  },
];

const ERROR_CODES: { code: string; status: number; desc: string }[] = [
  { code: "unauthorized", status: 401, desc: "Missing or invalid API key." },
  { code: "not_found", status: 404, desc: "No published post matches the request." },
  { code: "rate_limited", status: 429, desc: "Per-key rate limit exceeded — see Retry-After." },
  { code: "internal_error", status: 500, desc: "Unexpected server error." },
];

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-t-xl border-b border-white/10">
        <span className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <button
          className="text-[10px] font-semibold text-gray-300 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10"
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-[11px] font-jetbrains-mono bg-gray-900 text-gray-100 rounded-b-xl px-4 py-3 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-20 space-y-4" id={id}>
      <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function DevelopersDocsPage() {
  const base = "https://cos.uipirate.com";

  const curlSnippet = `curl ${base}/api/pirateCOS/v1/content \\
  -H "Authorization: Bearer uip_<keyId>_<secret>"`;

  const fetchSnippet = `const res = await fetch(
  "${base}/api/pirateCOS/v1/content?limit=10",
  { headers: { Authorization: \`Bearer \${process.env.PIRATECOS_KEY}\` } }
);
const { data } = await res.json();`;

  const nodeSnippet = `// Fetch a single post by slug
const res = await fetch(
  "${base}/api/pirateCOS/v1/content/my-first-post",
  { headers: { Authorization: \`Bearer \${process.env.PIRATECOS_KEY}\` } }
);
if (res.status === 404) throw new Error("Post not found");
const { data: post } = await res.json();
console.log(post.title, post.content);`;

  const pythonSnippet = `import os, requests

resp = requests.get(
    "${base}/api/pirateCOS/v1/content",
    headers={"Authorization": f"Bearer {os.environ['PIRATECOS_KEY']}"},
    params={"limit": 10, "fields": "slug,title,excerpt"},
)
resp.raise_for_status()
for post in resp.json()["data"]:
    print(post["slug"], "-", post["title"])`;

  const nextIsrSnippet = `// app/blog/[slug]/page.tsx  (Next.js App Router, ISR)
export const revalidate = 60; // re-fetch at most once a minute

export default async function Post({
  params,
}: { params: { slug: string } }) {
  const res = await fetch(
    \`${base}/api/pirateCOS/v1/content/\${params.slug}\`,
    {
      headers: { Authorization: \`Bearer \${process.env.PIRATECOS_KEY}\` },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return <div>Not found</div>;
  const { data } = await res.json();
  return (
    <article>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </article>
  );
}`;

  const astroSnippet = `---
// src/pages/blog/[slug].astro  (Astro)
const { slug } = Astro.params;
const res = await fetch(
  \`${base}/api/pirateCOS/v1/content/\${slug}\`,
  { headers: { Authorization: \`Bearer \${import.meta.env.PIRATECOS_KEY}\` } }
);
const { data } = await res.json();
---
<article>
  <h1>{data.title}</h1>
  <Fragment set:html={data.content} />
</article>`;

  return (
    <div className="min-h-screen bg-gray-50 font-geist text-gray-700">
      {/* HEADER */}
      <header className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p
            className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
            style={{ color: ACCENT }}
          >
            PirateCOS Developers
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Public Content API
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            A stable, versioned, read-only REST API for pulling your published
            PirateCOS content into any website, static-site generator, app, or
            automation. Authoring stays inside PirateCOS — this is a consumption
            layer only.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-10">
        {/* NAV */}
        <nav className="hidden lg:block">
          <ul className="sticky top-10 space-y-2 text-xs font-medium text-gray-500">
            {[
              ["quickstart", "Quickstart"],
              ["auth", "Authentication"],
              ["endpoints", "Endpoints"],
              ["params", "Query parameters"],
              ["responses", "Response shape"],
              ["errors", "Error codes"],
              ["rate-limits", "Rate limits"],
              ["caching", "Caching"],
              ["examples", "Examples"],
            ].map(([id, label]) => (
              <li key={id}>
                <a className="hover:text-gray-900" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CONTENT */}
        <main className="space-y-12">
          <Section id="quickstart" title="Quickstart">
            <p className="text-sm leading-relaxed text-gray-600">
              Create a read-only API key in{" "}
              <a
                className="font-semibold hover:underline"
                style={{ color: ACCENT }}
                href="/pirateCOS/settings/integrations"
              >
                Settings → Integrations
              </a>
              , then call the API with a Bearer token. Every request is scoped to
              your tenant — a key can only ever read your own published content.
            </p>
            <CodeBlock label="cURL" code={curlSnippet} />
          </Section>

          <Section id="auth" title="Authentication">
            <p className="text-sm leading-relaxed text-gray-600">
              Pass your key as a Bearer token on every request:
            </p>
            <CodeBlock
              label="Header"
              code={`Authorization: Bearer uip_<keyId>_<secret>`}
            />
            <p className="text-sm leading-relaxed text-gray-600">
              Keys are read-only and may be given an optional expiry. Rotate or
              revoke them any time from the integrations settings page. Treat the
              secret like a password — it is shown only once at creation.
            </p>
          </Section>

          <Section id="endpoints" title="Endpoints">
            <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-black/5">
                  {ENDPOINTS.map((e) => (
                    <tr key={e.path} className="align-top">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-jetbrains-mono font-bold text-green-700">
                          {e.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-jetbrains-mono text-gray-800 whitespace-nowrap">
                        {e.path}
                      </td>
                      <td className="px-4 py-3 text-gray-500 leading-relaxed">
                        {e.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="params" title="Query parameters (list)">
            <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-black/5">
                  {QUERY_PARAMS.map((p) => (
                    <tr key={p.name} className="align-top">
                      <td className="px-4 py-3 font-jetbrains-mono font-semibold text-gray-800 whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 leading-relaxed">
                        {p.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="responses" title="Response shape">
            <p className="text-sm leading-relaxed text-gray-600">
              All responses share a JSON envelope. Successful list responses also
              include <code>pagination</code>.
            </p>
            <CodeBlock
              label="PublicPost"
              code={`{
  "success": true,
  "data": {
    "id": "65a0...001",
    "slug": "my-first-post",
    "title": "My First Post",
    "excerpt": "A short summary",
    "content": "<p>HTML body</p>",
    "featuredImage": "https://.../feat.png",
    "tags": ["product", "launch"],
    "postType": "blog",
    "author": { "name": "Jane" },
    "readTime": 3,
    "views": 128,
    "seo": { "metaTitle": "...", "canonicalUrl": "..." },
    "publishedAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-02-01T00:00:00.000Z"
  }
}`}
            />
            <p className="text-sm leading-relaxed text-gray-600">
              Internal fields (tenant ids, author emails, AI workspace history,
              approval workflow, bot/duplicate view counts, distribution records)
              are never returned.
            </p>
          </Section>

          <Section id="errors" title="Error codes">
            <p className="text-sm leading-relaxed text-gray-600">
              Errors are machine-readable. Branch on{" "}
              <code>error.code</code>, never on the message.
            </p>
            <CodeBlock
              label="Error envelope"
              code={`{ "success": false, "error": { "code": "rate_limited", "message": "..." } }`}
            />
            <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-black/5">
                  {ERROR_CODES.map((e) => (
                    <tr key={e.code}>
                      <td className="px-4 py-3 font-jetbrains-mono font-semibold text-gray-800">
                        {e.code}
                      </td>
                      <td className="px-4 py-3 font-jetbrains-mono text-gray-500">
                        {e.status}
                      </td>
                      <td className="px-4 py-3 text-gray-500 leading-relaxed">
                        {e.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="rate-limits" title="Rate limits">
            <p className="text-sm leading-relaxed text-gray-600">
              Requests are limited per key. Every response carries{" "}
              <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>,
              and <code>X-RateLimit-Reset</code> (epoch seconds). On a{" "}
              <code>429</code>, a <code>Retry-After</code> header tells you how
              many seconds to wait. The default budget is{" "}
              <strong>120 requests / minute</strong> per key.
            </p>
          </Section>

          <Section id="caching" title="Caching">
            <p className="text-sm leading-relaxed text-gray-600">
              Read endpoints send{" "}
              <code>Cache-Control: public, max-age=60, stale-while-revalidate=300</code>
              . Detail endpoints also return an <code>ETag</code>; send it back as{" "}
              <code>If-None-Match</code> to get a cheap <code>304 Not Modified</code>{" "}
              when nothing changed.
            </p>
          </Section>

          <Section id="examples" title="Examples">
            <div className="space-y-6">
              <CodeBlock label="JavaScript (fetch)" code={fetchSnippet} />
              <CodeBlock label="Node.js — get by slug" code={nodeSnippet} />
              <CodeBlock label="Python (requests)" code={pythonSnippet} />
              <CodeBlock label="Next.js — ISR" code={nextIsrSnippet} />
              <CodeBlock label="Astro" code={astroSnippet} />
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}

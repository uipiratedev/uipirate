export interface PreflightCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: "error" | "warning";
  action?: string; // e.g. "Open SEO Editor"
}

function wordCount(htmlOrText: string): number {
  if (!htmlOrText) return 0;
  // Strip HTML tags
  const text = htmlOrText.replace(/<[^>]*>/g, " ");
  const cleanText = text.trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).length;
}

export function runPreflight(blog: {
  content?: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
  seo?: {
    focusKeyword?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
}): PreflightCheck[] {
  const contentVal = blog.content || "";
  const count = wordCount(contentVal);

  return [
    {
      id: "excerpt",
      label: "Excerpt present",
      passed: !!blog.excerpt?.trim(),
      severity: "error",
      action: "Generate Excerpt",
    },
    {
      id: "wordCount",
      label: `Content ≥ 300 words (Current: ${count})`,
      passed: count >= 300,
      severity: "error",
      action: "AI Copilot",
    },
    {
      id: "focusKeyword",
      label: "Focus keyword set",
      passed: !!blog.seo?.focusKeyword?.trim(),
      severity: "warning",
      action: "Open SEO Editor",
    },
    {
      id: "metaTitle",
      label: "Meta title set",
      passed: !!blog.seo?.metaTitle?.trim(),
      severity: "warning",
      action: "Open SEO Editor",
    },
    {
      id: "metaDescription",
      label: "Meta description set",
      passed: !!blog.seo?.metaDescription?.trim(),
      severity: "warning",
      action: "Open SEO Editor",
    },
    {
      id: "tags",
      label: "At least one tag",
      passed: (blog.tags?.length ?? 0) > 0,
      severity: "warning",
      action: "Generate Tags",
    },
    {
      id: "featuredImage",
      label: "Featured image set",
      passed: !!blog.featuredImage?.trim(),
      severity: "warning",
    },
  ];
}

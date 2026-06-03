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

export function runPreflight(
  blog: {
    content?: string;
    excerpt?: string;
    tags?: string[];
    featuredImage?: string;
    seo?: {
      focusKeyword?: string;
      metaTitle?: string;
      metaDescription?: string;
    };
  },
  postType?: string,
  socialDestination: "linkedin" | "x" = "linkedin"
): PreflightCheck[] {
  const contentVal = blog.content || "";

  if (postType === "social-post") {
    // Strip HTML tags for clean text length
    const cleanText = contentVal.replace(/<[^>]*>/g, " ").trim();
    const textLength = cleanText.length;
    const limit = socialDestination === "x" ? 280 : 3000;

    return [
      {
        id: "socialContent",
        label: "Content present",
        passed: textLength > 0,
        severity: "error",
        action: "AI Copilot",
      },
      {
        id: "characterLimit",
        label: `Within character limit (Current: ${textLength} / ${limit})`,
        passed: textLength <= limit,
        severity: "error",
      },
      {
        id: "openingHook",
        label: "Scroll-stopping opening hook",
        passed: textLength >= 15,
        severity: "warning",
        action: "AI Hook",
      },
      {
        id: "hashtags",
        label: "Has hashtags (Recommended)",
        passed: contentVal.includes("#") || (blog.tags?.length ?? 0) > 0,
        severity: "warning",
        action: "Hashtag Ideas",
      },
      {
        id: "mediaAttachment",
        label: "Media attachment (Recommended)",
        passed: !!blog.featuredImage?.trim() || contentVal.includes("<img") || contentVal.includes("<video"),
        severity: "warning",
      },
    ];
  }

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

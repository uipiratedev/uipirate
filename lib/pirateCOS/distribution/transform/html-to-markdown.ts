/**
 * Convert HTML to GitHub Flavored Markdown (GFM)
 * Tailored specifically for clean handling of TipTap's HTML output structure.
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  let md = html;

  // 1. Remove carriage returns
  md = md.replace(/\r/g, "");

  // 2. Pre / Code Blocks
  // Handle <pre><code>...</code></pre>
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    // Unescape basic HTML entities in code blocks
    const unescaped = code
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');

    return `\n\`\`\`\n${unescaped}\n\`\`\`\n`;
  });

  // 3. Horizontal Rules
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // 4. Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n");

  // 5. Unordered / Ordered Lists
  // A recursive-style list parser using simple token replacement can work, but we can do a standard clean replace.
  // First, convert list items inside ul
  let ulMatches = md.match(/<ul>([\s\S]*?)<\/ul>/gi);

  if (ulMatches) {
    for (const match of ulMatches) {
      const items = match.replace(/<li>([\s\S]*?)<\/li>/gi, "- $1\n");
      const cleanList = items.replace(/<\/?ul>/gi, "");

      md = md.replace(match, `\n${cleanList}\n`);
    }
  }

  // Convert list items inside ol
  let olMatches = md.match(/<ol>([\s\S]*?)<\/ol>/gi);

  if (olMatches) {
    for (const match of olMatches) {
      let index = 1;
      const items = match.replace(
        /<li>([\s\S]*?)<\/li>/gi,
        () => `${index++}. $1\n`,
      );
      const cleanList = items.replace(/<\/?ol>/gi, "");

      md = md.replace(match, `\n${cleanList}\n`);
    }
  }

  // 6. Blockquotes
  md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const lines = inner
      .trim()
      .split("\n")
      .map((line: string) => `> ${line.trim()}`);

    return `\n${lines.join("\n")}\n`;
  });

  // 7. Paragraphs & Divs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, "\n$1\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // 8. Hyperlinks
  md = md.replace(
    /<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    "[$2]($1)",
  );

  // 9. Images
  md = md.replace(
    /<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)",
  );
  md = md.replace(
    /<img\s+[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi,
    "![$1]($2)",
  );
  md = md.replace(/<img\s+[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // 10. Inline Bold / Italic / Strikethrough / Code
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");
  md = md.replace(/<del>([\s\S]*?)<\/del>/gi, "~~$1~~");
  md = md.replace(/<s>([\s\S]*?)<\/s>/gi, "~~$1~~");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // 11. Clean up excessive whitespace and double spacing
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

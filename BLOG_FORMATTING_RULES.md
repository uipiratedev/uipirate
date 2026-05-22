# UI Pirate Blog Content & Auto-Generation Guidelines

To prevent low-contrast text, layout breaks, and inconsistent styling across device viewports, all dynamically rendered blog content stored in the database must strictly follow these structural and markup rules.

---

## 1. Direct Markup Constraints (No Style/Class Clutter)

*   **NO Inline Styles:** Absolutely no `style="..."` attributes are allowed on any element (e.g., `<p style="color: ...">` or `<span style="font-size: ...">`).
*   **NO Class Names:** Do not include `class="..."` or `className="..."` attributes on paragraphs, lists, spans, or containers. Let the application's global `.blog-prose` stylesheet handle all typography, colors, padding, and responsive scaling.
*   **NO Wrapper Containers:** Do not wrap the HTML payload in structural divs (e.g., `<div class="blog-post-content bg-charcoal">...</div>`). The payload should contain raw, flat semantic elements directly.

---

## 2. Allowed Semantic Elements

Only utilize standard, clean semantic HTML elements. Here is the exact set of approved elements and their structural usage:

### Headings
Always maintain a logical heading hierarchy starting from `<h2>` (since `<h1>` is reserved for the primary title in the hero banner).
*   `<h2>Heading Title</h2>` - Main sections.
*   `<h3>Subheading Title</h3>` - Nested subsections.

### Paragraphs & Formatting
*   `<p>Paragraph text goes here...</p>` - Standard copy.
*   `<strong>bold text</strong>` - For emphasis (automatically styled to solid `#111111` deep black).
*   `<em>italicized text</em>` - For subtle italic notes.

### Lists
*   **Unordered List:**
    ```html
    <ul>
      <li>List item one.</li>
      <li>List item two.</li>
    </ul>
    ```
*   **Ordered List:**
    ```html
    <ol>
      <li>First point.</li>
      <li>Second point.</li>
    </ol>
    ```

### Blockquotes / Quote Boxes
Do not wrap quotes in custom classes or divs. Simply use a standard `<blockquote>` tag:
```html
<blockquote>
  "If you measure a team by how many features they build, they will build features..."
</blockquote>
```

### Tables
Use simple table tags with no styling or class declarations:
```html
<table>
  <thead>
    <tr>
      <th>Dimension</th>
      <th>Output-Driven</th>
      <th>Outcome-Driven</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Success Metric</td>
      <td>Features shipped</td>
      <td>User value unlocked</td>
    </tr>
  </tbody>
</table>
```

---

## 3. Auto-Generation Prompts & System Rules

When using LLMs or background workers to generate or import blog content into MongoDB, include this system constraint in the prompt:

> **System Constraint for HTML Output:**
> Generate the blog post content as raw, clean HTML. Strictly follow these guidelines:
> 1. Use only the following tags: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <table>, <thead>, <tbody>, <tr>, <th>, <td>.
> 2. Do NOT add any 'class', 'style', 'id', or other formatting attributes to any tags.
> 3. Do NOT wrap the entire output or sections in <div> tags.
> 4. Ensure there is absolutely no inline color definition, font size declaration, or background style so the application's premium CSS handles theme accessibility.

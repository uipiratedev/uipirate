# ContentSettingsPanel - Reusable Component

## Overview

The `ContentSettingsPanel` is a fully reusable component that provides all content settings functionality for both **create** and **edit** pages. It automatically adapts based on `postType` and shows/hides sections based on configuration props.

## Features

✅ **Adaptive UI** - Automatically switches between blog and social post layouts
✅ **Progress Tracking** - Visual checklist showing content completion status  
✅ **AI Integration** - Title optimizer, excerpt generator, tag suggestions
✅ **Platform-Specific** - Special handling for LinkedIn/Twitter social posts
✅ **Fully Configurable** - Show/hide any section via props
✅ **Type-Safe** - Full TypeScript support

## Basic Usage

```tsx
import { ContentSettingsPanel } from "@/components/pirateCOS/ContentSettingsPanel";

<ContentSettingsPanel
  // Required: Post data
  postType={postType}
  title={title}
  excerpt={excerpt}
  tags={tags}
  editorStats={editorStats}
  
  // Required: Callbacks
  onTitleChange={setTitle}
  onExcerptChange={setExcerpt}
  onTagsChange={setTags}
  onDirtyChange={() => setIsDirty(true)}
/>
```

## Full Example (Blog Post)

```tsx
import { ContentSettingsPanel } from "@/components/pirateCOS/ContentSettingsPanel";

function BlogEditor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [titleInstructions, setTitleInstructions] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  
  return (
    <ContentSettingsPanel
      postType="blog"
      title={title}
      excerpt={excerpt}
      tags={tags}
      editorStats={{
        words: 500,
        characters: 2500,
        paragraphs: 10,
        readTime: 3,
      }}
      
      // Title Optimizer
      titleInstructions={titleInstructions}
      titleSuggestions={titleSuggestions}
      isOptimizingTitle={isOptimizingTitle}
      onTitleInstructionsChange={setTitleInstructions}
      onGenerateTitleSuggestions={handleGenerateTitles}
      
      // Excerpt
      excerptInstructions={excerptInstructions}
      showExcerptAIGuidelines={showExcerptAI}
      onToggleExcerptAI={() => setShowExcerptAI(!showExcerptAI)}
      onGenerateExcerpt={handleGenerateExcerpt}
      
      // Tags
      tagInput={tagInput}
      onTagInputChange={setTagInput}
      onAddTag={handleAddTag}
      onRemoveTag={(tag) => setTags(tags.filter(t => t !== tag))}
      onGenerateTags={handleGenerateTags}
      
      // Callbacks
      onTitleChange={setTitle}
      onExcerptChange={setExcerpt}
      onTagsChange={setTags}
      onDirtyChange={() => setIsDirty(true)}
      
      // Optional: Show/hide sections
      showProgressChecklist={true}
      showAnalytics={true}
      showTitleOptimizer={true}
      showExcerpt={true}
      showTags={true}
    />
  );
}
```

## Example (Social Post)

```tsx
<ContentSettingsPanel
  postType="social-post"
  title={title}
  excerpt={excerpt}
  tags={tags}
  editorStats={editorStats}
  
  // Social-specific
  socialDestination={socialDestination} // "linkedin" | "x"
  onSocialDestinationChange={setSocialDestination}
  onAppendHashtag={(tag) => setTags([...tags, tag])}
  
  // Callbacks
  onTitleChange={setTitle}
  onExcerptChange={setExcerpt}
  onTagsChange={setTags}
  onDirtyChange={() => setIsDirty(true)}
  
  // Note: Excerpt section automatically hidden for social posts
  // Hashtag Assistant automatically shown instead of Tags
/>
```

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `postType` | `string` | Post type (e.g., "blog", "social-post") |
| `title` | `string` | Current title |
| `excerpt` | `string` | Current excerpt/summary |
| `tags` | `string[]` | Array of tags/hashtags |
| `editorStats` | `EditorStats` | Word count, characters, paragraphs, read time |
| `onTitleChange` | `(val: string) => void` | Title change handler |
| `onExcerptChange` | `(val: string) => void` | Excerpt change handler |
| `onTagsChange` | `(tags: string[]) => void` | Tags change handler |
| `onDirtyChange` | `() => void` | Called when content changes |

### Optional Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showProgressChecklist` | `boolean` | `true` | Show completion checklist |
| `showAnalytics` | `boolean` | `true` | Show analytics/feed guardrails |
| `showTitleOptimizer` | `boolean` | `true` | Show AI title optimizer |
| `showExcerpt` | `boolean` | `true` | Show excerpt section |
| `showTags` | `boolean` | `true` | Show tags/hashtags |

### Social Post Props

| Prop | Type | Description |
|------|------|-------------|
| `socialDestination` | `"linkedin" \| "x"` | Selected platform |
| `onSocialDestinationChange` | `(dest) => void` | Platform change handler |
| `onAppendHashtag` | `(tag: string) => void` | Add hashtag handler |
| `socialDestinations` | `Record<string, {...}>` | Custom platform configs |


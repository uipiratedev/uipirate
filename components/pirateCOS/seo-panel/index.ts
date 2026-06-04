/**
 * SEO Panel Components
 *
 * Modular, accordion-based SEO & Metadata editor for the post editor.
 * Covers: Focus Keyword, Meta Title, Meta Description, Related Keywords,
 * Search/Social Previews, Social Overrides, and Advanced settings (Slug, Canonical).
 */

export { SEOPanel, type SEOPanelProps } from "./SEOPanel";
export { default } from "./SEOPanel";

export {
  type PostSEO,
  AIBtn,
  SuggestionStrip,
  FocusKeywordContent,
  MetaTitleContent,
  MetaDescriptionContent,
  RelatedKeywordsContent,
  GooglePreviewContent,
  SocialOverridesContent,
  AdvancedSEOContent,
  getFocusKeywordBadge,
  getMetaTitleBadge,
  getMetaDescriptionBadge,
  getKeywordsBadge,
  getSocialBadge,
  getAdvancedBadge,
} from "./SEOPanelSubComponents";

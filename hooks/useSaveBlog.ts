import { useState, useCallback, useRef, useEffect } from "react";

export interface EditorSaveState {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  postType?: string;
  slug?: string;
  seo?: any;
}

interface UseSaveBlogProps {
  initialBlogId?: string | null;
  getEditorState: () => EditorSaveState;
  onSaveSuccess?: (id: string, published: boolean) => void;
  onSaveError?: (error: any) => void;
}

export function useSaveBlog({
  initialBlogId = null,
  getEditorState,
  onSaveSuccess,
  onSaveError,
}: UseSaveBlogProps) {
  const [blogId, setBlogId] = useState<string | null>(initialBlogId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error"
  >("Draft");
  const [isDirty, setIsDirty] = useState(false);

  // Sync initialBlogId if it changes (e.g. edit page mounts after data fetch)
  useEffect(() => {
    if (initialBlogId) {
      setBlogId(initialBlogId);
    }
  }, [initialBlogId]);

  const isDirtyRef = useRef(false);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  const saveBlog = useCallback(
    async (published: boolean, customSeo?: any, customSlug?: string): Promise<string> => {
      setIsSaving(true);
      setSaveStatus(published ? "Publishing…" : "Saving…");

      try {
        const editorState = getEditorState();
        const isNew = !blogId;

        // Merge custom SEO or slug overrides if provided (for SEO editor integration)
        const payload = {
          ...editorState,
          published,
        };
        if (customSeo) payload.seo = customSeo;
        if (customSlug) payload.slug = customSlug;

        const url = isNew ? "/api/pirateCOS/posts" : `/api/pirateCOS/posts/${blogId}`;
        const method = isNew ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to save blog post");
        }

        const persistedId = data.data?._id ?? data._id ?? "";
        setBlogId(persistedId);
        setSaveStatus(published ? "Published" : "Saved");
        setIsDirty(false);

        if (onSaveSuccess) {
          onSaveSuccess(persistedId, published);
        }

        return persistedId;
      } catch (err: any) {
        setSaveStatus("Error");
        if (onSaveError) {
          onSaveError(err);
        }
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [blogId, getEditorState, onSaveSuccess, onSaveError],
  );

  const ensureSaved = useCallback(async (): Promise<string> => {
    // If we have a saved blog ID and the editor state has no unsaved changes, return it
    if (blogId && !isDirtyRef.current) {
      return blogId;
    }
    // Otherwise, save preserving the current published status to ensure it's in the DB
    const currentlyPublished = saveStatus === "Published";
    return await saveBlog(currentlyPublished);
  }, [blogId, saveBlog, saveStatus]);

  return {
    blogId,
    setBlogId,
    isSaving,
    saveStatus,
    setSaveStatus,
    isDirty,
    setIsDirty,
    saveBlog,
    ensureSaved,
  };
}

import { useState, useCallback, useRef, useEffect } from "react";

export interface EditorSaveState {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  postType?: string;
  contentGoal?: string;
  slug?: string;
  seo?: any;
}

interface UseSavePostProps {
  initialPostId?: string | null;
  getEditorState: () => EditorSaveState;
  onSaveSuccess?: (id: string, published: boolean) => void;
  onSaveError?: (error: any) => void;
}

export function useSavePost({
  initialPostId = null,
  getEditorState,
  onSaveSuccess,
  onSaveError,
}: UseSavePostProps) {
  const [postId, setPostId] = useState<string | null>(initialPostId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error"
  >("Draft");
  const [isDirty, setIsDirty] = useState(false);

  // Sync initialPostId if it changes (e.g. edit page mounts after data fetch)
  useEffect(() => {
    if (initialPostId) {
      setPostId(initialPostId);
    }
  }, [initialPostId]);

  const isDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  const savePost = useCallback(
    async (
      published: boolean,
      customSeo?: any,
      customSlug?: string,
    ): Promise<string> => {
      setIsSaving(true);
      setSaveStatus(published ? "Publishing…" : "Saving…");

      try {
        const editorState = getEditorState();
        const isNew = !postId;

        // Merge custom SEO or slug overrides if provided (for SEO editor integration)
        const payload = {
          ...editorState,
          published,
        };

        if (customSeo) payload.seo = customSeo;
        if (customSlug) payload.slug = customSlug;

        const url = isNew
          ? "/api/pirateCOS/posts"
          : `/api/pirateCOS/posts/${postId}`;
        const method = isNew ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Safely parse JSON or handle plain text/HTML errors (like 413 Payload Too Large)
        let data: any = {};
        let parseError: string | null = null;
        try {
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch (e) {
            parseError = text || `${res.status} ${res.statusText}`;
          }
        } catch (e) {
          parseError = `${res.status} ${res.statusText}`;
        }

        if (!res.ok) {
          if (res.status === 413) {
            throw new Error(
              "Payload too large: The post content (possibly containing large base64 images) exceeds the server's size limit. Please compress your images or use image URLs."
            );
          }
          throw new Error(data?.error || parseError || "Failed to save post");
        }

        const persistedId = data.data?._id ?? data._id ?? "";

        setPostId(persistedId);
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
    [postId, getEditorState, onSaveSuccess, onSaveError],
  );

  const ensureSaved = useCallback(async (): Promise<string> => {
    // If we have a saved post ID and the editor state has no unsaved changes, return it
    if (postId && !isDirtyRef.current) {
      return postId;
    }
    // Otherwise, save preserving the current published status to ensure it's in the DB
    const currentlyPublished = saveStatus === "Published";

    return await savePost(currentlyPublished);
  }, [postId, savePost, saveStatus]);

  return {
    postId,
    setPostId,
    isSaving,
    saveStatus,
    setSaveStatus,
    isDirty,
    setIsDirty,
    savePost,
    ensureSaved,
  };
}

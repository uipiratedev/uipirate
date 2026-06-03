"use client";

import { useState, useEffect, useCallback } from "react";

export interface AIWorkspaceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  associatedGenerationId?: string;
  selectedTextContext?: string;
}

export interface GenerationRecord {
  id: string;
  prompt: string;
  output: string;
  mode: string; // QuickActionMode | "chat"
  appliedAt?: Date;
  isAccepted: boolean;
  selectedTextContext?: string;
}

export function useAIWorkspaceSession(
  postId: string | null,
  initialSession: any = null,
  onApplyToEditor: (text: string, mode: "replace" | "insert-below" | "insert-above") => void
) {
  const [messages, setMessages] = useState<AIWorkspaceMessage[]>([]);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [snippetLibrary, setSnippetLibrary] = useState<string[]>([]);
  const [uiPreferences, setUiPreferences] = useState({
    panelWidth: 288,
    showHistory: true,
    quickActionsOrder: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Decoupled Rewrite quick action states
  const [rewriteOutput, setRewriteOutput] = useState<string | null>(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  // Load preferences, snippets & session
  useEffect(() => {
    async function loadConfigAndSession() {
      try {
        // Load snippets & preferences
        const prefRes = await fetch("/api/pirateCOS/ai-config/preferences");
        const prefData = await prefRes.json();
        if (prefData.success && prefData.workflowMemory) {
          setSnippetLibrary(prefData.workflowMemory.snippetLibrary || []);
          if (prefData.workflowMemory.uiPreferences) {
            setUiPreferences(prefData.workflowMemory.uiPreferences);
          }
        }

        // Load initial session if post is loaded
        if (postId) {
          const postRes = await fetch(`/api/pirateCOS/posts/${postId}`);
          const postData = await postRes.json();
          if (postData.success && postData.data?.aiWorkspaceSession) {
            const session = postData.data.aiWorkspaceSession;
            setMessages(session.messages || []);
            setGenerations(session.generations || []);
          } else if (initialSession) {
            setMessages(initialSession.messages || []);
            setGenerations(initialSession.generations || []);
          }
        }
      } catch (err) {
        console.error("Failed to load workspace configuration:", err);
      }
    }
    loadConfigAndSession();
  }, [postId, initialSession]);

  // Save session to post in the DB
  const saveSessionToPost = useCallback(
    async (updatedMessages: AIWorkspaceMessage[], updatedGenerations: GenerationRecord[]) => {
      if (!postId) return;
      try {
        await fetch(`/api/pirateCOS/posts/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aiWorkspaceSession: {
              messages: updatedMessages.slice(-20), // trim to keep last 20 max
              generations: updatedGenerations,
              lastActiveAt: new Date(),
            },
          }),
        });
      } catch (err) {
        console.error("Failed to persist AI workspace session:", err);
      }
    },
    [postId]
  );

  // Send message in chat mode
  const sendMessage = useCallback(
    async (content: string, selectedText?: string, engine?: string, model?: string) => {
      if (!content.trim() || loading) return;

      const userMsg: AIWorkspaceMessage = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content,
        timestamp: new Date(),
        selectedTextContext: selectedText,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pirateCOS/ai/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            action: "chat",
            userMessage: content,
            selectedText,
            sessionHistory: updatedMessages,
            engine,
            model,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate AI response.");
        }

        const genRecord: GenerationRecord = {
          id: data.generationId,
          prompt: content,
          output: data.output,
          mode: "chat",
          isAccepted: false,
          selectedTextContext: selectedText,
        };

        const assistantMsg: AIWorkspaceMessage = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: data.output,
          timestamp: new Date(),
          associatedGenerationId: data.generationId,
          selectedTextContext: selectedText,
        };

        const finalMessages = [...updatedMessages, assistantMsg];
        const finalGenerations = [...generations, genRecord];

        setMessages(finalMessages);
        setGenerations(finalGenerations);
        saveSessionToPost(finalMessages, finalGenerations);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [messages, generations, postId, loading, saveSessionToPost]
  );

  // Trigger quick actions (improve, shorten, expand, etc.)
  const triggerQuickAction = useCallback(
    async (
      action: string | string[],
      selectedText?: string,
      tone?: string,
      engine?: string,
      model?: string,
      instruction?: string
    ) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      // Create a user indicator message
      const actionNames = Array.isArray(action) ? action.join(" + ") : action;
      const promptLabel = tone && (action === "tone" || (Array.isArray(action) && action.includes("tone"))) ? `Tone: ${tone}` : "";
      const userMsg: AIWorkspaceMessage = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: `Quick Action: ${actionNames} ${promptLabel ? `(${promptLabel})` : ""}${instruction ? ` | Instruction: "${instruction}"` : ""}`,
        timestamp: new Date(),
        selectedTextContext: selectedText,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);

      try {
        const response = await fetch("/api/pirateCOS/ai/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            action,
            selectedText,
            tone,
            sessionHistory: updatedMessages,
            engine,
            model,
            userMessage: instruction,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to trigger quick action.");
        }

        const genRecord: GenerationRecord = {
          id: data.generationId,
          prompt: `Action: ${actionNames}`,
          output: data.output,
          mode: Array.isArray(action) ? action[0] : action,
          isAccepted: false,
          selectedTextContext: selectedText,
        };

        const assistantMsg: AIWorkspaceMessage = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: data.output,
          timestamp: new Date(),
          associatedGenerationId: data.generationId,
          selectedTextContext: selectedText,
        };

        const finalMessages = [...updatedMessages, assistantMsg];
        const finalGenerations = [...generations, genRecord];

        setMessages(finalMessages);
        setGenerations(finalGenerations);
        saveSessionToPost(finalMessages, finalGenerations);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [messages, generations, postId, loading, saveSessionToPost]
  );

  // Decoupled Rewrite Action handler (does not affect messages/chat history)
  const runRewriteAction = useCallback(
    async (
      action: string | string[],
      selectedText?: string,
      tone?: string,
      engine?: string,
      model?: string,
      instruction?: string
    ) => {
      if (rewriteLoading) return;

      setRewriteLoading(true);
      setRewriteError(null);
      setRewriteOutput(null);

      try {
        const response = await fetch("/api/pirateCOS/ai/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            action,
            selectedText,
            tone,
            engine,
            model,
            userMessage: instruction,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to rewrite text.");
        }

        setRewriteOutput(data.output);

        // Record in generations history for completeness
        const genRecord: GenerationRecord = {
          id: data.generationId,
          prompt: `Rewrite: ${Array.isArray(action) ? action.join(" + ") : action}`,
          output: data.output,
          mode: Array.isArray(action) ? action[0] : action,
          isAccepted: false,
          selectedTextContext: selectedText,
        };

        const updatedGenerations = [...generations, genRecord];
        setGenerations(updatedGenerations);
        saveSessionToPost(messages, updatedGenerations);
      } catch (err: any) {
        setRewriteError(err.message || "An error occurred during rewrite.");
      } finally {
        setRewriteLoading(false);
      }
    },
    [generations, messages, postId, rewriteLoading, saveSessionToPost]
  );

  const clearRewriteOutput = useCallback(() => {
    setRewriteOutput(null);
    setRewriteError(null);
  }, []);

  // Apply a generated output to the TipTap editor
  const applyGeneration = useCallback(
    (generationId: string, mode: "replace" | "insert-below" | "insert-above") => {
      const record = generations.find((g) => g.id === generationId);
      if (!record) return;

      const updatedGenerations = generations.map((g) =>
        g.id === generationId ? { ...g, isAccepted: true, appliedAt: new Date() } : g
      );

      setGenerations(updatedGenerations);
      saveSessionToPost(messages, updatedGenerations);

      // Trigger structural update callback
      onApplyToEditor(record.output, mode);
    },
    [generations, messages, saveSessionToPost, onApplyToEditor]
  );

  // Save selection/output snippet to style preferences
  const saveSnippet = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      const res = await fetch("/api/pirateCOS/ai-config/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-snippet",
          snippet: text.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.workflowMemory) {
        setSnippetLibrary(data.workflowMemory.snippetLibrary || []);
      }
    } catch (err) {
      console.error("Failed to save snippet:", err);
    }
  }, []);

  // Delete snippet from style preferences
  const deleteSnippet = useCallback(async (text: string) => {
    try {
      const res = await fetch("/api/pirateCOS/ai-config/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-snippet",
          snippet: text,
        }),
      });
      const data = await res.json();
      if (data.success && data.workflowMemory) {
        setSnippetLibrary(data.workflowMemory.snippetLibrary || []);
      }
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  }, []);

  // Update UI Preferences (like panelWidth, showHistory, etc.)
  const saveUIPreference = useCallback(async (prefs: Partial<typeof uiPreferences>) => {
    const updated = { ...uiPreferences, ...prefs };
    setUiPreferences(updated);
    try {
      await fetch("/api/pirateCOS/ai-config/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uiPreferences: prefs,
        }),
      });
    } catch (err) {
      console.error("Failed to persist UI preferences:", err);
    }
  }, [uiPreferences]);

  // Try a variant: appends as a new user + assistant card without losing old ones
  const triggerVariant = useCallback(
    async (generationId: string, engine?: string, model?: string) => {
      const record = generations.find((g) => g.id === generationId);
      if (!record || loading) return;

      setLoading(true);
      setError(null);

      const userMsg: AIWorkspaceMessage = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: `Try a variant of the suggestion: "${record.prompt || record.mode}"`,
        timestamp: new Date(),
        selectedTextContext: record.selectedTextContext,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);

      try {
        const response = await fetch("/api/pirateCOS/ai/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            action: record.mode || "chat",
            selectedText: record.selectedTextContext,
            userMessage: record.prompt,
            tone: "variant", // trigger a variation path
            sessionHistory: updatedMessages,
            engine,
            model,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to trigger variant generation.");
        }

        const genRecord: GenerationRecord = {
          id: data.generationId,
          prompt: `Variant of: ${record.prompt || record.mode}`,
          output: data.output,
          mode: record.mode || "chat",
          isAccepted: false,
          selectedTextContext: record.selectedTextContext,
        };

        const assistantMsg: AIWorkspaceMessage = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: data.output,
          timestamp: new Date(),
          associatedGenerationId: data.generationId,
          selectedTextContext: record.selectedTextContext,
        };

        const finalMessages = [...updatedMessages, assistantMsg];
        const finalGenerations = [...generations, genRecord];

        setMessages(finalMessages);
        setGenerations(finalGenerations);
        saveSessionToPost(finalMessages, finalGenerations);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [messages, generations, postId, loading, saveSessionToPost]
  );

  // Clear/reset the chat thread session
  const clearSession = useCallback(async () => {
    setMessages([]);
    setGenerations([]);
    if (!postId) return;
    try {
      await fetch(`/api/pirateCOS/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiWorkspaceSession: {
            messages: [],
            generations: [],
            lastActiveAt: new Date(),
          },
        }),
      });
    } catch (err) {
      console.error("Failed to clear AI workspace session:", err);
    }
  }, [postId]);

  return {
    messages,
    generations,
    snippetLibrary,
    uiPreferences,
    loading,
    error,
    sendMessage,
    triggerQuickAction,
    applyGeneration,
    saveSnippet,
    deleteSnippet,
    saveUIPreference,
    triggerVariant,
    clearSession,
    // Decoupled rewrite states & handlers
    rewriteOutput,
    rewriteLoading,
    rewriteError,
    runRewriteAction,
    clearRewriteOutput,
  };
}

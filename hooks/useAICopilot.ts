import { useState, useEffect, useRef } from "react";

export interface WarningItem {
  id: string;
  type: "buzzword" | "bloat" | "heading" | "passive";
  message: string;
  match: string;
  suggestion: string;
}

export function useAICopilot(content: string, isProTier = true) {
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Co-pilot scanning is a high-value feature restricted to authed pro tier users
    if (!isProTier || !content || content.trim().length < 15) {
      setWarnings([]);

      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/pirateCOS/ai/copilot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = await res.json();

        if (data.success && data.warnings) {
          setWarnings(data.warnings);
        }
      } catch (err) {
        console.error("Co-pilot check failed", err);
      } finally {
        setLoading(false);
      }
    }, 2000); // 2-second debounce to prevent excessive server requests and credit depletion

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [content, isProTier]);

  const dismissWarning = (id: string) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  };

  return {
    warnings,
    loading,
    dismissWarning,
    setWarnings,
  };
}

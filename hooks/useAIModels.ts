"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AIEngine,
  AIModelEntry,
  getModelsForEngine,
  AI_PROVIDERS,
  AIProviderEntry,
} from "@/lib/pirateCOS/ai-registry";
import {
  isContentModel,
  labelFromModelId,
  mergeWithFallback,
} from "@/lib/pirateCOS/ai-model-discovery";

type ModelSource = "live" | "fallback" | "mixed";

export function useAIModels(engine: AIEngine) {
  const fallbackModels = useMemo(() => getModelsForEngine(engine), [engine]);
  const [models, setModels] = useState<AIModelEntry[]>(fallbackModels);
  const [source, setSource] = useState<ModelSource>("fallback");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabledEngines, setEnabledEngines] = useState<Record<AIEngine, boolean>>({
    openai: true,
    gemini: true,
    mistral: true,
    anthropic: true,
    grok: true,
    openrouter: true,
    puter: true,
  });

  useEffect(() => {
    fetch("/api/pirateCOS/ai-config")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setEnabledEngines({
            openai: d.openaiEnabled ?? true,
            gemini: d.geminiEnabled ?? true,
            mistral: d.mistralEnabled ?? true,
            anthropic: d.anthropicEnabled ?? true,
            grok: d.grokEnabled ?? true,
            openrouter: d.openrouterEnabled ?? true,
            puter: d.puterEnabled ?? true,
          });
        }
      })
      .catch(() => {});
  }, []);

  const enabledProviders = useMemo(() => {
    return AI_PROVIDERS.filter((p) => enabledEngines[p.id] !== false);
  }, [enabledEngines]);

  useEffect(() => {
    let cancelled = false;

    setModels(fallbackModels);
    setSource("fallback");
    setError(null);

    if (engine === "puter") {
      setIsLoading(true);
      import("@heyputer/puter.js")
        .then(async ({ puter }) => {
          if (cancelled) return;
          try {
            const puterModels = await puter.ai.listModels();
            if (cancelled) return;

            const liveIds = puterModels.map((m: any) => m?.id || m?.name || String(m));
            const merged = mergeWithFallback("puter", liveIds);

            setModels(merged.length ? merged : fallbackModels);
            setSource("mixed");
          } catch (err) {
            if (cancelled) return;
            setModels(fallbackModels);
            setSource("fallback");
            setError(err instanceof Error ? err.message : "Puter model list failed");
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setModels(fallbackModels);
          setSource("fallback");
          setError(err instanceof Error ? err.message : "Failed to load Puter SDK");
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);

    fetch(`/api/pirateCOS/ai-models?engine=${encodeURIComponent(engine)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success || !Array.isArray(data.models)) {
          throw new Error(data.error || "Failed to load provider models");
        }
        setModels(data.models.length ? data.models : fallbackModels);
        setSource(data.source || "fallback");
        setError(data.error || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setModels(fallbackModels);
        setSource("fallback");
        setError(err instanceof Error ? err.message : "Model fetch failed");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [engine, fallbackModels]);

  return { models, source, isLoading, error, enabledProviders, enabledEngines };
}

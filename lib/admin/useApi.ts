"use client";

import { useEffect, useRef, useState } from "react";

import { useDashboard } from "./DashboardContext";

interface State<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Fetches a dashboard API endpoint, automatically appending the shared date
 * range and refetching whenever it changes. Aborts the in-flight request on
 * unmount / range change.
 *
 * @param path   e.g. "/api/admin/overview"
 * @param params extra query params merged after the range
 * @param withRange set false for endpoints that ignore the date range
 */
export function useApi<T>(
  path: string | null,
  params?: Record<string, string | number | undefined>,
  withRange = true,
): State<T> & { refetch: () => void } {
  const { rangeQuery, rangeKey } = useDashboard();
  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    loading: Boolean(path),
  });
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const extra = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join("&")
    : "";

  useEffect(() => {
    if (!path) return;

    abortRef.current?.abort();
    const ac = new AbortController();

    abortRef.current = ac;

    setState((s) => ({ ...s, loading: true, error: null }));

    const qs = [withRange ? rangeQuery : "", extra].filter(Boolean).join("&");
    const url = qs ? `${path}?${qs}` : path;

    fetch(url, { signal: ac.signal, credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));

        if (!res.ok)
          throw new Error(json.error || `Request failed (${res.status})`);

        return json as T;
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({
          data: null,
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: false,
        });
      });

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, extra, withRange ? rangeKey : "static", tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}

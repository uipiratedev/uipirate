import { useCallback, useSyncExternalStore } from "react";

/**
 * One `matchMedia` query + `change` listener per breakpoint, shared across
 * every `useIsMobile()` call site. Previously each consumer (navbar,
 * StickyMobileCTA, workCard, aboutCard, etc.) ran its own `resize` listener —
 * on mobile, `resize` also fires when the browser chrome (address bar)
 * shows/hides during scroll, so 7+ independent listeners were each
 * redundantly re-evaluating and re-rendering mid-scroll. `matchMedia`'s
 * `change` event only fires when the query's match state actually flips.
 */
const registry = new Map<
  number,
  { mql: MediaQueryList; subscribers: Set<() => void> }
>();

function getEntry(breakpoint: number) {
  let entry = registry.get(breakpoint);

  if (!entry) {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const subscribers = new Set<() => void>();

    mql.addEventListener("change", () => {
      subscribers.forEach((callback) => callback());
    });
    entry = { mql, subscribers };
    registry.set(breakpoint, entry);
  }

  return entry;
}

function getServerSnapshot() {
  return false;
}

/**
 * Detect if the viewport is mobile size.
 * @param breakpoint - Pixel width to consider as mobile (default: 768)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const entry = getEntry(breakpoint);

      entry.subscribers.add(callback);

      return () => entry.subscribers.delete(callback);
    },
    [breakpoint],
  );

  const getSnapshot = useCallback(
    () => getEntry(breakpoint).mql.matches,
    [breakpoint],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

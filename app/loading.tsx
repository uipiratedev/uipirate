/**
 * Route-level loading boundary.
 *
 * With the root layout no longer forcing dynamic rendering, most navigations are
 * fully prefetched and switch instantly with no server round-trip — this UI
 * never shows for them. It only appears when the destination genuinely needs to
 * wait on the server (ISR cache miss, uncached data fetch), giving an immediate
 * visual response on click instead of the "nothing happens for 2s" freeze.
 *
 * Keeps the navbar/footer in place (it only replaces <main>), so it reads as
 * "this page is loading", not "the app reset".
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="spinner" role="status" aria-label="Loading">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

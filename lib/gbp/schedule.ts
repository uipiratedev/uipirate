/**
 * Which queued posts go out on a given run.
 *
 * Two lanes, because the two kinds of post have opposite needs:
 *
 *  - **new** — something you just wrote and published. It should reach Google
 *    within a day, so it is never held back by the backlog.
 *  - **backlog** — everything that already existed when syncing started (28
 *    posts). Announcing all of them at once looks like spam and can get the
 *    posts suppressed, so they drip out slowly, newest first.
 *
 * Pure (a clock is passed in) so the cadence is unit tested.
 */

export interface QueueItem {
  slug: string;
  status: "queued" | "publishing" | "published" | "failed" | "skipped";
  origin: "new" | "backlog";
  /** CMS publish date; used to order the backlog newest-first. */
  postPublishedAt?: string | null;
  attempts?: number;
  /** When this was last sent to Google. */
  publishedAt?: Date | string | null;
}

export interface ScheduleOptions {
  /** Minimum hours between backlog posts. 84 ≈ 2 per week. */
  backlogGapHours?: number;
  /** Cap on brand-new posts per run, so a bulk import cannot flood the profile. */
  maxNewPerRun?: number;
  /** Failed posts are retried automatically up to this many attempts. */
  maxAttempts?: number;
}

const DEFAULTS: Required<ScheduleOptions> = {
  backlogGapHours: 84,
  maxNewPerRun: 3,
  maxAttempts: 3,
};

const ts = (v: Date | string | null | undefined) =>
  v ? new Date(v).getTime() : 0;

/** The most recent time a backlog post went out, or 0 if none has. */
export function lastBacklogPublish(queue: readonly QueueItem[]): number {
  return queue
    .filter((q) => q.origin === "backlog" && q.status === "published")
    .reduce((latest, q) => Math.max(latest, ts(q.publishedAt)), 0);
}

export function selectToPublish(
  queue: readonly QueueItem[],
  now: Date,
  options: ScheduleOptions = {},
): QueueItem[] {
  const o = { ...DEFAULTS, ...options };

  // A failed post is retried automatically until it runs out of attempts.
  const due = queue.filter(
    (q) =>
      q.status === "queued" ||
      (q.status === "failed" && (q.attempts ?? 0) < o.maxAttempts),
  );

  const newest = (a: QueueItem, b: QueueItem) =>
    ts(b.postPublishedAt) - ts(a.postPublishedAt);

  const fresh = due
    .filter((q) => q.origin === "new")
    .sort(newest)
    .slice(0, o.maxNewPerRun);

  const picked = [...fresh];

  const gapMs = o.backlogGapHours * 3_600_000;
  const lastBacklog = lastBacklogPublish(queue);

  // One backlog post per run at most, and only once the gap has passed.
  if (now.getTime() - lastBacklog >= gapMs) {
    const next = due.filter((q) => q.origin === "backlog").sort(newest)[0];

    if (next) picked.push(next);
  }

  return picked;
}

/** The queue head for display: what will go out next, and roughly when. */
export function nextBacklogAt(
  queue: readonly QueueItem[],
  now: Date,
  options: ScheduleOptions = {},
): Date | null {
  const o = { ...DEFAULTS, ...options };

  if (!queue.some((q) => q.origin === "backlog" && q.status === "queued"))
    return null;

  const earliest = lastBacklogPublish(queue) + o.backlogGapHours * 3_600_000;

  return new Date(Math.max(earliest, now.getTime()));
}

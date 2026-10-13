"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/react";

import {
  DEFAULT_WA_DRAFT,
  canWhatsapp,
  fillDraft,
  mailHref,
  telHref,
  waHref,
  waMessage,
  type Channel,
  type Contact,
} from "./types";

import { fmtDateTime } from "@/components/admin/format";
import { MARKETING_STATUSES, WEBSITE_LABELS } from "@/lib/marketing/constants";
import { useDrawerScrollLock } from "@/hooks/useDrawerScrollLock";

const CHANNEL_LABEL: Record<Channel, string> = {
  call: "📞 Call",
  whatsapp: "💬 WhatsApp",
  email: "✉️ Email",
};

type Tab = "details" | "activity";
type ActivityKind =
  | "call"
  | "whatsapp"
  | "email"
  | "note"
  | "status"
  | "website"
  | "outreach"
  | "draft"
  | "import";

interface TimelineItem {
  kind: ActivityKind;
  at: string;
  byName?: string;
  title: string;
  detail?: string;
}

const KIND_META: Record<
  ActivityKind,
  { icon: string; label: string; tone: string }
> = {
  call: { icon: "📞", label: "Calls", tone: "bg-emerald-50 text-emerald-700" },
  whatsapp: {
    icon: "💬",
    label: "WhatsApp",
    tone: "bg-green-50 text-green-700",
  },
  email: { icon: "✉️", label: "Emails", tone: "bg-blue-50 text-blue-700" },
  note: { icon: "📝", label: "Notes", tone: "bg-amber-50 text-amber-700" },
  status: { icon: "🔁", label: "Status", tone: "bg-violet-50 text-violet-700" },
  website: { icon: "🌐", label: "Website", tone: "bg-sky-50 text-sky-700" },
  outreach: { icon: "🚀", label: "Outreach", tone: "bg-rose-50 text-rose-700" },
  draft: { icon: "✍️", label: "Drafts", tone: "bg-gray-100 text-gray-700" },
  import: { icon: "📥", label: "Import", tone: "bg-gray-100 text-gray-700" },
};

function buildTimeline(c: Contact): TimelineItem[] {
  const items: TimelineItem[] = [
    ...c.touches.map((t) => ({
      kind: t.channel as ActivityKind,
      at: t.at,
      byName: t.byName,
      title:
        t.channel === "call"
          ? "Call made"
          : t.channel === "whatsapp"
            ? "WhatsApp message sent"
            : "Email sent",
      detail: t.channel === "whatsapp" ? t.message : undefined,
    })),
    ...c.notes.map((n) => ({
      kind: "note" as const,
      at: n.at,
      byName: n.byName,
      title: "Note added",
      detail: n.text,
    })),
    ...(c.activities ?? []).map((a) => ({
      kind: a.type as ActivityKind,
      at: a.at,
      byName: a.byName,
      title: a.summary,
    })),
    {
      kind: "import",
      at: c.createdAt,
      title: "Added to the list",
      detail: c.batch,
    },
  ];

  return items.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm text-gray-800">
        {children || "—"}
      </dd>
    </div>
  );
}

export function OutreachDrawer({
  contact,
  canManage,
  showContact,
  onClose,
  onPatch,
  onTouch,
}: {
  contact: Contact;
  canManage: boolean;
  /** Contact actions only make sense once a lead is in Outreach. */
  showContact: boolean;
  onClose: () => void;
  onPatch: (id: string, body: Record<string, unknown>) => Promise<void>;
  onTouch: (c: Contact, channel: Channel, message?: string) => void;
}) {
  useDrawerScrollLock({ enabled: true, onClose });

  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(contact.whatsappDraft || DEFAULT_WA_DRAFT);
  const c = contact;
  const [tab, setTab] = useState<Tab>("details");
  const [filter, setFilter] = useState<ActivityKind | "all">("all");
  const timeline = useMemo(() => buildTimeline(c), [c]);
  const shown =
    filter === "all" ? timeline : timeline.filter((i) => i.kind === filter);
  const kinds = Array.from(new Set(timeline.map((i) => i.kind)));

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    await onPatch(c.id, { note });
    setNote("");
    setSaving(false);
  }

  return (
    <Drawer
      isOpen
      backdrop="blur"
      classNames={{ base: "max-h-screen bg-white shadow-2xl", body: "p-0" }}
      placement="right"
      size="xl"
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex shrink-0 flex-col items-start gap-1 border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                {c.name}
              </h2>
              <p className="text-xs text-gray-400">
                {[c.category, [c.city, c.state].filter(Boolean).join(", ")]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div
                className="mt-3 inline-flex rounded-xl bg-gray-100 p-1 text-xs font-semibold"
                role="tablist"
              >
                {(
                  [
                    ["details", "Details"],
                    ["activity", `Activity (${timeline.length})`],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    aria-selected={tab === key}
                    className={`rounded-lg px-4 py-1.5 transition-colors ${
                      tab === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    role="tab"
                    type="button"
                    onClick={() => setTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </DrawerHeader>

            <DrawerBody
              className="space-y-6 overflow-y-auto overscroll-contain px-6 py-5"
              data-lenis-prevent="true"
            >
              {tab === "activity" ? (
                <section>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(["all", ...kinds] as const).map((k) => (
                      <button
                        key={k}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition-colors ${
                          filter === k
                            ? "bg-gray-900 text-white ring-gray-900"
                            : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
                        }`}
                        type="button"
                        onClick={() => setFilter(k)}
                      >
                        {k === "all" ? "All" : KIND_META[k].label}
                      </button>
                    ))}
                  </div>
                  <ol className="space-y-3">
                    {shown.map((i, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${KIND_META[i.kind].tone}`}
                        >
                          {KIND_META[i.kind].icon}
                        </span>
                        <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-sm font-medium text-gray-900">
                            {i.title}
                          </p>
                          {i.detail ? (
                            <p className="mt-1 whitespace-pre-wrap break-words text-xs text-gray-600">
                              {i.detail}
                            </p>
                          ) : null}
                          <p className="mt-1 text-[11px] text-gray-400">
                            {fmtDateTime(i.at)}
                            {i.byName ? ` · ${i.byName}` : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                    {!shown.length ? (
                      <li className="text-xs text-gray-400">
                        No activity yet.
                      </li>
                    ) : null}
                  </ol>
                </section>
              ) : null}

              {tab === "details" && showContact ? (
                <div className="flex flex-wrap items-center gap-2">
                  {c.phone ? (
                    <a
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      href={telHref(c.phone)}
                      onClick={() => canManage && onTouch(c, "call")}
                    >
                      Call
                    </a>
                  ) : null}
                  {canWhatsapp(c) ? (
                    <a
                      className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                      href={waHref(c, draft)}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={() =>
                        canManage && onTouch(c, "whatsapp", waMessage(c, draft))
                      }
                    >
                      WhatsApp
                    </a>
                  ) : null}
                  {c.email ? (
                    <a
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      href={mailHref(c)}
                      onClick={() => canManage && onTouch(c, "email")}
                    >
                      Email
                    </a>
                  ) : null}
                  {canManage ? (
                    <select
                      aria-label="Pipeline status"
                      className="ml-auto rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs capitalize"
                      value={c.status}
                      onChange={(e) =>
                        onPatch(c.id, { status: e.target.value })
                      }
                    >
                      {MARKETING_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ) : null}

              {tab === "details" ? (
                <>
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                      Company
                    </h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <Field label="Phone">{c.phone}</Field>
                      <Field label="Email">{c.email}</Field>
                      <Field label="Website">
                        {c.website ? (
                          <a
                            className="text-blue-600 hover:underline"
                            href={c.website}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {c.website}
                          </a>
                        ) : null}
                      </Field>
                      <Field label="Has Website">
                        {
                          WEBSITE_LABELS[
                            c.hasWebsite as keyof typeof WEBSITE_LABELS
                          ]
                        }
                      </Field>
                      <Field label="Category / Specialty">{c.category}</Field>
                      <Field label="City / State">
                        {[c.city, c.state].filter(Boolean).join(", ")}
                      </Field>
                    </dl>
                  </section>

                  {showContact && canWhatsapp(c) ? (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        WhatsApp message
                      </h3>
                      <textarea
                        aria-label="WhatsApp message draft"
                        className="min-h-[110px] w-full rounded-xl border border-gray-200 p-3 text-sm leading-relaxed"
                        readOnly={!canManage}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                      <p className="mt-1 text-[11px] text-gray-400">
                        Placeholders: {"{{name}}"}, {"{{city}}"}. Preview:{" "}
                        <span className="text-gray-600">
                          {fillDraft(draft, c)}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {canManage ? (
                          <>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                onPatch(c.id, { whatsappDraft: draft })
                              }
                            >
                              Save draft
                            </Button>
                            <Button
                              size="sm"
                              variant="light"
                              onPress={() => setDraft(DEFAULT_WA_DRAFT)}
                            >
                              Reset
                            </Button>
                          </>
                        ) : null}
                        <a
                          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                          href={waHref(c, draft)}
                          rel="noopener noreferrer"
                          target="_blank"
                          onClick={() => {
                            if (!canManage) return;
                            onPatch(c.id, { whatsappDraft: draft });
                            onTouch(c, "whatsapp", waMessage(c, draft));
                          }}
                        >
                          Send on WhatsApp
                        </a>
                      </div>
                    </section>
                  ) : null}

                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Pitch Hook Angle
                      </h3>
                      {c.pitch ? (
                        <button
                          className="text-xs font-medium text-gray-500 hover:text-gray-900"
                          onClick={() =>
                            navigator.clipboard?.writeText(c.pitch)
                          }
                        >
                          Copy
                        </button>
                      ) : null}
                    </div>
                    <p className="rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                      {c.pitch || "—"}
                    </p>
                  </section>

                  {showContact ? (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Contact history
                      </h3>
                      {c.touches.length ? (
                        <ul className="space-y-1.5 text-xs">
                          {c.touches.map((t, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                            >
                              <span className="font-medium text-gray-800">
                                {CHANNEL_LABEL[t.channel]}
                              </span>
                              <span className="text-gray-500">
                                {fmtDateTime(t.at)}
                                {t.byName ? ` · ${t.byName}` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Not contacted yet.
                        </p>
                      )}
                    </section>
                  ) : null}

                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                      Notes
                    </h3>
                    <ul className="space-y-2">
                      {c.notes.map((n) => (
                        <li
                          key={n.id}
                          className="rounded-xl bg-amber-50 p-3 text-xs"
                        >
                          <p className="whitespace-pre-wrap text-gray-800">
                            {n.text}
                          </p>
                          <p className="mt-1 text-gray-400">
                            {n.byName} · {fmtDateTime(n.at)}
                          </p>
                        </li>
                      ))}
                      {!c.notes.length ? (
                        <li className="text-xs text-gray-400">No notes yet.</li>
                      ) : null}
                    </ul>
                    {canManage ? (
                      <div className="mt-3 flex gap-2">
                        <textarea
                          aria-label="New note"
                          className="min-h-[60px] flex-1 rounded-lg border border-gray-200 p-2 text-sm"
                          placeholder="Add a note…"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                        <Button
                          color="primary"
                          isDisabled={!note.trim()}
                          isLoading={saving}
                          size="sm"
                          onPress={addNote}
                        >
                          Add
                        </Button>
                      </div>
                    ) : null}
                  </section>

                  {Object.keys(c.extra).length ? (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Other sheet columns
                      </h3>
                      <dl className="grid grid-cols-2 gap-4">
                        {Object.entries(c.extra).map(([k, v]) => (
                          <Field key={k} label={k}>
                            {v}
                          </Field>
                        ))}
                      </dl>
                    </section>
                  ) : null}

                  <p className="text-[11px] text-gray-400">
                    Imported {fmtDateTime(c.createdAt)} · {c.batch}
                  </p>
                </>
              ) : null}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

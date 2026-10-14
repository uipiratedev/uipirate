"use client";

import { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { FolderPicker, type FolderRef } from "./FolderPicker";
import { OutreachDrawer } from "./OutreachDrawer";
import {
  canWhatsapp,
  emailBody,
  emailSubject,
  mailHref,
  telHref,
  waHref,
  waMessage,
  type Channel,
  type Contact,
} from "./types";

import {
  sheetToRows,
  parseDelimited,
  looksLikeHeader,
  autoDetectColumns,
  gridToRows,
  FIELD_LABELS,
  type ContactField,
} from "@/lib/marketing/parseSheet";
import { useApi } from "@/lib/admin/useApi";
import {
  PageHeader,
  Card,
  StatePanel,
  StatusChip,
} from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Icon } from "@/components/admin/icons";
import { fmtInt } from "@/components/admin/format";
import {
  MARKETING_STATUSES,
  WEBSITE_LABELS,
  WEBSITE_STATES,
} from "@/lib/marketing/constants";

interface MarketingData {
  contacts: Contact[];
  stats: {
    total: number;
    leads: number;
    outreach: number;
    called: number;
    calls: number;
    pending: number;
    byStatus: Record<string, number>;
  };
}

export default function MarketingClient({
  canManage,
  stage,
}: {
  canManage: boolean;
  stage: "leads" | "outreach";
}) {
  const [folder, setFolder] = useState<FolderRef | null>(null);
  const [country, setCountry] = useState<FolderRef | null>(null);

  if (!folder)
    return (
      <FolderPicker
        canManage={canManage}
        stage={stage}
        selectedCountry={country}
        onSelectCountry={setCountry}
        onOpen={setFolder}
      />
    );

  return (
    <ContactList
      key={folder.id}
      canManage={canManage}
      country={country}
      folder={folder}
      stage={stage}
      onBack={() => setFolder(null)}
    />
  );
}

function ContactList({
  canManage,
  stage,
  folder,
  country,
  onBack,
}: {
  canManage: boolean;
  stage: "leads" | "outreach";
  folder: FolderRef;
  country?: FolderRef | null;
  onBack: () => void;
}) {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState<{
    contact: Contact;
    value: string;
    send: boolean;
  } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<MarketingData>(
    "/api/admin/outreach",
    {
      stage,
      folder: folder.id,
      status: stage === "outreach" ? status || undefined : undefined,
      q: q || undefined,
    },
    false,
  );

  async function patch(
    id: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    await fetch(`/api/admin/outreach/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    refetch();
  }

  const [busy, setBusy] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePasteSuccess(json: {
    imported: number;
    updated: number;
    unchanged: number;
    skipped?: number;
  }) {
    setMsg({
      ok: true,
      text: `${json.imported} new, ${json.updated} updated, ${json.unchanged} unchanged${json.skipped ? `, ${json.skipped} invalid skipped` : ""}.`,
    });
    refetch();
  }

  async function onFile(file: File) {
    setMsg(null);
    if (!/\.csv$|\.txt$/i.test(file.name) && !file.type.includes("csv")) {
      setMsg({
        ok: false,
        text: "Upload a .csv file (in Excel / Google Sheets: File → Download → CSV).",
      });

      return;
    }
    setBusy(true);
    try {
      const rows = sheetToRows(await file.text());

      if (!rows.length) {
        setMsg({
          ok: false,
          text: "No usable rows. The sheet needs a header row with name plus phone or email.",
        });

        return;
      }
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          rows,
          folderId: folder.id === "none" ? undefined : folder.id,
        }),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed");
      setMsg({
        ok: true,
        text: `${json.imported} new, ${json.updated} updated, ${json.unchanged} unchanged${json.skipped ? `, ${json.skipped} invalid skipped` : ""}.`,
      });
      refetch();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function touch(c: Contact, channel: Channel, message?: string) {
    void patch(c.id, {
      logTouch: channel,
      ...(channel === "whatsapp" ? { message: message ?? waMessage(c) } : {}),
    });
  }

  const websiteColumn: Column<Contact> = {
    key: "hasWebsite",
    header: "Has Website",
    sortValue: (c) => c.hasWebsite,
    render: (c) => (
      <select
        aria-label={`Website status for ${c.name}`}
        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
        disabled={!canManage}
        value={c.hasWebsite}
        onChange={(e) => {
          const val = e.target.value;

          setPending({
            contact: c,
            value: val,
            send: val !== "" && val !== "has-website",
          });
        }}
      >
        <option value="">— Select —</option>
        {WEBSITE_STATES.map((w) => (
          <option key={w} value={w}>
            {WEBSITE_LABELS[w]}
          </option>
        ))}
      </select>
    ),
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);

      if (!next.delete(id)) next.add(id);

      return next;
    });

  const [confirmDelete, setConfirmDelete] = useState(false);

  async function deleteSelected() {
    const ids = [...selected];

    setConfirmDelete(false);
    if (!ids.length) return;
    const res = await fetch("/api/admin/outreach", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      setMsg({ ok: false, text: "Delete failed." });

      return;
    }
    setSelected(new Set());
    refetch();
  }

  const selectColumn: Column<Contact> = {
    key: "select",
    header: "",
    width: "2.5rem",
    render: (c) => (
      <input
        aria-label={`Select ${c.name}`}
        checked={selected.has(c.id)}
        className="h-4 w-4 cursor-pointer accent-gray-900"
        type="checkbox"
        onChange={() => toggle(c.id)}
      />
    ),
  };

  const link = "text-xs text-blue-600 hover:underline";
  const dash = <span className="text-xs text-gray-400">—</span>;

  const columns: Column<Contact>[] = [
    ...(canManage ? [selectColumn] : []),
    {
      key: "name",
      header: "Company Name",
      sortValue: (c) => c.name.toLowerCase(),
      render: (c) => (
        <button
          className="block min-w-[10rem] text-left text-xs font-semibold text-gray-900 hover:text-blue-600 hover:underline"
          onClick={() => setOpenId(c.id)}
        >
          {c.name}
        </button>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (c) => (
        <span className="block min-w-[9rem] font-mono text-xs text-gray-700">
          {c.phone || "—"}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (c) =>
        c.email ? (
          <a
            className={`block min-w-[10rem] ${link}`}
            href={`mailto:${c.email}`}
          >
            {c.email}
          </a>
        ) : (
          dash
        ),
    },
    {
      key: "website",
      header: "Website",
      render: (c) =>
        c.website ? (
          <a
            className={`block min-w-[10rem] ${link}`}
            href={c.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            {c.website.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          dash
        ),
    },
    websiteColumn,
    ...(stage === "outreach"
      ? [
          {
            key: "status",
            header: "Status",
            sortValue: (c: Contact) =>
              c.callCount + c.whatsappCount + c.emailCount,
            render: (c: Contact) => {
              const badges = [
                { icon: "📞", label: "Called", n: c.callCount },
                { icon: "💬", label: "WhatsApp", n: c.whatsappCount },
                { icon: "✉️", label: "Emailed", n: c.emailCount },
              ].filter((b) => b.n > 0);

              return (
                <div className="flex min-w-[10rem] flex-col gap-1">
                  <div className="flex flex-wrap gap-1">
                    {badges.length ? (
                      badges.map((b) => (
                        <span
                          key={b.label}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                        >
                          {b.icon} {b.label} ×{b.n}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-400">
                        Not contacted
                      </span>
                    )}
                  </div>
                  <StatusChip status={c.status} />
                </div>
              );
            },
          } as Column<Contact>,
        ]
      : []),
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (c) => (
        <div className="flex justify-end gap-1.5">
          {stage === "outreach" && c.phone ? (
            <a
              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
              href={telHref(c.phone)}
              onClick={() => canManage && touch(c, "call")}
            >
              Call
            </a>
          ) : null}
          {stage === "outreach" && canWhatsapp(c) ? (
            <a
              className="rounded-lg bg-green-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-600"
              href={waHref(c)}
              rel="noopener noreferrer"
              target="_blank"
              onClick={() => canManage && touch(c, "whatsapp")}
            >
              WhatsApp
            </a>
          ) : null}
          {stage === "outreach" && c.email ? (
            <a
              className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
              href={mailHref(c)}
              onClick={() =>
                canManage &&
                touch(
                  c,
                  "email",
                  `Subject: ${emailSubject(c)}\n\n${emailBody(c)}`,
                )
              }
            >
              Email
            </a>
          ) : null}
          <button
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            onClick={() => setOpenId(c.id)}
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  const st = data?.stats;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={onBack}
            >
              ← {country ? country.name : "All folders"}
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={refetch}
            >
              <Icon.refresh className="h-3.5 w-3.5 text-gray-400" />
              Refresh
            </button>
            {canManage && stage === "leads" && folder.id !== "none" ? (
              <>
                <input
                  ref={fileRef}
                  accept=".csv,text/csv"
                  className="hidden"
                  type="file"
                  onChange={(e) =>
                    e.target.files?.[0] && onFile(e.target.files[0])
                  }
                />
                <button
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  {busy ? "Uploading…" : "Upload sheet"}
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                  disabled={busy}
                  onClick={() => setShowPasteModal(true)}
                >
                  📋 Paste data
                </button>
              </>
            ) : null}
          </>
        }
        badge={`Marketing · ${country ? `${country.name} / ` : ""}${folder.name}`}
        description={
          stage === "leads"
            ? "Upload a contact sheet into this folder, then set Has Website to move leads into Outreach."
            : "Track every outreach record and call from here."
        }
      />

      {msg ? (
        <div
          className={`rounded-xl px-4 py-2.5 text-xs font-medium ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
          role="status"
        >
          {msg.text}
        </div>
      ) : null}

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {st ? (
          <KpiRow
            items={[
              {
                label: "Contacts",
                value: fmtInt(st.total),
                hint: "All uploaded records",
              },
              {
                label: "Not called",
                value: fmtInt(st.pending),
                hint: "Still to reach",
              },
              {
                label: "Called",
                value: fmtInt(st.called),
                hint: "At least one call",
              },
              {
                label: "Total calls",
                value: fmtInt(st.calls),
                hint: "Calls placed from here",
              },
              { label: "Won", value: fmtInt(st.byStatus.won ?? 0) },
            ]}
          />
        ) : null}

        <div className="mt-6">
          <Card
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <input
                  aria-label="Search contacts"
                  className="w-44 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                  placeholder="Search name, phone…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                {stage === "outreach" ? (
                  <select
                    aria-label="Filter by status"
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs capitalize"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    {MARKETING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            }
            subtitle={
              stage === "leads"
                ? "Pick “Has Website” for a lead to move it into Outreach"
                : "Contacts ready to call"
            }
            title={stage === "leads" ? "Leads" : "Outreach"}
          >
            {canManage && data?.contacts.length ? (
              <div className="mb-3 flex items-center gap-3 text-xs">
                <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-gray-700">
                  <input
                    checked={
                      data.contacts.length > 0 &&
                      data.contacts.every((c) => selected.has(c.id))
                    }
                    className="h-4 w-4 accent-gray-900"
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? new Set(data.contacts.map((c) => c.id))
                          : new Set(),
                      )
                    }
                  />
                  Select all ({data.contacts.length})
                </label>
                {selected.size ? (
                  <button
                    className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete selected ({selected.size})
                  </button>
                ) : null}
              </div>
            ) : null}
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                emptyText={
                  stage === "leads"
                    ? "No leads waiting — upload a sheet to get started."
                    : "Nothing in outreach yet — set Has Website on a lead."
                }
                layout="auto"
                rowKey={(c) => c.id}
                rows={data?.contacts ?? []}
              />
            </div>
          </Card>
        </div>
      </StatePanel>

      {openId && data?.contacts.find((c) => c.id === openId) ? (
        <OutreachDrawer
          canManage={canManage}
          contact={data.contacts.find((c) => c.id === openId)!}
          showContact={stage === "outreach"}
          onClose={() => setOpenId(null)}
          onPatch={patch}
          onTouch={touch}
        />
      ) : null}

      <Modal isOpen={confirmDelete} onOpenChange={setConfirmDelete}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete contacts</ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-700">
                  Delete {selected.size} selected contact(s)? This cannot be
                  undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={deleteSelected}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={Boolean(pending)}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-0.5">
                Website status
                <span className="text-xs font-normal text-gray-500">
                  {pending?.contact.name}
                </span>
              </ModalHeader>
              <ModalBody>
                <select
                  aria-label="Website status"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={pending?.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;

                    setPending((p) =>
                      p
                        ? {
                            ...p,
                            value: val,
                            send: val !== "" && val !== "has-website",
                          }
                        : p,
                    );
                  }}
                >
                  <option value="">— Select —</option>
                  {WEBSITE_STATES.map((w) => (
                    <option key={w} value={w}>
                      {WEBSITE_LABELS[w]}
                    </option>
                  ))}
                </select>
                <Checkbox
                  isDisabled={!pending?.value}
                  isSelected={Boolean(pending?.send)}
                  onValueChange={(send) =>
                    setPending((p) => (p ? { ...p, send } : p))
                  }
                >
                  Send to Outreach
                </Checkbox>
                <p className="text-xs text-gray-500">
                  Checked: the lead moves to Outreach. Unchecked: only the
                  website status is saved and the lead stays where it is.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    if (!pending) return;
                    await patch(pending.contact.id, {
                      hasWebsite: pending.value,
                      sendToOutreach: pending.send,
                    });
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {canManage && stage === "leads" && folder.id !== "none" ? (
        <PasteDataModal
          folderId={folder.id}
          isOpen={showPasteModal}
          onClose={() => setShowPasteModal(false)}
          onSuccess={handlePasteSuccess}
        />
      ) : null}
    </div>
  );
}

const AVAILABLE_FIELDS: ContactField[] = [
  "name",
  "phone",
  "email",
  "company",
  "category",
  "city",
  "state",
  "website",
  "hasWebsite",
  "pitch",
  "skip",
];

function PasteDataModal({
  isOpen,
  onClose,
  folderId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
  onSuccess: (json: {
    imported: number;
    updated: number;
    unchanged: number;
    skipped?: number;
  }) => void;
}) {
  const [text, setText] = useState("");
  const [grid, setGrid] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(false);
  const [mapping, setMapping] = useState<Record<number, ContactField>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function onTextChange(val: string) {
    setText(val);
    setErr("");

    if (!val.trim()) {
      setGrid([]);
      setMapping({});

      return;
    }

    const parsed = parseDelimited(val);

    setGrid(parsed);
    const isHeader = looksLikeHeader(parsed[0] || []);

    setHasHeader(isHeader);
    setMapping(autoDetectColumns(parsed, isHeader));
  }

  function toggleHeader(checked: boolean) {
    setHasHeader(checked);

    if (grid.length > 0) {
      setMapping(autoDetectColumns(grid, checked));
    }
  }

  const colCount = Math.max(...grid.map((r) => r.length), 0);
  const dataRowsCount = hasHeader ? Math.max(0, grid.length - 1) : grid.length;
  const previewRows = hasHeader ? grid.slice(1, 4) : grid.slice(0, 3);

  async function handleImport() {
    setErr("");
    const rows = gridToRows(grid, mapping, hasHeader);

    if (!rows.length) {
      setErr("No valid contacts found. Rows need at least a Name plus a Phone or Email.");

      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `Pasted data (${rows.length} rows)`,
          rows,
          folderId: folderId === "none" ? undefined : folderId,
        }),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Import failed");

      onSuccess(json);
      setText("");
      setGrid([]);
      onClose();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onOpenChange={(open) => {
        if (!open) {
          setText("");
          setGrid([]);
          setErr("");
          onClose();
        }
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Paste contacts from Excel / Sheets</ModalHeader>
            <ModalBody className="space-y-3">
              <p className="text-xs text-gray-500">
                Copy cells directly from Excel or Google Sheets (middle lines or with headers) and paste them below.
              </p>
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-gray-700"
                  htmlFor="paste-data-textarea"
                >
                  Clipboard content
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 p-3 font-mono text-xs leading-relaxed focus:border-gray-400 focus:outline-none"
                  id="paste-data-textarea"
                  placeholder="Paste rows here (Ctrl+V)..."
                  rows={5}
                  value={text}
                  onChange={(e) => onTextChange(e.target.value)}
                />
              </div>

              {grid.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-gray-800">
                      {fmtInt(dataRowsCount)} {dataRowsCount === 1 ? "contact row" : "contact rows"} detected
                    </span>
                    <label
                      className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-700 select-none"
                      htmlFor="has-header-checkbox"
                    >
                      <input
                        checked={hasHeader}
                        className="rounded border-gray-300 text-gray-900 focus:ring-0"
                        id="has-header-checkbox"
                        type="checkbox"
                        onChange={(e) => toggleHeader(e.target.checked)}
                      />
                      First row has column headers
                    </label>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Column Mapping Preview (first {previewRows.length} rows)
                    </span>
                    <div className="max-h-48 overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-gray-200 bg-gray-50">
                          <tr>
                            {Array.from({ length: colCount }).map((_, cIdx) => (
                              <th key={cIdx} className="min-w-[130px] p-2">
                                <select
                                  aria-label={`Mapping for column ${cIdx + 1}`}
                                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm"
                                  value={mapping[cIdx] || "skip"}
                                  onChange={(e) =>
                                    setMapping({
                                      ...mapping,
                                      [cIdx]: e.target.value as ContactField,
                                    })
                                  }
                                >
                                  {AVAILABLE_FIELDS.map((f) => (
                                    <option key={f} value={f}>
                                      {FIELD_LABELS[f]}
                                    </option>
                                  ))}
                                </select>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {previewRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50/50">
                              {Array.from({ length: colCount }).map((_, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="max-w-[160px] truncate p-2 text-xs text-gray-600"
                                  title={row[cIdx] || ""}
                                >
                                  {row[cIdx] || "—"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : null}

              {err ? <p className="text-xs font-medium text-red-600">{err}</p> : null}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setText("");
                  setGrid([]);
                  setErr("");
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!grid.length}
                isLoading={busy}
                onPress={handleImport}
              >
                {dataRowsCount > 0 ? `Import ${fmtInt(dataRowsCount)} leads` : "Import data"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

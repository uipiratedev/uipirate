"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { fmtInt } from "@/components/admin/format";

export interface FolderRef {
  /** Folder id, or "none" for contacts uploaded before folders existed. */
  id: string;
  name: string;
  parentId?: string | null;
}

interface FolderItem {
  id: string;
  name: string;
  parentId?: string | null;
  count: number;
  stateCount?: number;
}

interface FolderData {
  folders: FolderItem[];
  unsorted: number;
}

export function FolderPicker({
  stage,
  canManage,
  onOpen,
  selectedCountry,
  onSelectCountry,
}: {
  stage: "leads" | "outreach";
  canManage: boolean;
  onOpen: (f: FolderRef) => void;
  selectedCountry?: FolderRef | null;
  onSelectCountry?: (c: FolderRef | null) => void;
}) {
  const [internalCountry, setInternalCountry] = useState<FolderRef | null>(null);
  const activeCountry =
    selectedCountry !== undefined ? selectedCountry : internalCountry;
  const setActiveCountry = onSelectCountry || setInternalCountry;

  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const { data, loading, error, refetch } = useApi<FolderData>(
    "/api/admin/outreach/folders",
    { stage },
    false,
  );

  const allFolders = data?.folders || [];
  const countries = allFolders.filter((f) => !f.parentId);
  const states = activeCountry
    ? allFolders.filter((f) => f.parentId === activeCountry.id)
    : [];

  async function create() {
    if (!name.trim()) return;
    setErr("");
    const res = await fetch("/api/admin/outreach/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        parentId: activeCountry ? activeCountry.id : null,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setErr(json.error || "Could not create folder.");

      return;
    }
    setName("");
    await refetch();

    if (activeCountry) {
      onOpen({ id: json.id, name: json.name, parentId: activeCountry.id });
    } else {
      setActiveCountry({ id: json.id, name: json.name });
    }
  }

  const [dialog, setDialog] = useState<
    | {
        kind: "rename";
        id: string;
        current: string;
        value: string;
        parentId?: string | null;
      }
    | {
        kind: "delete";
        id: string;
        name: string;
        isCountry?: boolean;
        stateCount?: number;
      }
    | null
  >(null);
  const [saving, setSaving] = useState(false);

  async function confirmDialog() {
    if (!dialog) return;
    setSaving(true);
    setErr("");
    try {
      if (dialog.kind === "delete") {
        await fetch(`/api/admin/outreach/folders?id=${dialog.id}`, {
          method: "DELETE",
        });
        if (activeCountry?.id === dialog.id) {
          setActiveCountry(null);
        }
      } else if (dialog.kind === "rename") {
        const body: Record<string, unknown> = { id: dialog.id };

        if (dialog.value.trim() && dialog.value.trim() !== dialog.current) {
          body.name = dialog.value.trim();
        }

        if ("parentId" in dialog) {
          body.parentId = dialog.parentId ?? null;
        }

        if (body.name || "parentId" in body) {
          const res = await fetch("/api/admin/outreach/folders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!res.ok) setErr((await res.json()).error || "Update failed.");
        }
      }
      setDialog(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  const remove = (f: {
    id: string;
    name: string;
    isCountry?: boolean;
    stateCount?: number;
  }) =>
    setDialog({
      kind: "delete",
      id: f.id,
      name: f.name,
      isCountry: f.isCountry,
      stateCount: f.stateCount,
    });

  const rename = (id: string, current: string, parentId?: string | null) =>
    setDialog({
      kind: "rename",
      id,
      current,
      value: current === "No folder" ? "" : current,
      parentId: parentId ?? null,
    });

  const isLeads = stage === "leads";
  const tile =
    "flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-gray-400";

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          activeCountry ? (
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => setActiveCountry(null)}
            >
              ← All countries
            </button>
          ) : undefined
        }
        badge={activeCountry ? `Marketing · ${activeCountry.name}` : "Marketing"}
        description={
          activeCountry
            ? isLeads
              ? "Create a state folder, open it, then upload your contact list into it."
              : `Pick a folder in ${activeCountry.name} to see the leads you sent to outreach.`
            : isLeads
              ? "Pick a country to view its states, or create a new country folder."
              : "Pick a country to see the leads you sent to outreach."
        }
      />
      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          subtitle={
            activeCountry
              ? isLeads
                ? "Each folder holds one contact list for this region"
                : undefined
              : isLeads
                ? "Select a country to manage state folders"
                : undefined
          }
          title={
            activeCountry
              ? `${activeCountry.name} · ${isLeads ? "Lead folders" : "Outreach folders"}`
              : isLeads
                ? "Lead countries"
                : "Outreach countries"
          }
        >
          {isLeads && canManage ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <input
                aria-label={activeCountry ? "New state name" : "New country name"}
                className="w-64 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                maxLength={80}
                placeholder={
                  activeCountry
                    ? "New state name (e.g. California, Texas)"
                    : "New country name (e.g. United States, United Kingdom)"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
              />
              <button
                className="rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                disabled={!name.trim()}
                onClick={create}
              >
                {activeCountry ? "Create folder" : "Create country"}
              </button>
              {err ? <span className="text-xs text-red-600">{err}</span> : null}
            </div>
          ) : null}

          {activeCountry ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {states.map((s) => (
                <div key={s.id} className="relative">
                  <button
                    className={`${tile} w-full`}
                    onClick={() =>
                      onOpen({
                        id: s.id,
                        name: s.name,
                        parentId: activeCountry.id,
                      })
                    }
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      📁 {s.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {fmtInt(s.count)} {isLeads ? "leads" : "in outreach"}
                    </span>
                  </button>
                  {canManage ? (
                    <div className="absolute right-2 top-2 flex gap-1">
                      <button
                        aria-label={`Rename folder ${s.name}`}
                        className="rounded px-1.5 text-xs text-gray-400 hover:text-blue-600"
                        onClick={() => rename(s.id, s.name, activeCountry.id)}
                      >
                        ✎
                      </button>
                      <button
                        aria-label={`Delete folder ${s.name}`}
                        className="rounded px-1.5 text-xs text-gray-400 hover:text-red-600"
                        onClick={() =>
                          remove({
                            id: s.id,
                            name: s.name,
                            isCountry: false,
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((c) => (
                <div key={c.id} className="relative">
                  <button
                    className={`${tile} w-full`}
                    onClick={() => setActiveCountry({ id: c.id, name: c.name })}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        📁 {c.name}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">→</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {fmtInt(c.count)} {isLeads ? "leads" : "in outreach"}
                      {c.stateCount !== undefined
                        ? ` · ${c.stateCount} ${c.stateCount === 1 ? "state" : "states"}`
                        : ""}
                    </span>
                  </button>
                  {canManage ? (
                    <div className="absolute right-2 top-2 flex gap-1">
                      <button
                        aria-label={`Rename country ${c.name}`}
                        className="rounded px-1.5 text-xs text-gray-400 hover:text-blue-600"
                        onClick={() => rename(c.id, c.name, null)}
                      >
                        ✎
                      </button>
                      <button
                        aria-label={`Delete country ${c.name}`}
                        className="rounded px-1.5 text-xs text-gray-400 hover:text-red-600"
                        onClick={() =>
                          remove({
                            id: c.id,
                            name: c.name,
                            isCountry: true,
                            stateCount: c.stateCount,
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
              {data?.unsorted ? (
                <div className="relative">
                  <button
                    className={`${tile} w-full`}
                    onClick={() => onOpen({ id: "none", name: "No folder" })}
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      📂 No folder
                    </span>
                    <span className="text-xs text-gray-500">
                      {fmtInt(data.unsorted)} older contacts
                    </span>
                  </button>
                  {canManage ? (
                    <button
                      aria-label="Name this folder"
                      className="absolute right-2 top-2 rounded px-1.5 text-xs text-gray-400 hover:text-blue-600"
                      onClick={() => rename("none", "No folder", null)}
                    >
                      ✎
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          {activeCountry && !states.length ? (
            <p className="text-xs text-gray-500">
              {isLeads
                ? `No folders yet in ${activeCountry.name} — create one above.`
                : `Nothing in outreach yet in ${activeCountry.name}.`}
            </p>
          ) : null}

          {!activeCountry && !countries.length && !data?.unsorted ? (
            <p className="text-xs text-gray-500">
              {isLeads
                ? "No countries yet — create one above."
                : "Nothing in outreach yet — set Has Website on a lead."}
            </p>
          ) : null}
        </Card>
      </StatePanel>

      <Modal
        isOpen={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {dialog?.kind === "delete"
                  ? dialog.isCountry
                    ? "Delete country"
                    : "Delete folder"
                  : "Folder details"}
              </ModalHeader>
              <ModalBody>
                {dialog?.kind === "delete" ? (
                  <p className="text-sm text-gray-700">
                    Delete “{dialog.name}”
                    {dialog.isCountry
                      ? ` and ALL its states and contacts? This cannot be undone.`
                      : ` and ALL its contacts (leads and outreach)? This cannot be undone.`}
                  </p>
                ) : dialog?.kind === "rename" ? (
                  <div className="space-y-3">
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium text-gray-700"
                        htmlFor="folder-rename-name"
                      >
                        Folder Name
                      </label>
                      <input
                        aria-label="Folder name"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        id="folder-rename-name"
                        maxLength={80}
                        placeholder="Folder name"
                        value={dialog.value}
                        onChange={(e) =>
                          setDialog({ ...dialog, value: e.target.value })
                        }
                        onKeyDown={(e) => e.key === "Enter" && confirmDialog()}
                      />
                    </div>
                    {countries.length > 0 && dialog.id !== "none" ? (
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-700"
                          htmlFor="folder-rename-country"
                        >
                          Country
                        </label>
                        <select
                          aria-label="Country"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800"
                          id="folder-rename-country"
                          value={dialog.parentId || ""}
                          onChange={(e) =>
                            setDialog({
                              ...dialog,
                              parentId: e.target.value || null,
                            })
                          }
                        >
                          <option value="">— Top-level Country —</option>
                          {countries
                            .filter((c) => c.id !== dialog.id)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color={dialog?.kind === "delete" ? "danger" : "primary"}
                  isLoading={saving}
                  onPress={confirmDialog}
                >
                  {dialog?.kind === "delete" ? "Delete" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

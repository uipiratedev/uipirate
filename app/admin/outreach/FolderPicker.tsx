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
}

interface FolderData {
  folders: { id: string; name: string; count: number }[];
  unsorted: number;
}

export function FolderPicker({
  stage,
  canManage,
  onOpen,
}: {
  stage: "leads" | "outreach";
  canManage: boolean;
  onOpen: (f: FolderRef) => void;
}) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const { data, loading, error, refetch } = useApi<FolderData>(
    "/api/admin/outreach/folders",
    { stage },
    false,
  );

  async function create() {
    if (!name.trim()) return;
    setErr("");
    const res = await fetch("/api/admin/outreach/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();

    if (!res.ok) {
      setErr(json.error || "Could not create folder.");

      return;
    }
    setName("");
    onOpen({ id: json.id, name: json.name });
  }

  const [dialog, setDialog] = useState<
    | { kind: "rename"; id: string; current: string; value: string }
    | { kind: "delete"; id: string; name: string }
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
      } else if (
        dialog.value.trim() &&
        dialog.value.trim() !== dialog.current
      ) {
        const res = await fetch("/api/admin/outreach/folders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: dialog.id, name: dialog.value }),
        });

        if (!res.ok) setErr((await res.json()).error || "Rename failed.");
      }
      setDialog(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  const remove = (f: { id: string; name: string }) =>
    setDialog({ kind: "delete", id: f.id, name: f.name });
  const rename = (id: string, current: string) =>
    setDialog({
      kind: "rename",
      id,
      current,
      value: current === "No folder" ? "" : current,
    });

  const isLeads = stage === "leads";
  const tile =
    "flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-gray-400";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Marketing"
        description={
          isLeads
            ? "Create a folder, open it, then upload your contact list into it."
            : "Pick a folder to see the leads you sent to outreach."
        }
      />
      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          subtitle={isLeads ? "Each folder holds one contact list" : undefined}
          title={isLeads ? "Lead folders" : "Outreach folders"}
        >
          {isLeads && canManage ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <input
                aria-label="New folder name"
                className="w-64 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
                maxLength={80}
                placeholder="New folder name (e.g. Surat dentists)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
              />
              <button
                className="rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                disabled={!name.trim()}
                onClick={create}
              >
                Create folder
              </button>
              {err ? <span className="text-xs text-red-600">{err}</span> : null}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data?.folders.map((f) => (
              <div key={f.id} className="relative">
                <button
                  className={`${tile} w-full`}
                  onClick={() => onOpen({ id: f.id, name: f.name })}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    📁 {f.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {fmtInt(f.count)} {isLeads ? "leads" : "in outreach"}
                  </span>
                </button>
                {canManage ? (
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      aria-label={`Rename folder ${f.name}`}
                      className="rounded px-1.5 text-xs text-gray-400 hover:text-blue-600"
                      onClick={() => rename(f.id, f.name)}
                    >
                      ✎
                    </button>
                    <button
                      aria-label={`Delete folder ${f.name}`}
                      className="rounded px-1.5 text-xs text-gray-400 hover:text-red-600"
                      onClick={() => remove(f)}
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
                    onClick={() => rename("none", "No folder")}
                  >
                    ✎
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {data && !data.folders.length && !data.unsorted ? (
            <p className="text-xs text-gray-500">
              {isLeads
                ? "No folders yet — create one above."
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
                {dialog?.kind === "delete" ? "Delete folder" : "Folder name"}
              </ModalHeader>
              <ModalBody>
                {dialog?.kind === "delete" ? (
                  <p className="text-sm text-gray-700">
                    Delete “{dialog.name}” and ALL its contacts (leads and
                    outreach)? This cannot be undone.
                  </p>
                ) : dialog ? (
                  <input
                    aria-label="Folder name"
                    autoFocus
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    maxLength={80}
                    placeholder="Folder name"
                    value={dialog.value}
                    onChange={(e) =>
                      setDialog({ ...dialog, value: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && confirmDialog()}
                  />
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

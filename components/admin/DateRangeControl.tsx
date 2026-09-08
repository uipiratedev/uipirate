"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { Icon } from "./icons";

import { useDashboard } from "@/lib/admin/DashboardContext";
import { PRESET_LABELS, type RangePreset } from "@/lib/admin/dateRange";

const ORDER: RangePreset[] = ["24h", "7d", "28d", "90d", "12m"];

export function DateRangeControl() {
  const { range, setPreset } = useDashboard();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Icon.calendar className="h-4 w-4 text-gray-400" />
          {PRESET_LABELS[range.preset]}
          <Icon.chevron className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Date range"
        selectedKeys={[range.preset]}
        selectionMode="single"
        onAction={(key) => setPreset(key as RangePreset)}
      >
        {ORDER.map((p) => (
          <DropdownItem key={p}>{PRESET_LABELS[p]}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

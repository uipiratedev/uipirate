"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DateRangePicker,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

import { Icon } from "./icons";

import { useDashboard } from "@/lib/admin/DashboardContext";
import { PRESET_LABELS, type RangePreset } from "@/lib/admin/dateRange";

const ALL_OPTIONS: Array<{ key: RangePreset; label: string }> = [
  { key: "24h", label: PRESET_LABELS["24h"] },
  { key: "7d", label: PRESET_LABELS["7d"] },
  { key: "28d", label: PRESET_LABELS["28d"] },
  { key: "90d", label: PRESET_LABELS["90d"] },
  { key: "12m", label: PRESET_LABELS["12m"] },
  { key: "custom", label: "📅 Custom Date Picker…" },
];

export function DateRangeControl() {
  const { range, setPreset, setCustomRange } = useDashboard();
  const [showPicker, setShowPicker] = useState(false);

  const displayText =
    range.preset === "custom"
      ? `${range.from.slice(0, 10)} → ${range.to.slice(0, 10)}`
      : PRESET_LABELS[range.preset];

  const parsedValue = (() => {
    try {
      if (range.from && range.to) {
        return {
          start: parseDate(range.from.slice(0, 10)),
          end: parseDate(range.to.slice(0, 10)),
        };
      }
    } catch {
      // ignore parse error
    }
    return undefined;
  })();

  const maxDate = parseDate(new Date().toISOString().slice(0, 10));

  return (
    <div className="flex items-center gap-2">
      {showPicker || range.preset === "custom" ? (
        <div className="flex items-center gap-1.5">
          <DateRangePicker
            aria-label="Date Range Picker"
            className="w-auto min-w-[230px]"
            classNames={{
              inputWrapper: "h-8 bg-white border border-gray-200/80 rounded-xl shadow-sm text-xs",
              segment: "text-xs",
            }}
            maxValue={maxDate}
            size="sm"
            value={parsedValue}
            variant="bordered"
            onChange={(val) => {
              if (val?.start && val?.end) {
                setCustomRange(val.start.toString(), val.end.toString());
              }
            }}
          />
          <button
            aria-label="Close custom picker"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="Switch to presets"
            onClick={() => {
              setShowPicker(false);
              setPreset("28d");
            }}
          >
            <Icon.x className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {!showPicker && range.preset !== "custom" ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
              <Icon.calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>{displayText}</span>
              <Icon.chevron className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Date range selector"
            selectedKeys={[range.preset]}
            selectionMode="single"
            onAction={(key) => {
              if (key === "custom") {
                setShowPicker(true);
              } else {
                setPreset(key as RangePreset);
              }
            }}
          >
            {ALL_OPTIONS.map((p) => (
              <DropdownItem
                key={p.key}
                className={p.key === "custom" ? "text-primary font-semibold" : undefined}
              >
                {p.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </div>
  );
}

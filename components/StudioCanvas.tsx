"use client";

import React, { useCallback, useState } from "react";

export type StudioCanvasTheme = "light" | "dark";

const SunIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);
const MoonIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface StudioCanvasProps {
  /** The live component preview (and any inline readout) */
  children: React.ReactNode;
  /** Filename-style label shown in the window chrome */
  title?: string;
  /** Static tip shown bottom-right until the first interaction happens */
  hint?: React.ReactNode;
  /** Tailwind min-height utility for the stage body */
  minHeight?: string;
  /** Default canvas theme */
  defaultTheme?: StudioCanvasTheme;
  /** Grid on by default */
  defaultGrid?: boolean;
}

/**
 * Shared preview stage for every studio.
 *
 * Window-chrome header with THREE independent controls: a Grid on/off toggle and
 * a Light/Dark toggle (separate from the page theme). Below, a dot-grid canvas
 * with consistent padding/height, and an automatic interaction read-out — any
 * click on an interactive element inside the canvas is counted and shown.
 */
export default function StudioCanvas({
  children,
  title = "preview.tsx",
  hint = "Hover or click to interact",
  minHeight = "min-h-[380px]",
  defaultTheme = "light",
  defaultGrid = true,
}: StudioCanvasProps) {
  const [theme, setTheme] = useState<StudioCanvasTheme>(defaultTheme);
  const [grid, setGrid] = useState(defaultGrid);
  const [interactions, setInteractions] = useState(0);
  const [lastLabel, setLastLabel] = useState<string | null>(null);
  const light = theme === "light";

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest(
      "button, [role='button'], a, input, select, textarea, label, [tabindex]"
    ) as HTMLElement | null;
    if (!el || el.closest("[data-studio-chrome]")) return;
    setInteractions((n) => n + 1);
    const raw =
      el.getAttribute("aria-label") ||
      el.textContent?.replace(/\s+/g, " ").trim() ||
      el.tagName.toLowerCase();
    setLastLabel(raw.length > 36 ? `${raw.slice(0, 36)}…` : raw);
  }, []);

  const readout =
    interactions > 0
      ? `Interactions: ${interactions}${lastLabel ? ` · ${lastLabel}` : ""}`
      : hint;

  return (
    <div className="flex flex-col">
      {/* Window chrome header */}
      <div
        data-studio-chrome
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-[#141418]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </span>
          <span className="text-xs font-mono text-gray-400 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Grid on/off — separate */}
          <button
            type="button"
            onClick={() => setGrid((g) => !g)}
            className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-colors ${
              grid
                ? "bg-white/10 text-white border-white/20 font-bold"
                : "text-gray-400 border-white/10 hover:bg-white/5"
            }`}
          >
            Grid: {grid ? "ON" : "OFF"}
          </button>

          {/* Light / Dark — separate */}
          <div className="flex items-center gap-0.5 rounded-lg bg-black/40 border border-white/10 p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                light ? "bg-white text-gray-900 font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              <SunIcon />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                !light ? "bg-[#1E1E28] text-white font-bold border border-white/10" : "text-gray-400 hover:text-white"
              }`}
            >
              <MoonIcon />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas body */}
      <div
        onClickCapture={handleCanvasClick}
        className={`relative ${minHeight} flex flex-col items-center justify-center overflow-hidden p-10 sm:p-16 transition-colors duration-300 ${
          light ? "bg-gradient-to-b from-white to-[#E7ECF1]" : "bg-[#0E0F13]"
        }`}
      >
        {grid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: light
                ? "radial-gradient(circle, rgba(0,0,0,0.14) 1px, transparent 1px)"
                : "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-6">{children}</div>

        {readout != null && (
          <div
            className={`absolute bottom-4 left-6 right-6 text-center sm:text-right text-xs font-mono truncate ${
              light ? "text-gray-400" : "text-white/40"
            }`}
          >
            {readout}
          </div>
        )}
      </div>
    </div>
  );
}

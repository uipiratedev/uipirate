"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   LuminousShelfCard
   ───────────────────────────────────────────────────────────────────────────
   A dark product card lit by a shelf light that strikes on hover.

   ┌───────────────────────────────┬───────────────────────────────────────────┐
   │ OFF  (stateMode="standerd")   │ ON  (stateMode="hover" / hovered)         │
   ├───────────────────────────────┼───────────────────────────────────────────┤
   │ • flat near-black gradient    │ • a SOFT diffuse dome of light rises from  │
   │ • unlit shelf ledge, faint    │   the shelf and washes the wall to a mid   │
   │   top highlight only          │   grey — no hard cone edges                │
   │ • matte pin, UI Pirate mark   │ • shelf edge glows to a soft white line    │
   │ • blueprint frame @ ~30%      │ • the pin POPS forward and throws its      │
   │ • dim title, clipped subtitle │   silhouette as a shadow UP onto the wall  │
   └───────────────────────────────┴───────────────────────────────────────────┘

   Each sub-layer is commented with its one job.
   ──────────────────────────────────────────────────────────────────────────── */

export type LuminousShelfCardStateMode = "interactive" | "standerd" | "hover";
export type LuminousShelfCardSize = "sm" | "md" | "lg";
export type LuminousShelfCardTheme =
  | "white"
  | "warm"
  | "arctic"
  | "amber"
  | "emerald"
  | "magenta";

interface LumenTheme {
  /** Display name for the customizer dropdown. */
  name: string;
  /** "r, g, b" triplet for the diffuse wall glow. */
  wash: string;
  /** Hex of the soft filament line on the shelf edge. */
  core: string;
  /** "r, g, b" triplet tinting the pin when it is lit from below. */
  litTint: string;
}

export const LUMINOUS_SHELF_CARD_THEMES: Record<
  LuminousShelfCardTheme,
  LumenTheme
> = {
  white: {
    name: "Studio White",
    wash: "236, 238, 245",
    core: "#ffffff",
    litTint: "244, 247, 255",
  },
  warm: {
    name: "Incandescent",
    wash: "255, 216, 168",
    core: "#fff3de",
    litTint: "255, 236, 208",
  },
  arctic: {
    name: "Arctic Cyan",
    wash: "178, 228, 255",
    core: "#eefbff",
    litTint: "226, 245, 255",
  },
  amber: {
    name: "Amber Sodium",
    wash: "255, 196, 122",
    core: "#ffe9cc",
    litTint: "255, 228, 196",
  },
  emerald: {
    name: "Emerald Lab",
    wash: "170, 240, 208",
    core: "#ecfff6",
    litTint: "228, 252, 240",
  },
  magenta: {
    name: "Neon Magenta",
    wash: "255, 184, 230",
    core: "#ffecf9",
    litTint: "255, 230, 248",
  },
};

/** Uniform scale for the whole fixed-geometry card. */
const SIZE_SCALE: Record<LuminousShelfCardSize, number> = {
  sm: 0.78,
  md: 1,
  lg: 1.16,
};

/* Fixed base geometry (scale = 1), px, inside the card box. */
const CARD_W = 340;
const CARD_H = 460;
const CARD_RADIUS = 28;
const PIN = 104; // pin box
const PIN_TOP = 96; // pin distance from card top
const SHELF_W = 250; // light bar width
const SHELF_H = 14; // light bar height
const SHELF_TOP = 288; // light bar distance from card top
const SHELF_FROM_BOTTOM = CARD_H - SHELF_TOP; // anchor for every upward light layer

export interface LuminousShelfCardProps {
  /** Large heading, bottom-left. */
  title?: string;
  /** One line under the title. Never wraps; clips at the card edge. */
  subtitle?: string;
  /** "standerd" = light off · "hover" = light on · "interactive" = follows pointer/focus. */
  stateMode?: LuminousShelfCardStateMode;
  /** Physical scale of the whole card. */
  size?: LuminousShelfCardSize;
  /** Colour of the light that strikes on hover. */
  theme?: LuminousShelfCardTheme;
  /** Glyph inside the pin. Defaults to the UI Pirate brand mark. */
  icon?: React.ReactNode;
  /** Faint blueprint frame + corner brackets behind the card. */
  showDeviceFrame?: boolean;
  /** White pill peeking up from the bottom-right edge. */
  showPeekPill?: boolean;
  /** Fluorescent-tube strike flicker when the light turns on. */
  flicker?: boolean;
  onClick?: () => void;
  className?: string;
}

/** The UI Pirate brand mark — same asset the site navbar uses. */
export const UI_PIRATE_MARK_SRC =
  "https://res.cloudinary.com/dvk9ttiym/image/upload/v1766234689/logo_lcn2cq.png";

/* Default pin glyph — the UI Pirate brand mark. */
function UIPirateMark({ size }: { size: number }) {
  return (
    <img
      alt=""
      draggable={false}
      height={size}
      src={UI_PIRATE_MARK_SRC}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
      }}
      width={size}
    />
  );
}

/** Alternative pin glyph — a clean filled feather, if you don't want the mark. */
export function FeatherGlyph({ size }: { size: number }) {
  return (
    <svg aria-hidden fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
        fill="currentColor"
      />
      <path
        d="M16 8 2.6 21.4M17.2 15H9.4"
        stroke="rgba(255,255,255,0.32)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function LuminousShelfCard({
  title = "Light Work",
  subtitle = "Life life on easy mode by UI Pirate",
  stateMode = "interactive",
  size = "md",
  theme = "white",
  icon,
  showDeviceFrame = true,
  showPeekPill = true,
  flicker = true,
  onClick,
  className = "",
}: LuminousShelfCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const t =
    LUMINOUS_SHELF_CARD_THEMES[theme] ?? LUMINOUS_SHELF_CARD_THEMES.white;
  const scale = SIZE_SCALE[size] ?? 1;
  const clickable = typeof onClick === "function";

  /* Single source of truth for "is the lamp lit". */
  const on =
    stateMode === "hover" ||
    (stateMode === "interactive" && (hovered || focused));

  /* Turning ON with flicker plays a soft 2-blip strike; OFF is a clean fade. */
  const litTransition =
    on && flicker
      ? { duration: 0.55, times: [0, 0.14, 0.24, 1], ease: "easeOut" as const }
      : { duration: on ? 0.45 : 0.32, ease: "easeOut" as const };

  const lit = (peak: number): number | number[] =>
    on ? (flicker ? [0, peak, peak * 0.5, peak] : peak) : 0;

  return (
    <div
      aria-label={title}
      className={`relative flex items-center justify-center select-none ${clickable ? "cursor-pointer" : ""} ${className}`}
      role={clickable ? "button" : "group"}
      style={{ width: CARD_W * scale, height: CARD_H * scale }}
      tabIndex={clickable ? 0 : undefined}
      onBlur={() => setFocused(false)}
      onClick={onClick}
      onFocus={() => setFocused(true)}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Scaled, fixed-geometry stage */}
      <div
        className="relative flex-none"
        style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})` }}
      >
        {/* ───────────────────────────────────────────────────────────────
            1 · BLUEPRINT FRAME  (behind the card, faint; lifts a touch)
           ─────────────────────────────────────────────────────────────── */}
        {showDeviceFrame && (
          <motion.div
            animate={{ opacity: on ? 0.6 : 0.32 }}
            className="absolute inset-0 pointer-events-none"
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="absolute"
              style={{
                inset: -13,
                borderRadius: CARD_RADIUS + 13,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: -21,
                left: 32,
                width: 60,
                height: 32,
                borderRadius: "16px 16px 16px 4px",
                border: "1px solid rgba(255,255,255,0.055)",
                borderBottomColor: "transparent",
              }}
            />
            <div
              className="absolute"
              style={{
                top: -21,
                right: 28,
                width: 42,
                height: 42,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.055)",
              }}
            />
          </motion.div>
        )}

        {/* ───────────────────────────────────────────────────────────────
            2 · CARD BODY  (clips every light layer inside it)
           ─────────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: CARD_RADIUS,
            background:
              "linear-gradient(180deg, #202024 0%, #171719 50%, #0c0c0e 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 40px 80px -24px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* 2a · static ambient sheen near the pin (present even when OFF) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(58% 40% at 50% 26%, rgba(255,255,255,0.03), transparent 72%)",
            }}
          />

          {/* ─────────────────────────────────────────────────────────────
              3 · DIFFUSE WALL GLOW  (only ON — screen-blended, NO hard edges)
                  Two stacked soft radials: a broad dome + a brighter band
                  hugging the shelf. Heavy blur feathers every boundary.
             ───────────────────────────────────────────────────────────── */}
          {/* 3a · broad dome climbing the wall */}
          <motion.div
            animate={{ opacity: lit(1) }}
            className="absolute pointer-events-none left-1/2 -translate-x-1/2"
            style={{
              bottom: SHELF_FROM_BOTTOM - 34,
              width: 410,
              height: 400,
              mixBlendMode: "screen",
              filter: "blur(26px)",
              background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(${t.wash},0.27) 0%, rgba(${t.wash},0.14) 36%, rgba(${t.wash},0.045) 64%, rgba(${t.wash},0) 84%)`,
            }}
            transition={litTransition}
          />
          {/* 3b · brighter band right above the shelf */}
          <motion.div
            animate={{ opacity: lit(1) }}
            className="absolute pointer-events-none left-1/2 -translate-x-1/2"
            style={{
              bottom: SHELF_FROM_BOTTOM - 16,
              width: 300,
              height: 150,
              mixBlendMode: "screen",
              filter: "blur(18px)",
              background: `radial-gradient(ellipse 62% 72% at 50% 100%, rgba(${t.wash},0.36) 0%, rgba(${t.wash},0.11) 48%, rgba(${t.wash},0) 78%)`,
            }}
            transition={litTransition}
          />
          {/* 3c · faint downward spill under the shelf */}
          <motion.div
            animate={{ opacity: lit(1) }}
            className="absolute pointer-events-none left-1/2 -translate-x-1/2"
            style={{
              top: SHELF_TOP + SHELF_H,
              width: 230,
              height: 60,
              mixBlendMode: "screen",
              filter: "blur(10px)",
              background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(${t.wash},0.12) 0%, rgba(${t.wash},0) 74%)`,
            }}
            transition={litTransition}
          />

          {/* ─────────────────────────────────────────────────────────────
              4 · PIN CAST SHADOW
                  A real, blurred silhouette of the pin, projected UP the wall
                  (the light source is the shelf, below). The feather is then
                  punched back out with a screen-blended copy of itself, so the
                  light that passes through the feather's gaps reads as a bright
                  slot in the shadow — splitting its top into two soft humps,
                  exactly like the reference.
             ───────────────────────────────────────────────────────────── */}
          <motion.div
            animate={{ opacity: on ? 1 : 0 }}
            className="absolute pointer-events-none left-1/2"
            style={{
              top: PIN_TOP - 30,
              width: PIN,
              height: PIN,
              transformOrigin: "50% 100%",
              transform: "translateX(-50%) scale(1.12, 1.4)",
              filter: "blur(12px)",
            }}
            transition={{ duration: on ? 0.5 : 0.3, ease: "easeOut" }}
          >
            {/* 4a · solid pin silhouette */}
            <div
              className="absolute inset-0"
              style={{
                borderRadius: "50% 50% 50% 13px",
                background: "rgba(0,0,0,0.6)",
              }}
            />
            {/* 4b · the glyph knocked back out — the gap the light leaks through */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "50%",
                top: "48%",
                width: PIN * 0.56,
                height: PIN * 0.56,
                transform: "translate(-50%, -50%)",
                color: `rgba(${t.wash}, 0.98)`,
                mixBlendMode: "screen",
                filter: "brightness(0) invert(1)",
              }}
            >
              {icon ?? <UIPirateMark size={PIN * 0.56} />}
            </div>
          </motion.div>

          {/* 2b · edge vignette — keeps L/R edges dark even when lit (always on) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(115% 75% at 50% 46%, transparent 52%, rgba(0,0,0,0.44) 100%)",
            }}
          />

          {/* ─────────────────────────────────────────────────────────────
              5 · MARK PIN  (teardrop — soft point bottom-left; holds the mark)
                  Pops forward on hover so its shadow reads.
             ───────────────────────────────────────────────────────────── */}
          <motion.div
            animate={{
              x: "-50%",
              y: on ? -5 : 0,
              scale: on ? 1.035 : 1,
              boxShadow: on
                ? "0 -3px 22px -6px rgba(255,255,255,0.12), inset 0 -8px 15px rgba(255,255,255,0.28), inset 0 8px 14px rgba(0,0,0,0.24)"
                : "0 20px 36px -14px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -6px 12px rgba(0,0,0,0.16)",
            }}
            className="absolute left-1/2 flex items-center justify-center"
            style={{
              top: PIN_TOP,
              width: PIN,
              height: PIN,
              borderRadius: "50% 50% 50% 13px",
              background:
                "linear-gradient(150deg, #d9d9d9 0%, #b2b2b2 52%, #9a9a9a 100%)",
              transformOrigin: "50% 60%",
            }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* 5a · lit-from-below tint */}
            <motion.div
              animate={{ opacity: on ? 1 : 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "inherit",
                background: `radial-gradient(ellipse 90% 66% at 50% 118%, rgba(${t.litTint},0.85) 0%, rgba(${t.litTint},0) 62%)`,
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
            {/* 5b · top ambient shade — recedes as the underlight takes over */}
            <motion.div
              animate={{ opacity: on ? 0.4 : 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "inherit",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 48%)",
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
            {/* 5c · the glyph */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: PIN * 0.6, height: PIN * 0.6, color: "#171717" }}
            >
              {icon ?? <UIPirateMark size={PIN * 0.6} />}
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────
              6 · SHELF / LIGHT BAR  (chamfered ends; unlit → soft filament)
             ───────────────────────────────────────────────────────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: SHELF_TOP, width: SHELF_W, height: SHELF_H }}
          >
            {/* 6a · ledge body — lifts a touch when lit */}
            <motion.div
              animate={{
                background: on
                  ? "linear-gradient(180deg, #2b2b30 0%, #191a1c 46%, #0e0e10 100%)"
                  : "linear-gradient(180deg, #202024 0%, #16161a 44%, #0b0b0d 100%)",
              }}
              className="absolute inset-0"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 11px) 100%, 11px 100%)",
                boxShadow: "0 12px 22px -6px rgba(0,0,0,0.55)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* 6b · top edge — faint highlight OFF */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 18%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.2) 82%, transparent)",
                opacity: on ? 0 : 1,
                transition: "opacity 0.35s ease",
              }}
            />
            {/* 6c · soft filament ON — a thin line + its own wide blurred bloom */}
            <motion.div
              animate={{ opacity: lit(1) }}
              className="absolute left-0 right-0"
              style={{
                top: -0.5,
                height: 2,
                borderRadius: 2,
                background: t.core,
                boxShadow: `0 0 5px 0 rgba(${t.wash},0.7)`,
              }}
              transition={litTransition}
            />
            <motion.div
              animate={{ opacity: lit(1) }}
              className="absolute"
              style={{
                left: -12,
                right: -12,
                top: -12,
                height: 26,
                filter: "blur(12px)",
                mixBlendMode: "screen",
                background: `radial-gradient(ellipse 72% 100% at 50% 50%, rgba(${t.wash},0.8) 0%, rgba(${t.wash},0) 74%)`,
              }}
              transition={litTransition}
            />
            {/* 6d · bounce line — light kicking off the shelf toward the viewer */}
            <motion.div
              animate={{ opacity: lit(0.9) }}
              className="absolute"
              style={{
                left: "6%",
                right: "6%",
                top: SHELF_H + 2,
                height: 2,
                borderRadius: 2,
                filter: "blur(1.5px)",
                mixBlendMode: "screen",
                background: `linear-gradient(90deg, transparent, rgba(${t.wash},0.7) 28%, rgba(${t.wash},0.7) 72%, transparent)`,
              }}
              transition={litTransition}
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              7 · TEXT BLOCK  (bottom-left; subtitle never wraps → clips)
             ───────────────────────────────────────────────────────────── */}
          <div className="absolute" style={{ left: 26, bottom: 24, right: 0 }}>
            <motion.div
              animate={{
                color: on ? "#f4f4f4" : "#e3e3e3",
                textShadow: on
                  ? `0 0 16px rgba(${t.wash},0.3)`
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              style={{
                fontSize: 28,
                lineHeight: 1.05,
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {title}
            </motion.div>
            <motion.div
              animate={{ color: on ? "#8c8c8c" : "#555555" }}
              className="mt-2 whitespace-nowrap"
              style={{ fontSize: 15, fontWeight: 400 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {subtitle}
            </motion.div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              8 · PEEK PILL  (white; half-hidden by the bottom edge)
             ───────────────────────────────────────────────────────────── */}
          {showPeekPill && (
            <motion.div
              animate={{
                y: on ? -3 : 0,
                filter: on ? "brightness(1.06)" : "brightness(1)",
              }}
              className="absolute"
              style={{
                right: 24,
                bottom: -13,
                width: 88,
                height: 32,
                borderRadius: 999,
                background: "linear-gradient(180deg, #fbfbfb 0%, #e3e3e3 100%)",
                boxShadow:
                  "0 -6px 15px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            />
          )}

          {/* 9 · lit inner top-rim — the card's own edge catching the glow */}
          <motion.div
            animate={{
              boxShadow: on
                ? `inset 0 1px 0 rgba(${t.wash},0.14), inset 0 26px 56px -40px rgba(${t.wash},0.2)`
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: CARD_RADIUS }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export default LuminousShelfCard;

/* ────────────────────────────────────────────────────────────────────────────
   Drop-in source string for the Component Lab "Component.tsx" code tab.
   ──────────────────────────────────────────────────────────────────────────── */
export const LUMINOUS_SHELF_CARD_COMPONENT_SOURCE = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type LuminousShelfCardStateMode = "interactive" | "standerd" | "hover";
export type LuminousShelfCardSize = "sm" | "md" | "lg";
export type LuminousShelfCardTheme =
  | "white" | "warm" | "arctic" | "amber" | "emerald" | "magenta";

const THEMES = {
  white:   { wash: "236, 238, 245", core: "#ffffff", litTint: "244, 247, 255" },
  warm:    { wash: "255, 216, 168", core: "#fff3de", litTint: "255, 236, 208" },
  arctic:  { wash: "178, 228, 255", core: "#eefbff", litTint: "226, 245, 255" },
  amber:   { wash: "255, 196, 122", core: "#ffe9cc", litTint: "255, 228, 196" },
  emerald: { wash: "170, 240, 208", core: "#ecfff6", litTint: "228, 252, 240" },
  magenta: { wash: "255, 184, 230", core: "#ffecf9", litTint: "255, 230, 248" },
} as const;

const SCALE = { sm: 0.78, md: 1, lg: 1.16 } as const;
const CARD_W = 340, CARD_H = 460, R = 28;
const PIN = 104, PIN_TOP = 96;
const SHELF_W = 250, SHELF_H = 14, SHELF_TOP = 288;
const SFB = CARD_H - SHELF_TOP; // shelf distance from bottom

export interface LuminousShelfCardProps {
  title?: string;
  subtitle?: string;
  stateMode?: LuminousShelfCardStateMode;
  size?: LuminousShelfCardSize;
  theme?: LuminousShelfCardTheme;
  icon?: React.ReactNode;
  showDeviceFrame?: boolean;
  showPeekPill?: boolean;
  flicker?: boolean;
  onClick?: () => void;
  className?: string;
}

// Default glyph = the UI Pirate brand mark (same asset the site navbar uses).
const MARK_SRC = "https://res.cloudinary.com/dvk9ttiym/image/upload/v1766234689/logo_lcn2cq.png";
const Mark = ({ s }: { s: number }) => (
  <img src={MARK_SRC} alt="" width={s} height={s}
    style={{ width: s, height: s, objectFit: "contain", display: "block" }} />
);

export function LuminousShelfCard({
  title = "Light Work",
  subtitle = "Life life on easy mode by UI Pirate",
  stateMode = "interactive",
  size = "md",
  theme = "white",
  icon,
  showDeviceFrame = true,
  showPeekPill = true,
  flicker = true,
  onClick,
  className = "",
}: LuminousShelfCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const t = THEMES[theme] ?? THEMES.white;
  const scale = SCALE[size] ?? 1;
  const clickable = typeof onClick === "function";
  const on = stateMode === "hover" || (stateMode === "interactive" && (hovered || focused));

  const litTransition = on && flicker
    ? { duration: 0.55, times: [0, 0.14, 0.24, 1], ease: "easeOut" as const }
    : { duration: on ? 0.45 : 0.32, ease: "easeOut" as const };
  const lit = (peak: number): number | number[] =>
    on ? (flicker ? [0, peak, peak * 0.5, peak] : peak) : 0;

  return (
    <div
      className={\`relative flex items-center justify-center select-none \${clickable ? "cursor-pointer" : ""} \${className}\`}
      style={{ width: CARD_W * scale, height: CARD_H * scale }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={onClick}
      role={clickable ? "button" : "group"}
      aria-label={title}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="relative flex-none" style={{ width: CARD_W, height: CARD_H, transform: \`scale(\${scale})\` }}>
        {/* 1 · blueprint frame */}
        {showDeviceFrame && (
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ opacity: on ? 0.6 : 0.32 }} transition={{ duration: 0.5 }}>
            <div className="absolute" style={{ inset: -13, borderRadius: R + 13, border: "1px solid rgba(255,255,255,0.05)" }} />
            <div className="absolute" style={{ top: -21, left: 32, width: 60, height: 32, borderRadius: "16px 16px 16px 4px", border: "1px solid rgba(255,255,255,0.055)", borderBottomColor: "transparent" }} />
            <div className="absolute" style={{ top: -21, right: 28, width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.055)" }} />
          </motion.div>
        )}

        {/* 2 · card body */}
        <div className="absolute inset-0 overflow-hidden" style={{
          borderRadius: R,
          background: "linear-gradient(180deg, #202024 0%, #171719 50%, #0c0c0e 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px -24px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(58% 40% at 50% 26%, rgba(255,255,255,0.03), transparent 72%)" }} />

          {/* 3 · diffuse wall glow — soft dome + band, NO hard cone */}
          <motion.div className="absolute pointer-events-none left-1/2 -translate-x-1/2" style={{
            bottom: SFB - 34, width: 410, height: 400, mixBlendMode: "screen", filter: "blur(26px)",
            background: \`radial-gradient(ellipse 60% 80% at 50% 100%, rgba(\${t.wash},0.27) 0%, rgba(\${t.wash},0.14) 36%, rgba(\${t.wash},0.045) 64%, rgba(\${t.wash},0) 84%)\`,
          }} animate={{ opacity: lit(1) }} transition={litTransition} />
          <motion.div className="absolute pointer-events-none left-1/2 -translate-x-1/2" style={{
            bottom: SFB - 16, width: 300, height: 150, mixBlendMode: "screen", filter: "blur(18px)",
            background: \`radial-gradient(ellipse 62% 72% at 50% 100%, rgba(\${t.wash},0.36) 0%, rgba(\${t.wash},0.11) 48%, rgba(\${t.wash},0) 78%)\`,
          }} animate={{ opacity: lit(1) }} transition={litTransition} />
          <motion.div className="absolute pointer-events-none left-1/2 -translate-x-1/2" style={{
            top: SHELF_TOP + SHELF_H, width: 230, height: 60, mixBlendMode: "screen", filter: "blur(10px)",
            background: \`radial-gradient(ellipse 60% 100% at 50% 0%, rgba(\${t.wash},0.12) 0%, rgba(\${t.wash},0) 74%)\`,
          }} animate={{ opacity: lit(1) }} transition={litTransition} />

          {/* 4 · pin cast shadow — a real silhouette of the pin projected up
                 the wall, with the feather punched back out (screen) so the
                 light through its gaps splits the shadow into two humps */}
          <motion.div className="absolute pointer-events-none left-1/2" style={{
            top: PIN_TOP - 30, width: PIN, height: PIN,
            transformOrigin: "50% 100%", transform: "translateX(-50%) scale(1.12, 1.4)", filter: "blur(12px)",
          }} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: on ? 0.5 : 0.3 }}>
            <div className="absolute inset-0" style={{ borderRadius: "50% 50% 50% 13px", background: "rgba(0,0,0,0.6)" }} />
            <div className="absolute flex items-center justify-center" style={{
              left: "50%", top: "48%", width: PIN * 0.56, height: PIN * 0.56,
              transform: "translate(-50%, -50%)", mixBlendMode: "screen", filter: "brightness(0) invert(1)",
            }}>
              {icon ?? <Mark s={PIN * 0.56} />}
            </div>
          </motion.div>

          {/* 2b · edge vignette (always) */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(115% 75% at 50% 46%, transparent 52%, rgba(0,0,0,0.44) 100%)" }} />

          {/* 5 · mark pin — pops forward on hover */}
          <motion.div className="absolute left-1/2 flex items-center justify-center" style={{
            top: PIN_TOP, width: PIN, height: PIN, borderRadius: "50% 50% 50% 13px",
            background: "linear-gradient(150deg, #d9d9d9 0%, #b2b2b2 52%, #9a9a9a 100%)", transformOrigin: "50% 60%",
          }} animate={{
            x: "-50%", y: on ? -5 : 0, scale: on ? 1.035 : 1,
            boxShadow: on
              ? "0 -3px 22px -6px rgba(255,255,255,0.12), inset 0 -8px 15px rgba(255,255,255,0.28), inset 0 8px 14px rgba(0,0,0,0.24)"
              : "0 20px 36px -14px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -6px 12px rgba(0,0,0,0.16)",
          }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
            <motion.div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit",
              background: \`radial-gradient(ellipse 90% 66% at 50% 118%, rgba(\${t.litTint},0.85) 0%, rgba(\${t.litTint},0) 62%)\` }}
              animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.45 }} />
            <motion.div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit",
              background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 48%)" }}
              animate={{ opacity: on ? 0.4 : 1 }} transition={{ duration: 0.45 }} />
            <div className="relative flex items-center justify-center" style={{ width: PIN * 0.6, height: PIN * 0.6 }}>{icon ?? <Mark s={PIN * 0.6} />}</div>
          </motion.div>

          {/* 6 · shelf / light bar */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: SHELF_TOP, width: SHELF_W, height: SHELF_H }}>
            <motion.div className="absolute inset-0" style={{
              clipPath: "polygon(0 0, 100% 0, calc(100% - 11px) 100%, 11px 100%)",
              boxShadow: "0 12px 22px -6px rgba(0,0,0,0.55)",
            }} animate={{
              background: on
                ? "linear-gradient(180deg, #2b2b30 0%, #191a1c 46%, #0e0e10 100%)"
                : "linear-gradient(180deg, #202024 0%, #16161a 44%, #0b0b0d 100%)",
            }} transition={{ duration: 0.4 }} />
            <div className="absolute left-0 right-0 top-0" style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 18%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.2) 82%, transparent)",
              opacity: on ? 0 : 1, transition: "opacity 0.35s ease",
            }} />
            <motion.div className="absolute left-0 right-0" style={{
              top: -0.5, height: 2, borderRadius: 2, background: t.core, boxShadow: \`0 0 5px 0 rgba(\${t.wash},0.7)\`,
            }} animate={{ opacity: lit(1) }} transition={litTransition} />
            <motion.div className="absolute" style={{
              left: -12, right: -12, top: -12, height: 26, filter: "blur(12px)", mixBlendMode: "screen",
              background: \`radial-gradient(ellipse 72% 100% at 50% 50%, rgba(\${t.wash},0.8) 0%, rgba(\${t.wash},0) 74%)\`,
            }} animate={{ opacity: lit(1) }} transition={litTransition} />
            <motion.div className="absolute" style={{
              left: "6%", right: "6%", top: SHELF_H + 2, height: 2, borderRadius: 2, filter: "blur(1.5px)", mixBlendMode: "screen",
              background: \`linear-gradient(90deg, transparent, rgba(\${t.wash},0.7) 28%, rgba(\${t.wash},0.7) 72%, transparent)\`,
            }} animate={{ opacity: lit(0.9) }} transition={litTransition} />
          </div>

          {/* 7 · text */}
          <div className="absolute" style={{ left: 26, bottom: 24, right: 0 }}>
            <motion.div style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.015em" }}
              animate={{ color: on ? "#f4f4f4" : "#e3e3e3", textShadow: on ? \`0 0 16px rgba(\${t.wash},0.3)\` : "0 0 0 rgba(0,0,0,0)" }}
              transition={{ duration: 0.4 }}>{title}</motion.div>
            <motion.div className="mt-2 whitespace-nowrap" style={{ fontSize: 15 }}
              animate={{ color: on ? "#8c8c8c" : "#555555" }} transition={{ duration: 0.4 }}>{subtitle}</motion.div>
          </div>

          {/* 8 · peek pill */}
          {showPeekPill && (
            <motion.div className="absolute" style={{
              right: 24, bottom: -13, width: 88, height: 32, borderRadius: 999,
              background: "linear-gradient(180deg, #fbfbfb 0%, #e3e3e3 100%)",
              boxShadow: "0 -6px 15px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.9)",
            }} animate={{ y: on ? -3 : 0, filter: on ? "brightness(1.06)" : "brightness(1)" }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LuminousShelfCard;
`;

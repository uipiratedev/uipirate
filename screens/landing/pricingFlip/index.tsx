"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import LetsTalkButton from "@/components/LetsTalkButton";

type PlanId = "monthly" | "custom";

interface Plan {
  id: PlanId;
  head: string;
  accent: string;
  logo: string;
  /** Illustration shown in the left panel. Swap for a real asset per plan. */
  image: string;
  imageAlt: string;
  priceLabel: string;
  price: string;
  unit: string;
  note: string;
  cta: string;
  href: string;
  features: string[];
}

const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    head: "Monthly",
    accent: "Retainer",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1790158834/t-2_nyguuz.svg",
    image: "/assets/gif/kite.gif",
    imageAlt: "Monthly retainer plan",
    priceLabel: "Starting from",
    price: "$499",
    unit: "per month",
    note: "vs $8–15k/mo for a typical agency retainer",
    cta: "Get Started",
    href: "https://cal.com/ui-pirate/15min",
    features: [
      "Full design & development stack",
      "1 active request at a time",
      "Weekly progress sync",
      "Fast turnaround",
      "Unlimited requests within scope",
      "Mon–Fri, < 2hr response",
    ],
  },
  custom: {
    id: "custom",
    head: "Custom",
    accent: "Quote",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1790158834/t_fnmgru.svg",
    image: "/assets/gif/headquater.gif",
    imageAlt: "Custom project quote plan",
    priceLabel: "Starting from",
    price: "$2K",
    unit: "",
    note: "",
    cta: "Book a Discovery Call",
    href: "https://cal.com/ui-pirate/15min",
    features: [
      "Full design & development stack",
      "Priority handling",
      "Custom project scope",
      "Flexible engagement",
      "Close collaboration with stakeholders",
      "Dedicated project ownership",
      "Mon–Fri, < 2hr response",
    ],
  },
};

const TABS: { id: PlanId; label: string; hint: string }[] = [
  { id: "monthly", label: "Monthly", hint: "$499" },
  { id: "custom", label: "Custom", hint: "Starts from $2K" },
];

// Rosette "seal" tick — matches the reference art.
const CheckBadge = () => (
  <svg
    aria-hidden
    className="mt-px h-[19px] w-[19px] shrink-0 text-brand-orange"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944z" />
    <path
      d="M9 12l2 2 4 -4"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    />
  </svg>
);

const SCANNER_SEGMENTS = [
  { h: 8, rounded: "rounded-[2px]" },
  { h: 3, rounded: "rounded-[1px]" },
  { h: 3, rounded: "rounded-[1px]" },
  { h: 3, rounded: "rounded-[1px]" },
  { h: 3, rounded: "rounded-[1px]" },
  { h: 3, rounded: "rounded-[1px]" },
  { h: 8, rounded: "rounded-[2px]" },
  { h: 3, rounded: "rounded-[1px]" },
];

const ScannerIndicator = ({ isDark }: { isDark?: boolean }) => {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 right-6 flex flex-col items-end gap-[3px] sm:bottom-8 sm:right-8"
    >
      {SCANNER_SEGMENTS.map((seg, i) => (
        <motion.span
          key={i}
          animate={
            reduce
              ? { opacity: 0.3 }
              : {
                opacity: [0.25, 0.95, 0.25],
              }
          }
          className={`w-[22px] ${isDark ? "bg-white/60" : "bg-gray-900 dark:bg-white"} ${seg.rounded}`}
          initial={{ opacity: 0.28 }}
          style={{ height: seg.h }}
          transition={
            reduce
              ? undefined
              : {
                duration: 1.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.12,
              }
          }
        />
      ))}
    </div>
  );
};

// Corner slit fold geometry matching reference image
const FOLD = 24;
const EAR = 6;

const TopLeftCornerSlot = ({ isDark }: { isDark?: boolean }) => {
  const shadowFilterId = isDark ? "ear-shadow-tl-dark" : "ear-shadow-tl-light";
  const shadowColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.22)";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0  overflow-visible">
      <svg className="overflow-visible" height={FOLD} style={{ overflow: "visible" }} width={FOLD}>
        <defs>
          <filter id={shadowFilterId} height="200%" width="200%" x="-50%" y="-50%">
            <feDropShadow dx="1" dy="1.5" floodColor={shadowColor} floodOpacity="1" stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Soft shadow under top protruding ear fold */}
        <polygon
          className={isDark ? "hang-ear-shadow-dark" : "hang-ear-shadow"}
          fill={shadowColor}
          filter={`url(#${shadowFilterId})`}
          points={`${FOLD},0 ${FOLD + EAR},${-EAR} ${FOLD + EAR},0`}
        />

        {/* Soft shadow under left protruding ear fold */}
        <polygon
          className={isDark ? "hang-ear-shadow-dark" : "hang-ear-shadow"}
          fill={shadowColor}
          filter={`url(#${shadowFilterId})`}
          points={`0,${FOLD} ${-EAR},${FOLD + EAR} 0,${FOLD + EAR}`}
        />

        {/* Outer background corner flap with protruding ear tabs */}
        <polygon
          className={isDark ? "hang-corner-custom" : "hang-corner-monthly"}
          fill={isDark ? "#282828" : undefined}
          points={`
            0,0
            ${FOLD},0
            ${FOLD + EAR},${-EAR}
            ${-EAR},${FOLD + EAR}
            0,${FOLD}
          `}
          style={{
            fill: isDark ? "#282828" : undefined,
          }}
        />

        {/* Straight diagonal slit cut crease line */}
        <line
          className={isDark ? "hang-slit-line-dark" : "hang-slit-line-light"}
          stroke={isDark ? "rgba(255,255,255,0.15)" : undefined}
          strokeLinecap="round"
          strokeWidth="1.2"
          x1={-EAR}
          x2={FOLD + EAR}
          y1={FOLD + EAR}
          y2={-EAR}
        />
      </svg>
    </div>
  );
};

const BottomRightCornerSlot = ({ isDark }: { isDark?: boolean }) => {
  const shadowFilterId = isDark ? "ear-shadow-br-dark" : "ear-shadow-br-light";
  const shadowColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.22)";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0  overflow-visible">
      <svg className="overflow-visible" height={FOLD} style={{ overflow: "visible" }} width={FOLD}>
        <defs>
          <filter id={shadowFilterId} height="200%" width="200%" x="-50%" y="-50%">
            <feDropShadow dx="1" dy="1.5" floodColor={shadowColor} floodOpacity="1" stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Soft shadow under bottom protruding ear fold */}
        <polygon
          className={isDark ? "hang-ear-shadow-dark" : "hang-ear-shadow"}
          fill={shadowColor}
          filter={`url(#${shadowFilterId})`}
          points={`0,${FOLD} ${-EAR},${FOLD + EAR} ${-EAR},${FOLD}`}
        />

        {/* Soft shadow under right protruding ear fold */}
        <polygon
          className={isDark ? "hang-ear-shadow-dark" : "hang-ear-shadow"}
          fill={shadowColor}
          filter={`url(#${shadowFilterId})`}
          points={`${FOLD},0 ${FOLD + EAR},${-EAR} ${FOLD},${-EAR}`}
        />

        {/* Outer background corner flap with protruding ear tabs */}
        <polygon
          className={isDark ? "hang-corner-custom" : "hang-corner-monthly"}
          fill={isDark ? "#282828" : undefined}
          points={`
            ${FOLD},${FOLD}
            0,${FOLD}
            ${-EAR},${FOLD + EAR}
            ${FOLD + EAR},${-EAR}
            ${FOLD},0
          `}
          style={{
            fill: isDark ? "#282828" : undefined,
          }}
        />

        {/* Straight diagonal slit cut crease line */}
        <line
          className={isDark ? "hang-slit-line-dark" : "hang-slit-line-light"}
          stroke={isDark ? "rgba(255,255,255,0.15)" : undefined}
          strokeLinecap="round"
          strokeWidth="1.2"
          x1={-EAR}
          x2={FOLD + EAR}
          y1={FOLD + EAR}
          y2={-EAR}
        />
      </svg>
    </div>
  );
};

// Left half of the card — outer area + inset inner sub-card (dark-themed for Custom).
const LeftSection = ({ plan }: { plan: Plan }) => {
  const isDark = plan.id === "custom";
  const outerBg = isDark ? "bg-[#282828]" : "bg-white dark:bg-[#141414]";
  const innerBg = isDark ? "bg-[#505050]" : "bg-[#ECECEC] dark:bg-[#181818]";

  return (
    <div className={`relative flex h-full min-h-[380px] sm:min-h-full items-stretch overflow-hidden rounded-l-[16px] p-5 sm:p-9 ${outerBg}`}>
      {/* Relative wrapper holding both the inner card and the protruding corner slots */}
      <div className="relative flex flex-1 items-stretch">
        {/* Inner sub-card */}
        <div
          className={`relative flex flex-1 flex-col justify-between overflow-hidden shadow-sm ${innerBg}`}
          style={{
            borderRadius: 12,
            clipPath: `polygon(
              ${FOLD}px 0%,
              100% 0%,
              100% calc(100% - ${FOLD}px),
              calc(100% - ${FOLD}px) 100%,
              0% 100%,
              0% ${FOLD}px
            )`,
          }}
        >
          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            {/* Logo */}
            <img
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 aspect-[156/210] w-[55%] max-w-[200px] min-w-[120px] select-none object-contain object-top"
              src={plan.logo}
            />

            {/* Plan name */}
            <h3
              className={`relative z-10 font-jakarta text-[30px] font-semibold leading-[1.05] tracking-tight sm:text-[36px] ${isDark ? "text-white" : "text-gray-900 dark:text-white"
                }`}
            >
              {plan.head}
              <br />
              {plan.accent}
            </h3>

            {/* Price */}
            <div className="relative z-10 pt-10">
              <p className={`font-jakarta text-[13px] ${isDark ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                {plan.priceLabel}
              </p>
              <p
                className={`font-jetbrains text-[44px] font-black leading-none tracking-tight sm:text-[52px] ${isDark ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
              >
                <span className="text-brand-orange">{plan.price.charAt(0)}</span>
                {plan.price.slice(1)}
              </p>
              <p
                className={`mt-2 min-h-[16px] font-jetbrains text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-600 dark:text-gray-300"
                  }`}
              >
                {plan.unit || "\u00A0"}
              </p>
              <p
                className={`mt-1 min-h-[16px] max-w-[180px] sm:max-w-[210px] font-jakarta text-[11px] leading-snug sm:text-[12px] ${isDark ? "text-gray-500" : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                {plan.note || "\u00A0"}
              </p>
            </div>

            <ScannerIndicator isDark={isDark} />
          </div>
        </div>

        {/* Top-left corner slot with protruding ears and soft drop-shadow */}
        <TopLeftCornerSlot isDark={isDark} />

        {/* Bottom-right corner slot with protruding ears and soft drop-shadow */}
        <BottomRightCornerSlot isDark={isDark} />
      </div>
    </div>
  );
};

// Right half of the card — features + CTA (dark-themed for Custom).
const RightSection = ({ plan }: { plan: Plan }) => {
  const isDark = plan.id === "custom";

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-r-[16px] p-6 sm:p-8 md:rounded-l-none ${isDark ? "bg-[#282828]" : "bg-white dark:bg-[#141414]"
        }`}
    >
      <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-orange/40 px-3 py-1 font-jetbrains text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
        What&apos;s included
      </span>

      <ul className={`flex flex-col divide-y divide-dashed ${isDark ? "divide-white/10" : "divide-gray-200/90 dark:divide-white/10"
        }`}>
        {plan.features.map((f) => (
          <li
            key={f}
            className={`flex items-center gap-3 py-[11px] font-jakarta text-[14px] leading-tight sm:text-[15px] ${isDark ? "text-gray-200" : "text-gray-800 dark:text-gray-200"
              }`}
          >
            <CheckBadge />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <LetsTalkButton fullWidth showArrow href={plan.href} variant={isDark ? "light" : "color"}>
          {plan.cta}
        </LetsTalkButton>
      </div>
    </div>
  );
};

// A shadow that sweeps across while the leaf is mid-turn, then clears.
const FoldShadow = ({ trigger }: { trigger: string }) => (
  <motion.div
    key={trigger}
    aria-hidden
    animate={{ opacity: [0, 0.5, 0] }}
    className="pointer-events-none absolute inset-0 z-30 rounded-[16px]"
    initial={{ opacity: 0 }}
    style={{
      background:
        "linear-gradient(105deg, rgba(2,2,6,0.5) 0%, rgba(2,2,6,0) 55%)",
    }}
    transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.5, 1] }}
  />
);

const PricingFlip = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PlanId>("monthly");
  const isCustom = active === "custom";

  // Only the leaf moves. It hinges on the card's centre spine and swings 180° —
  // left when opening Custom, back to the right for Monthly. Low damping = a
  // soft bounce as it lands.
  const spin = reduce
    ? { type: "tween" as const, duration: 0.35, ease: "easeInOut" as const }
    : { type: "spring" as const, stiffness: 50, damping: 11, mass: 1.1 };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-8 flex justify-center max-md:mb-6">
        <div className="flex items-center gap-1.5 rounded-[22px] border border-black/[0.08] bg-[#EFEFEF] p-1.5 dark:border-white/10 dark:bg-[#1C1C1C] max-md:max-w-full max-md:gap-1 max-md:rounded-[18px] max-md:p-1">
          {TABS.map((tab) => {
            const isActive = tab.id === active;

            return (
              <button
                key={tab.id}
                className="relative rounded-[16px] px-6 py-2.5 outline-none transition-colors max-md:rounded-[13px] max-md:px-3 max-md:py-2 sm:px-8 sm:py-3"
                type="button"
                onClick={() => setActive(tab.id)}
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-[16px] border border-black/[0.06] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#282828]"
                    layoutId="pricing-flip-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap max-md:gap-1">
                  <span
                    className={`font-jakarta text-[15px] max-md:text-[12px] sm:text-[16px] ${isActive
                      ? "font-semibold text-gray-950 dark:text-white"
                      : "font-medium text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`font-jakarta text-[15px] max-md:text-[12px] sm:text-[16px] ${isActive
                      ? "font-normal text-gray-500 dark:text-gray-400"
                      : "font-normal text-gray-400 dark:text-gray-500"
                      }`}
                  >
                    {tab.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book */}
      <div className="mx-auto max-w-3xl">
        {/* Main card wrapper */}
        <div className="rounded-[24px] border border-black/[0.08] bg-white p-2 shadow-[0_10px_24px_-4px_rgba(0,0,0,0.18),0_4px_10px_-2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#141414] dark:shadow-[0_12px_28px_rgba(0,0,0,0.7)] sm:p-2.5">
          {/* ---- md+ : a real book. One leaf turns on the centre spine. ---- */}
          <div className="relative hidden [perspective:2400px] md:block">
            {/* Height sizer — tracks the taller plan so nothing resizes. */}
            <div aria-hidden className="invisible grid">
              <div className="col-start-1 row-start-1 grid grid-cols-2">
                <LeftSection plan={PLANS.monthly} />
                <RightSection plan={PLANS.monthly} />
              </div>
              <div className="col-start-1 row-start-1 grid grid-cols-2">
                <LeftSection plan={PLANS.custom} />
                <RightSection plan={PLANS.custom} />
              </div>
            </div>

            {/* LEFT page — Monthly's identity. Stays put; the leaf covers it
                once Custom is open. Only casts shadow when uncovered. */}
            <div
              className={`absolute inset-y-0 left-0 w-1/2 rounded-l-[16px] ${!isCustom
                ? "shadow-[-6px_8px_16px_rgba(0,0,0,0.14),-2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[-6px_10px_20px_rgba(0,0,0,0.65)]"
                : ""
                }`}
            >
              <LeftSection plan={PLANS.monthly} />
            </div>

            {/* RIGHT page — Custom's checklist. Stays put; the leaf covers it
                while Monthly is open. Only casts shadow when uncovered (isCustom). */}
            <div
              className={`absolute inset-y-0 right-0 w-1/2 rounded-r-[16px] ${isCustom
                ? "shadow-[6px_8px_16px_rgba(0,0,0,0.14),2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[6px_10px_20px_rgba(0,0,0,0.65)]"
                : ""
                }`}
            >
              <RightSection plan={PLANS.custom} />
            </div>

            {/* THE LEAF — the only moving part. Front = Monthly's checklist,
                back = Custom's identity. Hinged on the centre spine. */}
            <motion.div
              animate={{ rotateY: isCustom ? -180 : 0, z: 2 }}
              className="absolute inset-y-0 left-1/2 right-0 z-10 [transform-style:preserve-3d]"
              style={{ transformOrigin: "0% 50%" }}
              transition={spin}
            >
              {/* Front of leaf: Monthly checklist (on right side when !isCustom) */}
              <div
                className={`absolute inset-0 rounded-r-[16px] [backface-visibility:hidden] ${!isCustom
                  ? "shadow-[6px_8px_16px_rgba(0,0,0,0.14),2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[6px_10px_20px_rgba(0,0,0,0.65)]"
                  : ""
                  }`}
              >
                <RightSection plan={PLANS.monthly} />
              </div>

              {/* Back of leaf: Custom identity (on left side when isCustom) */}
              <div
                className={`absolute inset-0 rounded-l-[16px] [backface-visibility:hidden] ${isCustom
                  ? "shadow-[-6px_8px_16px_rgba(0,0,0,0.14),-2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[-6px_10px_20px_rgba(0,0,0,0.65)]"
                  : ""
                  }`}
                style={{ transform: "rotateY(180deg)" }}
              >
                <LeftSection plan={PLANS.custom} />
              </div>
            </motion.div>

            {/* centre gutter */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 bg-black/10 dark:bg-white/10" />

            {!reduce && <FoldShadow trigger={active} />}
          </div>

          {/* ---- below md : stacked, quick cross-fade ---- */}
          <motion.div
            key={active}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 md:hidden"
            initial={{ opacity: 0, y: 6 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <RightSection plan={PLANS[active]} />
            </div>
            <div className="overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <LeftSection plan={PLANS[active]} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingFlip;

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import LetsTalkButton from "@/components/LetsTalkButton";

type PlanId = "monthly" | "custom";

interface Plan {
  id: PlanId;
  head: string;
  accent: string;
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

const ScannerIndicator = () => {
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
          className={`w-[22px] bg-gray-900 dark:bg-white ${seg.rounded}`}
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

// Left half of the card — identity, price + scanner indicator.
const LeftSection = ({ plan }: { plan: Plan }) => (
  <div className="relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[16px] md:rounded-r-none md:rounded-l-[16px] bg-[#ECECEC] p-6 sm:p-8 dark:bg-[#181818]">
    {/* Square box at the top corner, right side */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 aspect-square w-[66%] max-w-[300px] min-w-[180px] bg-[#D8D8D8] dark:bg-[#252525]"
    />

    {/* stacked plan name, sitting over the top */}
    <h3 className="relative z-10 font-jakarta text-[30px] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-[36px] dark:text-white">
      {plan.head}
      <br />
      {plan.accent}
    </h3>

    {/* price */}
    <div className="relative z-10 pt-10">
      <p className="font-jakarta text-[13px] text-gray-500 dark:text-gray-400">
        {plan.priceLabel}
      </p>
      <p className="font-jetbrains text-[44px] font-black leading-none tracking-tight text-gray-900 sm:text-[52px] dark:text-white">
        <span className="text-brand-orange">{plan.price.charAt(0)}</span>
        {plan.price.slice(1)}
      </p>
      {plan.unit ? (
        <p className="mt-2 font-jetbrains text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {plan.unit}
        </p>
      ) : null}
      {plan.note ? (
        <p className="mt-1 font-jakarta text-[11px] leading-snug text-gray-500 sm:text-[12px] dark:text-gray-400">
          {plan.note}
        </p>
      ) : null}
    </div>

    {/* Scanner indicator animation at bottom right */}
    <ScannerIndicator />
  </div>
);

// Right half of the card — what's included + CTA.
const RightSection = ({ plan }: { plan: Plan }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-[16px] md:rounded-l-none md:rounded-r-[16px] bg-white p-6 sm:p-8 dark:bg-[#141414]">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-orange/40 px-3 py-1 font-jetbrains text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
      What&apos;s included
    </span>

    <ul className="flex flex-col divide-y divide-dashed divide-gray-200/90 dark:divide-white/10">
      {plan.features.map((f) => (
        <li
          key={f}
          className="flex items-center gap-3 py-[11px] font-jakarta text-[14px] leading-tight text-gray-800 sm:text-[15px] dark:text-gray-200"
        >
          <CheckBadge />
          <span>{f}</span>
        </li>
      ))}
    </ul>

    <div className="mt-auto pt-5">
      <LetsTalkButton fullWidth showArrow href={plan.href} variant="color">
        {plan.cta}
      </LetsTalkButton>
    </div>
  </div>
);

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
    <section className="section-container">
      {/* Tabs */}
      <div className="mb-8 flex justify-center max-md:mb-6">
        <div className="flex items-center gap-1.5 rounded-[22px] border border-black/[0.08] bg-[#EFEFEF] p-1.5 dark:border-white/10 dark:bg-[#1C1C1C]">
          {TABS.map((tab) => {
            const isActive = tab.id === active;

            return (
              <button
                key={tab.id}
                className="relative rounded-[16px] px-6 py-2.5 outline-none transition-colors sm:px-8 sm:py-3"
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
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`font-jakarta text-[15px] sm:text-[16px] ${
                      isActive
                        ? "font-semibold text-gray-950 dark:text-white"
                        : "font-medium text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`font-jakarta text-[15px] sm:text-[16px] ${
                      isActive
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
        <div className="rounded-[24px] border border-black/[0.08] bg-white p-2 shadow-[0_10px_24px_-4px_rgba(0,0,0,0.18),0_4px_10px_-2px_rgba(0,0,0,0.08)] sm:p-2.5 dark:border-white/10 dark:bg-[#141414] dark:shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
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
              className={`absolute inset-y-0 left-0 w-1/2 rounded-l-[16px] ${
                !isCustom
                  ? "shadow-[-6px_8px_16px_rgba(0,0,0,0.14),-2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[-6px_10px_20px_rgba(0,0,0,0.65)]"
                  : ""
              }`}
            >
              <LeftSection plan={PLANS.monthly} />
            </div>

            {/* RIGHT page — Custom's checklist. Stays put; the leaf covers it
                while Monthly is open. Only casts shadow when uncovered (isCustom). */}
            <div
              className={`absolute inset-y-0 right-0 w-1/2 rounded-r-[16px] ${
                isCustom
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
                className={`absolute inset-0 rounded-r-[16px] [backface-visibility:hidden] ${
                  !isCustom
                    ? "shadow-[6px_8px_16px_rgba(0,0,0,0.14),2px_4px_6px_rgba(0,0,0,0.06)] dark:shadow-[6px_10px_20px_rgba(0,0,0,0.65)]"
                    : ""
                }`}
              >
                <RightSection plan={PLANS.monthly} />
              </div>

              {/* Back of leaf: Custom identity (on left side when isCustom) */}
              <div
                className={`absolute inset-0 rounded-l-[16px] [backface-visibility:hidden] ${
                  isCustom
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
            <div className="overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <RightSection plan={PLANS[active]} />
            </div>
            <div className="overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <LeftSection plan={PLANS[active]} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingFlip;

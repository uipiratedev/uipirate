import React, { SVGProps } from "react";

export type CosIconName =
  // Goals
  | "traffic"
  | "authority"
  | "conversion"
  | "engagement"
  | "lead-generation"
  | "retention"
  // Types
  | "blog"
  | "tutorial"
  | "case-study"
  | "community-insight"
  | "corporate-post"
  | "product-review"
  | "product-launch"
  | "listicle"
  | "comparison"
  | "newsletter"
  | "social-post"
  // Utilities & UI Emojis
  | "bolt"
  | "bot"
  | "sparkles"
  | "megaphone"
  | "refresh"
  | "check"
  | "cross"
  | "warning"
  | "celebrate"
  | "trash"
  | "edit"
  | "eye"
  | "draft"
  | "arrow-left"
  | "link"
  | "envelope"
  | "list"
  | "tasks"
  | "star"
  | "image"
  | "video"
  | "table"
  | "divider";

interface CosIconProps extends SVGProps<SVGSVGElement> {
  name: CosIconName | string;
  size?: number;
}

export default function CosIcon({ name, size = 18, className = "", ...props }: CosIconProps) {
  const baseProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...props,
  };

  switch (name) {
    // Goals
    case "traffic":
      return (
        <svg {...baseProps}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "authority":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case "conversion":
      return (
        <svg {...baseProps}>
          <line x1="12" x2="12" y1="1" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "engagement":
      return (
        <svg {...baseProps}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "lead-generation":
      return (
        <svg {...baseProps}>
          <path d="M5 22h14" />
          <path d="M19 16c0-1.7-1.3-3-3-3H8c-1.7 0-3 1.3-3 3v4h14v-4z" />
          <path d="M12 2v11" />
          <path d="m17 7-5-5-5 5" />
        </svg>
      );
    case "retention":
      return (
        <svg {...baseProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    // Types
    case "blog":
      return (
        <svg {...baseProps}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "tutorial":
      return (
        <svg {...baseProps}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "case-study":
      return (
        <svg {...baseProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
          <line x1="8" x2="14" y1="11" y2="11" />
          <line x1="11" x2="11" y1="8" y2="14" />
        </svg>
      );
    case "community-insight":
      return (
        <svg {...baseProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "corporate-post":
      return (
        <svg {...baseProps}>
          <rect height="16" rx="2" ry="2" width="16" x="4" y="4" />
          <line x1="9" x2="9" y1="22" y2="18" />
          <line x1="15" x2="15" y1="22" y2="18" />
          <line x1="12" x2="12" y1="18" y2="4" />
        </svg>
      );
    case "product-review":
      return (
        <svg {...baseProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "product-launch":
      return (
        <svg {...baseProps}>
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
          <path d="M12 2C6.5 2 2 6.5 2 12c0 2.1.6 4.1 1.7 5.7L12 9l8.7-8.7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L12 9Z" />
          <path d="M9 15c-1.6 1.1-3.6 1.7-5.7 1.7 5.5 0 10-4.5 10-10 0 2.1-.6 4.1-1.7 5.7L9 15Z" />
          <path d="m19 9 3-3-4-4-3 3 4 4Z" />
        </svg>
      );
    case "listicle":
      return (
        <svg {...baseProps}>
          <line x1="9" x2="20" y1="6" y2="6" />
          <line x1="9" x2="20" y1="12" y2="12" />
          <line x1="9" x2="20" y1="18" y2="18" />
          <rect height="2" rx="0.5" width="2" x="4" y="5" />
          <rect height="2" rx="0.5" width="2" x="4" y="11" />
          <rect height="2" rx="0.5" width="2" x="4" y="17" />
        </svg>
      );
    case "comparison":
      return (
        <svg {...baseProps}>
          <line x1="12" x2="12" y1="3" y2="21" />
          <rect height="6" rx="1" width="8" x="2" y="5" />
          <rect height="6" rx="1" width="8" x="14" y="13" />
        </svg>
      );
    case "newsletter":
      return (
        <svg {...baseProps}>
          <rect height="14" rx="2" width="20" x="2" y="5" />
          <polyline points="22 7 12 14 2 7" />
        </svg>
      );
    case "social-post":
      return (
        <svg {...baseProps}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="16.49" />
          <line x1="15.41" x2="8.59" y1="7.51" y2="10.49" />
        </svg>
      );

    // Utilities & UI Emojis
    case "bolt":
      return (
        <svg {...baseProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "bot":
      return (
        <svg {...baseProps}>
          <rect height="12" rx="2" width="16" x="4" y="6" />
          <rect height="3" width="6" x="9" y="18" />
          <path d="M9 1v5" />
          <path d="M15 1v5" />
          <line x1="9" x2="15" y1="3" y2="3" />
          <circle cx="8" cy="12" r="1" />
          <circle cx="16" cy="12" r="1" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...baseProps}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z" strokeWidth={1} />
          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" strokeWidth={1} />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...baseProps}>
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          <path d="m22 8-6 4 6 4V8Z" />
          <path d="M2 10h9v4H2v-4Z" />
          <path d="M11 14h5v-4h-5v4Z" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...baseProps}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <polyline points="3 3 3 8 8 8" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <polyline points="16 16 21 16 21 21" />
        </svg>
      );
    case "check":
      return (
        <svg {...baseProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "cross":
      return (
        <svg {...baseProps}>
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      );
    case "warning":
      return (
        <svg {...baseProps}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      );
    case "celebrate":
      return (
        <svg {...baseProps}>
          <path d="m4 15 10-10 6 6-10 10H4v-6Z" />
          <path d="m14 5 6 6" />
          <path d="M8 11h.01M13 16h.01M16 8h.01M6 19h.01M11 22h.01" />
        </svg>
      );
    case "trash":
      return (
        <svg {...baseProps}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      );
    case "edit":
      return (
        <svg {...baseProps}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...baseProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "draft":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...baseProps}>
          <line x1="19" x2="5" y1="12" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );
    case "link":
      return (
        <svg {...baseProps}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "envelope":
      return (
        <svg {...baseProps}>
          <rect height="14" rx="2" width="20" x="2" y="5" />
          <polyline points="22 7 12 14 2 7" />
        </svg>
      );
    case "list":
      return (
        <svg {...baseProps}>
          <line x1="8" x2="21" y1="6" y2="6" />
          <line x1="8" x2="21" y1="12" y2="12" />
          <line x1="8" x2="21" y1="18" y2="18" />
          <line x1="3" x2="3.01" y1="6" y2="6" />
          <line x1="3" x2="3.01" y1="12" y2="12" />
          <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...baseProps}>
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "star":
      return (
        <svg {...baseProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );

    case "image":
      return (
        <svg {...baseProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "video":
      return (
        <svg {...baseProps}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case "table":
      return (
        <svg {...baseProps}>
          <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    case "divider":
      return (
        <svg {...baseProps}>
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );

    default:
      // Return a blank space or standard star icon if not found
      return (
        <svg {...baseProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}

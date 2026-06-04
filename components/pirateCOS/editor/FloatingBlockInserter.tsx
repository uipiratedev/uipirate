"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditorState } from "@tiptap/react";

import { getFeatures } from "@/lib/pirateCOS/postTypeConfig";

// ─── Floating Block Inserter (Medium-style) ───────────────────────────────────
export const FloatingBlockInserter = ({
  editor,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
  postType,
}: {
  editor: any;
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  postType?: string;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use Tiptap v3's reactive hook — re-renders on every selection change
  const editorState = useEditorState({
    editor,
    selector: (ctx: any) => {
      if (!ctx.editor) return { visible: false, top: 0 };
      const { state, view } = ctx.editor;
      const { selection } = state;
      const { $from } = selection;
      const isEmpty =
        $from.parent.type.name === "paragraph" &&
        $from.parent.textContent === "";

      if (!isEmpty) return { visible: false, top: 0 };
      try {
        const coords = view.coordsAtPos(selection.from);
        const domRect = view.dom.getBoundingClientRect();
        // Calculate the vertical center of the current cursor/line
        const cursorCenter = (coords.top + coords.bottom) / 2;

        return { visible: true, top: cursorCenter - domRect.top };
      } catch {
        return { visible: false, top: 0 };
      }
    },
  });

  const visible = editorState?.visible ?? false;
  const top = editorState?.top ?? 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Auto-close expanded toolbar when cursor leaves empty line
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  if (!visible) return null;

  const allBlockItems = [
    {
      id: "upload-image",
      label: "Upload Image",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <rect height="18" rx="2" width="18" x="3" y="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        imageUploadRef.current?.click();
      },
    },
    {
      id: "image-url",
      label: "Image URL",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        onImageUrl();
      },
    },
    {
      id: "video",
      label: "Embed Video",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect height="14" rx="2" ry="2" width="15" x="1" y="5" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        onVideoEmbed();
      },
    },
    {
      id: "code",
      label: "Code Block",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      id: "divider",
      label: "Divider",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <line x1="3" x2="21" y1="12" y2="12" />
          <line strokeOpacity="0.3" x1="3" x2="21" y1="6" y2="6" />
          <line strokeOpacity="0.3" x1="3" x2="21" y1="18" y2="18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().setHorizontalRule().run();
      },
    },
    {
      id: "quote",
      label: "Blockquote",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      id: "table",
      label: "Table",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
  ];

  const blockItems = allBlockItems.filter((item) => {
    const features = getFeatures(postType || "blog");

    if (postType === "social-post") {
      return (
        item.id === "upload-image" ||
        item.id === "image-url" ||
        item.id === "video"
      );
    }
    if (item.id === "code") return !!features.codeBlocks;
    if (item.id === "table") return !!features.tables;
    if (item.id === "quote") return postType !== "social-post";

    return true;
  });

  return (
    <div
      ref={menuRef}
      className="absolute z-20 flex items-center"
      style={{
        top: top + 16, // Offset by parent py-4
        left: 12,
        height: 28,
        transform: "translateY(-50%)", // Perfect vertical centering
      }}
    >
      <button
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 select-none flex-shrink-0"
        style={{
          border: "none",
          background: open ? "#FF5B04" : "#1a1a1a",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        title="Add block"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <svg
          fill="none"
          height="13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
          viewBox="0 0 24 24"
          width="13"
        >
          <line x1="12" x2="12" y1="5" y2="19" />
          <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-9 flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl whitespace-nowrap"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            animation: "fadeSlideIn 0.15s ease",
          }}
        >
          {blockItems.map((item) => (
            <button
              key={item.id}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 transition-all duration-150"
              title={item.label}
              onMouseDown={(e) => {
                e.preventDefault();
                item.action();
              }}
            >
              {item.icon}
            </button>
          ))}
          <div
            className="w-px h-5 mx-0.5"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />
          <span className="text-[10px] font-jetbrains-mono text-gray-300 pr-1">
            or type /
          </span>
        </div>
      )}
    </div>
  );
};

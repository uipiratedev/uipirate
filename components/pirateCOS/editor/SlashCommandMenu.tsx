"use client";

import React, { useEffect, useRef } from "react";

import CosIcon from "@/components/pirateCOS/CosIcon";
import { getFeatures } from "@/lib/pirateCOS/postTypeConfig";

// ─── Slash Command Menu ───────────────────────────────────────────────────────
export const SlashCommandMenu = ({
  editor,
  isOpen,
  onClose,
  position,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
  postType,
}: {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  postType?: string;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const commands = React.useMemo(() => {
    const features = postType ? getFeatures(postType) : null;
    const all = [
      {
        title: "Heading 1",
        icon: "H1",
        desc: "Large section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Heading 2",
        icon: "H2",
        desc: "Medium section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Heading 3",
        icon: "H3",
        desc: "Small section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bullet List",
        icon: "•",
        desc: "Create a simple list",
        command: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        icon: "1.",
        desc: "Create a numbered list",
        command: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Task List",
        icon: "☑",
        desc: "Track tasks with checkboxes",
        command: () => editor.chain().focus().toggleTaskList().run(),
        featureKey: "taskLists",
      },
      {
        title: "Quote",
        icon: '"',
        desc: "Capture a quote",
        command: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code Block",
        icon: "</>",
        desc: "Add a code snippet",
        command: () => editor.chain().focus().toggleCodeBlock().run(),
        featureKey: "codeBlocks",
      },
      {
        title: "Divider",
        icon: "divider",
        desc: "Add a horizontal rule",
        command: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        title: "Image Upload",
        icon: "image",
        desc: "Upload an image from disk",
        command: () => {
          imageUploadRef.current?.click();
        },
      },
      {
        title: "Image URL",
        icon: "link",
        desc: "Embed an image via URL",
        command: onImageUrl,
      },
      {
        title: "Embed Video",
        icon: "video",
        desc: "YouTube, Vimeo, Loom…",
        command: onVideoEmbed,
      },
      {
        title: "Table",
        icon: "table",
        desc: "Insert a 3x3 table",
        command: () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
        featureKey: "tables",
      },
    ];

    return all.filter((c) => {
      if (postType === "social-post") {
        return ["Image Upload", "Image URL", "Embed Video"].includes(c.title);
      }
      if (!features) return true;
      if (c.featureKey === "codeBlocks") return !!features.codeBlocks;
      if (c.featureKey === "tables") return !!features.tables;
      if (c.featureKey === "taskLists") return !!features.taskLists;

      return true;
    });
  }, [editor, onImageUrl, onVideoEmbed, imageUploadRef, postType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        onClose();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-20 rounded-2xl shadow-2xl py-2 min-w-[260px] max-h-[380px] overflow-y-auto"
      style={{
        top: `${position.top + 8}px`,
        left: `${position.left}px`,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        animation: "fadeSlideIn 0.12s ease",
      }}
    >
      <p className="px-4 py-1.5 text-[9px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest">
        Blocks
      </p>
      {commands.map((command, index) => (
        <button
          key={index}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-black/5 transition-colors text-left"
          onClick={() => {
            command.command();
            onClose();
          }}
        >
          <span className="text-xs font-bold font-jetbrains-mono text-gray-400 w-7 text-center flex-shrink-0 flex items-center justify-center">
            <CosIcon name={command.icon} size={14} className="text-gray-400" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium font-geist text-gray-800 leading-snug">
              {command.title}
            </div>
            <div className="text-[11px] font-geist text-gray-400 leading-snug">
              {command.desc}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

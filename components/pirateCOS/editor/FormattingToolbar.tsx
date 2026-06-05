"use client";

import React, { useState } from "react";
import { useEditorState } from "@tiptap/react";

import CosIcon from "@/components/pirateCOS/CosIcon";

// ─── Formatting Toolbar ───────────────────────────────────────────────────────
export const FormattingToolbar = ({
  editor,
  onLinkClick,
  activePreset,
  onPresetChange,
  features,
  postType,
}: {
  editor: any;
  onLinkClick: () => void;
  activePreset: string;
  onPresetChange: (preset: string) => void;
  features?: any;
  postType?: string;
}) => {
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);

  // Re-render when editor state changes to update active buttons and show image controls
  const { isImage, imageAttrs } = useEditorState({
    editor,
    selector: (ctx: any) => {
      if (!ctx.editor) return { isImage: false, imageAttrs: null };

      return {
        isImage: ctx.editor.isActive("image"),
        imageAttrs: ctx.editor.isActive("image")
          ? ctx.editor.getAttributes("image")
          : null,
      };
    },
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg transition-all font-semibold text-sm font-geist ${
      active
        ? "text-white"
        : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
    }`;
  const activeStyle = { background: "#FF5B04" };
  const sep = <div className="w-px h-5 bg-black/10 mx-1" />;

  const colors = [
    { name: "Orange", value: "#FF5B04" },
    { name: "Black", value: "#1A1A1A" },
    { name: "Blue", value: "#1D4ED8" },
    { name: "Green", value: "#15803D" },
    { name: "Purple", value: "#6D28D9" },
  ];

  return (
    <div
      className="sticky top-0 z-10 backdrop-blur-md py-2 px-4 flex items-center gap-0.5 flex-wrap"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Undo / Redo */}
      <button
        className={btn(false)}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <svg
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="14"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>
      <button
        className={btn(false)}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <svg
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="14"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
      </button>
      {sep}
      <button
        className={btn(editor.isActive("bold"))}
        style={editor.isActive("bold") ? activeStyle : {}}
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        className={btn(editor.isActive("italic"))}
        style={editor.isActive("italic") ? activeStyle : {}}
        title="Italic (Ctrl+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </button>
      <button
        className={btn(editor.isActive("strike"))}
        style={editor.isActive("strike") ? activeStyle : {}}
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </button>
      {postType !== "social-post" && (
        <>
          <button
            className={btn(editor.isActive("code"))}
            style={editor.isActive("code") ? activeStyle : {}}
            title="Inline code"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {"<>"}
          </button>
          <button
            className={btn(editor.isActive("highlight"))}
            style={editor.isActive("highlight") ? activeStyle : {}}
            title="Highlight"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Mk
          </button>
        </>
      )}

      {/* Sleek Text Color Menu */}
      {postType !== "social-post" && (
        <div className="relative flex items-center">
          <button
            className={btn(colorPaletteOpen)}
            style={colorPaletteOpen ? activeStyle : {}}
            title="Text Color"
            onClick={() => setColorPaletteOpen(!colorPaletteOpen)}
          >
            <span className="flex items-center gap-1">
              A
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10"
                style={{
                  backgroundColor:
                    editor.getAttributes("textStyle").color || "#1A1A1A",
                }}
              />
            </span>
          </button>
          {colorPaletteOpen && (
            <div className="absolute top-full left-0 mt-1 flex items-center gap-1.5 bg-white border border-black/10 shadow-lg rounded-xl p-2 z-50 animate-in fade-in duration-100">
              {colors.map((c) => (
                <button
                  key={c.value}
                  className="w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-125 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    setColorPaletteOpen(false);
                  }}
                />
              ))}
              <button
                className="text-[10px] font-geist px-1.5 py-0.5 bg-black/5 hover:bg-black/10 rounded-md border border-black/10 text-gray-500 hover:text-black transition-colors cursor-pointer"
                title="Reset Color"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setColorPaletteOpen(false);
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      <button
        className={btn(editor.isActive("link"))}
        style={editor.isActive("link") ? activeStyle : {}}
        title="Insert Link (Ctrl+K)"
        onClick={onLinkClick}
      >
        <span className="flex items-center gap-1">
          <CosIcon name="link" size={12} /> Link
        </span>
      </button>
      {features?.affiliateLinks && (
        <button
          className={btn(false)}
          title="Insert Affiliate Link"
          onClick={() => {
            const url = prompt("Enter Affiliate URL:");

            if (url) {
              editor
                .chain()
                .focus()
                .setLink({
                  href: url,
                  target: "_blank",
                  rel: "nofollow sponsored",
                })
                .run();
            }
          }}
        >
          <span className="flex items-center gap-1">
            <CosIcon name="conversion" size={12} /> Affiliate Link
          </span>
        </button>
      )}
      {editor.isActive("link") && (
        <button
          className={btn(false)}
          title="Remove Link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <span className="flex items-center gap-1">
            Unlink <CosIcon name="cross" size={12} />
          </span>
        </button>
      )}

      {sep}
      {postType !== "social-post" && (
        <>
          <button
            className={btn(editor.isActive("heading", { level: 1 }))}
            style={editor.isActive("heading", { level: 1 }) ? activeStyle : {}}
            title="Heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 2 }))}
            style={editor.isActive("heading", { level: 2 }) ? activeStyle : {}}
            title="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 3 }))}
            style={editor.isActive("heading", { level: 3 }) ? activeStyle : {}}
            title="Heading 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
          {sep}
          <button
            className={btn(editor.isActive("bulletList"))}
            style={editor.isActive("bulletList") ? activeStyle : {}}
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            className={btn(editor.isActive("orderedList"))}
            style={editor.isActive("orderedList") ? activeStyle : {}}
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          {sep}
        </>
      )}
      {features?.taskLists && (
        <button
          className={btn(editor.isActive("taskList"))}
          style={editor.isActive("taskList") ? activeStyle : {}}
          title="Task List"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <span className="flex items-center gap-1">
            <CosIcon name="tasks" size={12} /> Task List
          </span>
        </button>
      )}
      {postType !== "social-post" && (
        <button
          className={btn(editor.isActive("blockquote"))}
          style={editor.isActive("blockquote") ? activeStyle : {}}
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo; Quote
        </button>
      )}
      {features?.codeBlocks && (
        <button
          className={btn(editor.isActive("codeBlock"))}
          style={editor.isActive("codeBlock") ? activeStyle : {}}
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </button>
      )}
      {postType !== "social-post" && (
        <>
          {sep}
          <button
            className={btn(false)}
            title="Horizontal Rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            —
          </button>
        </>
      )}
      {isImage && (
        <>
          {sep}
          <div className="flex items-center gap-1 bg-orange-50/60 border border-orange-100 rounded-xl px-2 py-0.5 animate-in fade-in duration-100">
            <span className="text-[10px] font-bold font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider mr-1">
              Image Size:
            </span>
            {[
              { id: "auto", label: "Original" },
              { id: "25%", label: "25%" },
              { id: "50%", label: "50%" },
              { id: "75%", label: "75%" },
              { id: "100%", label: "Fit" }
            ].map((size) => {
              const currentWidth = imageAttrs?.width || "auto";

              return (
                <button
                  key={size.id}
                  className={btn(currentWidth === size.id)}
                  style={currentWidth === size.id ? activeStyle : {}}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .updateAttributes("image", { width: size.id })
                      .run()
                  }
                >
                  {size.label}
                </button>
              );
            })}

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <span className="text-[10px] font-bold font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider mr-1">
              Align:
            </span>
            {[
              { id: "left", label: "Left" },
              { id: "center", label: "Center" },
              { id: "right", label: "Right" },
            ].map((alignment) => {
              const currentAlign = imageAttrs?.align || "center";

              return (
                <button
                  key={alignment.id}
                  className={btn(currentAlign === alignment.id)}
                  style={currentAlign === alignment.id ? activeStyle : {}}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .updateAttributes("image", { align: alignment.id })
                      .run()
                  }
                >
                  {alignment.label}
                </button>
              );
            })}

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button
              className={btn(false)}
              style={{ color: "#dc2626" }}
              title="Delete Image"
              onClick={() => editor.chain().focus().deleteSelection().run()}
            >
              <svg
                className="w-3.5 h-3.5 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </>
      )}

      {features?.tables && editor.isActive("table") && (
        <>
          {sep}
          <div className="flex items-center gap-1 bg-orange-50/60 border border-orange-100 rounded-xl px-2 py-0.5">
            <span className="text-[10px] font-bold font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider mr-1">
              Table Controls:
            </span>

            <button
              className={btn(false)}
              title="Add Row Above"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row ↑</span>
            </button>

            <button
              className={btn(false)}
              title="Add Row Below"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row ↓</span>
            </button>

            <button
              className={btn(false)}
              title="Delete Row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button
              className={btn(false)}
              title="Add Column Before"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col ←</span>
            </button>

            <button
              className={btn(false)}
              title="Add Column After"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col →</span>
            </button>

            <button
              className={btn(false)}
              title="Delete Column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button
              className={btn(false)}
              title="Toggle Header Row"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              <span className="text-[10px]">H-Row</span>
            </button>

            <button
              className={btn(false)}
              title="Toggle Header Column"
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              <span className="text-[10px]">H-Col</span>
            </button>

            <button
              className={btn(false)}
              style={{ color: "#dc2626" }}
              title="Delete Table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <svg
                className="w-3.5 h-3.5 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className="text-[10px] ml-1">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

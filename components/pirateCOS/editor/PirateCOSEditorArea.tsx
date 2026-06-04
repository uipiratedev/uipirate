"use client";

import React, { useState, useEffect, useRef } from "react";
import { EditorContent } from "@tiptap/react";

import { getFeatures } from "@/lib/pirateCOS/postTypeConfig";
import { FloatingBlockInserter } from "./FloatingBlockInserter";
import { SlashCommandMenu } from "./SlashCommandMenu";
import { FormattingToolbar } from "./FormattingToolbar";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PirateCOSEditorAreaProps {
  editor: any;
  postType?: string;
  activePreset: string;
  onPresetChange: (preset: string) => void;
  onLinkClick: () => void;
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  /** Ref forwarded to the hidden file input managed by the page */
  imageUploadRef: React.RefObject<HTMLInputElement>;
  /** Banner image area and any other content above the editor body */
  children?: React.ReactNode;
}

// ─── PirateCOSEditorArea ──────────────────────────────────────────────────────
export const PirateCOSEditorArea = ({
  editor,
  postType,
  activePreset,
  onPresetChange,
  onLinkClick,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
  children,
}: PirateCOSEditorAreaProps) => {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Attach the "/" key handler directly to the editor DOM so we don't need
  // editorProps.handleDOMEvents in each page's useEditor call.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "/") {
        const { selection } = editor.state;
        const { $from } = selection;
        const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
        if (textBefore === "" || textBefore.endsWith(" ")) {
          setTimeout(() => {
            const coords = editor.view.coordsAtPos(selection.from);
            setSlashMenuPosition({
              top: coords.bottom + window.scrollY,
              left: coords.left + window.scrollX,
            });
            setSlashMenuOpen(true);
          }, 0);
        }
      } else if (event.key === "Escape" && slashMenuOpen) {
        setSlashMenuOpen(false);
      }
    };

    dom.addEventListener("keydown", handler);
    return () => dom.removeEventListener("keydown", handler);
  }, [editor, slashMenuOpen]);

  if (!editor) return null;

  const features = getFeatures(postType || "blog");

  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-black/5 flex flex-col overflow-hidden">
      {/* Sticky formatting toolbar */}
      <FormattingToolbar
        activePreset={activePreset}
        editor={editor}
        features={features}
        postType={postType}
        onLinkClick={onLinkClick}
        onPresetChange={onPresetChange}
      />

      {/* Scrollable editor body */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Banner image / page-specific slot */}
        {children}

        {/* Editor canvas */}
        <div ref={editorRef} className="relative px-4 lg:px-14 py-4">
          <FloatingBlockInserter
            editor={editor}
            imageUploadRef={imageUploadRef}
            postType={postType}
            onImageUrl={() => { setSlashMenuOpen(false); onImageUrl(); }}
            onVideoEmbed={() => { setSlashMenuOpen(false); onVideoEmbed(); }}
          />

          <div className="notion-editor-wrapper min-h-[520px]">
            <EditorContent editor={editor} />
          </div>

          <SlashCommandMenu
            editor={editor}
            imageUploadRef={imageUploadRef}
            isOpen={slashMenuOpen}
            position={slashMenuPosition}
            postType={postType}
            onClose={() => setSlashMenuOpen(false)}
            onImageUrl={() => { setSlashMenuOpen(false); onImageUrl(); }}
            onVideoEmbed={() => { setSlashMenuOpen(false); onVideoEmbed(); }}
          />
        </div>
      </div>

      {/* Editor styles */}
      <style>{EDITOR_STYLES}</style>
    </div>
  );
};

// ─── Shared inline CSS ────────────────────────────────────────────────────────
const EDITOR_STYLES = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .notion-editor-wrapper .ProseMirror { position: relative; outline: none; min-height: 500px; }
  .notion-editor-wrapper .ProseMirror > * { position: relative; margin-bottom: 0.25rem; }
  .notion-editor-wrapper .ProseMirror > *:hover { background-color: rgba(0,0,0,0.02); border-radius: 4px; }
  .notion-editor-wrapper .ProseMirror p.is-empty::before { color: #adb5bd; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
  .notion-editor-wrapper .ProseMirror p { line-height: 1.75; font-size: 1rem; color: #374151; margin: 0.5rem 0; }
  .notion-editor-wrapper .ProseMirror img { max-width: 100%; height: auto; border-radius: 12px; margin: 1.5rem auto; display: block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .notion-editor-wrapper .ProseMirror hr { border: none; border-top: 2px solid rgba(0,0,0,0.08); margin: 2rem 0; border-radius: 4px; }
  .notion-editor-wrapper .ProseMirror ul, .notion-editor-wrapper .ProseMirror ol { padding-left: 1.5rem; margin: 1rem 0; }
  .notion-editor-wrapper .ProseMirror li { margin: 0.5rem 0; line-height: 1.75; }
  .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
  .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label { flex: 0 0 auto; margin-top: 0.25rem; user-select: none; }
  .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label input { width: 1.25rem; height: 1.25rem; cursor: pointer; }
  .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > div { flex: 1 1 auto; }
  .notion-editor-wrapper .ProseMirror blockquote { border-left: 3px solid #FF5B04; padding-left: 1.25rem; padding-top: 0.5rem; padding-bottom: 0.5rem; color: #6b7280; font-style: italic; margin: 1.5rem 0; background-color: rgba(255,91,4,0.04); border-radius: 0 8px 8px 0; }
  .notion-editor-wrapper .ProseMirror code { background-color: #f3f4f6; border-radius: 6px; padding: 0.25rem 0.5rem; font-size: 0.9em; font-family: "Fira Code", monospace; color: #e11d48; }
  .notion-editor-wrapper .ProseMirror pre { background-color: #1e293b; color: #f1f5f9; border-radius: 12px; padding: 1.5rem; overflow-x: auto; margin: 1.5rem 0; border: 1px solid #334155; }
  .notion-editor-wrapper .ProseMirror pre code { background: none; color: inherit; padding: 0; }
  .notion-editor-wrapper .ProseMirror mark { background-color: #fef3c7; border-radius: 3px; padding: 0.125rem 0.25rem; }
  .notion-editor-wrapper .ProseMirror h1 { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #111827; line-height: 1.2; }
  .notion-editor-wrapper .ProseMirror h2 { font-size: 1.875rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.875rem; color: #1f2937; line-height: 1.3; }
  .notion-editor-wrapper .ProseMirror h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #374151; line-height: 1.4; }
  .video-embed-wrapper { margin: 1.5rem 0; }
  .video-embed-ratio { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 12px; overflow: hidden; background: #000; }
  .video-embed-ratio iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px; }
  .notion-editor-wrapper .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1.5rem 0; overflow: hidden; }
  .notion-editor-wrapper .ProseMirror td, .notion-editor-wrapper .ProseMirror th { min-width: 1em; border: 1px solid #e5e5e5; padding: 8px 12px; vertical-align: top; box-sizing: border-box; position: relative; }
  .notion-editor-wrapper .ProseMirror th { font-weight: bold; text-align: left; background-color: #f5f5f5; }
  .notion-editor-wrapper .ProseMirror .selectedCell:after { z-index: 2; position: absolute; content: ""; left: 0; right: 0; top: 0; bottom: 0; background: rgba(255,91,4,0.08); pointer-events: none; }
  .notion-editor-wrapper .ProseMirror .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: #FF5B04; pointer-events: none; }
  .notion-editor-wrapper .ProseMirror * { transition: background-color 0.15s ease; }
`;

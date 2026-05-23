"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Link from "@tiptap/extension-link";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loadAIConfig } from "@/components/admin/AIConfigPanel";


// ─── Modal helpers ───────────────────────────────────────────────────────────
const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center"
    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
    onMouseDown={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-[95vw]"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold font-geist text-gray-800">{title}</p>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Image URL Modal ─────────────────────────────────────────────────────────
const ImageUrlModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const insert = () => {
    if (url.trim()) {
      editor.chain().focus().setImage({ src: url.trim(), alt: alt.trim() || undefined }).run();
      onClose();
    }
  };

  return (
    <Modal title="Insert Image from URL" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">Image URL *</label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://example.com/image.png"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">Alt text (optional)</label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Describe the image…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={insert}
            disabled={!url.trim()}
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            style={{ background: "#FF5B04" }}
          >
            Insert Image
          </button>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Video Embed Modal ────────────────────────────────────────────────────────
const VideoEmbedModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const getEmbedUrl = (raw: string): string | null => {
    // YouTube
    const ytMatch = raw.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = raw.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    // Loom
    const loomMatch = raw.match(/loom\.com\/share\/([a-f0-9]+)/);
    if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

    // Direct iframe URL
    if (raw.startsWith("http")) return raw;

    return null;
  };

  const insert = () => {
    const embedUrl = getEmbedUrl(url.trim());
    if (embedUrl) {
      const captionHtml = caption
        ? `<p style="text-align:center;font-size:0.8rem;color:#9ca3af;margin-top:0.5rem">${caption}</p>`
        : "";
      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="video-embed-wrapper" contenteditable="false">
            <div class="video-embed-ratio">
              <iframe src="${embedUrl}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
            ${captionHtml}
          </div><p></p>`
        )
        .run();
      onClose();
    }
  };

  return (
    <Modal title="Embed Video" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Video URL (YouTube, Vimeo, Loom) *
          </label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">Caption (optional)</label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Add a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={insert}
            disabled={!url.trim()}
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            style={{ background: "#FF5B04" }}
          >
            Embed Video
          </button>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Link Modal ──────────────────────────────────────────────────────────────
const LinkModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [ctaType, setCtaType] = useState<"none" | "primary" | "secondary">("none");

  useEffect(() => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      setLinkText(selectedText);

      const attrs = editor.getAttributes("link");
      if (attrs.href) {
        setUrl(attrs.href);
      }
      if (attrs.class && attrs.class.includes("blog-cta-btn-secondary")) {
        setCtaType("secondary");
      } else if (attrs.class && attrs.class.includes("blog-cta-btn")) {
        setCtaType("primary");
      }
    }
  }, [editor]);

  const insert = () => {
    const trimmedUrl = url.trim();
    const trimmedText = linkText.trim() || trimmedUrl;
    if (trimmedUrl) {
      if (ctaType === "primary") {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${trimmedUrl}" class="blog-cta-btn">${trimmedText}</a> `)
          .run();
      } else if (ctaType === "secondary") {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${trimmedUrl}" class="blog-cta-btn-secondary">${trimmedText}</a> `)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${trimmedUrl}">${trimmedText}</a>`)
          .run();
      }
      onClose();
    }
  };

  return (
    <Modal title="Insert or Edit Link" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">Link Text *</label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Text to display…"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">Link URL *</label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div className="flex flex-col gap-2 select-none">
          <label className="text-xs font-geist text-gray-600 font-semibold mb-1 block">Link Style</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ctaType"
              checked={ctaType === "none"}
              onChange={() => setCtaType("none")}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
            />
            <span className="text-xs font-geist text-gray-700">Standard Link</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ctaType"
              checked={ctaType === "primary"}
              onChange={() => setCtaType("primary")}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
            />
            <span className="text-xs font-geist text-gray-700">Primary CTA Button (Orange)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ctaType"
              checked={ctaType === "secondary"}
              onChange={() => setCtaType("secondary")}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
            />
            <span className="text-xs font-geist text-gray-700">Secondary CTA Button (Dark)</span>
          </label>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={insert}
            disabled={!url.trim()}
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity cursor-pointer"
            style={{ background: "#FF5B04" }}
          >
            Save Link
          </button>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Custom Alert Modal ──────────────────────────────────────────────────────
const AlertModal = ({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) => (
  <Modal title={title} onClose={onClose}>
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-red-50 text-[#FF5B04] rounded-full flex items-center justify-center mx-auto mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-sm font-geist text-gray-600 mb-5">{message}</p>
      <button
        onClick={onClose}
        className="w-full h-10 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "#FF5B04" }}
      >
        Okay
      </button>
    </div>
  </Modal>
);

// ─── Publish Confirm Modal ───────────────────────────────────────────────────
const PublishConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  blogData,
  isSuccess,
  onViewBlogs,
  onKeepEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  blogData: { title: string; bannerImage: string; excerpt: string; tags: string[] };
  isSuccess: boolean;
  onViewBlogs: () => void;
  onKeepEditing: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[460px] max-w-[95vw] border border-black/5"
        style={{ animation: "fadeSlideIn 0.2s ease" }}
      >
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulse" style={{ background: "rgba(22, 163, 74, 0.1)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-geist text-gray-900 mb-2">Post Published!</h3>
            <p className="text-sm font-geist text-gray-500 mb-6">Your post has been successfully published and is now live.</p>
            <div className="flex gap-3">
              <button
                onClick={onViewBlogs}
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#FF5B04" }}
              >
                Go to Post List
              </button>
              <button
                onClick={onKeepEditing}
                className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Preview */}
            <div className="h-36 bg-gray-100 relative bg-cover bg-center flex items-end p-5" style={{ backgroundImage: blogData.bannerImage ? `url(${blogData.bannerImage})` : "linear-gradient(135deg, #FFF0E8 0%, #FFEBE0 100%)" }}>
              {!blogData.bannerImage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5B04" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="relative z-10 text-white w-full">
                <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-orange-400 font-semibold mb-1">Publish Preview</p>
                <h4 className="text-lg font-bold font-geist line-clamp-1">{blogData.title || "Untitled Post"}</h4>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold mb-1 block">Excerpt Preview</label>
                <p className="text-xs font-geist text-gray-600 line-clamp-2 italic bg-black/5 rounded-xl p-3">
                  {blogData.excerpt || "No excerpt provided. A summary will be auto-generated from your content."}
                </p>
              </div>

              {blogData.tags.length > 0 && (
                <div>
                  <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold mb-1.5 block">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {blogData.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-geist px-2.5 py-0.5 rounded-full" style={{ background: "#FFF0E8", color: "#FF5B04" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B04" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="text-[11px] font-geist text-[#FF5B04]/90 leading-normal">
                  Publishing will make this post immediately live on your blog. Make sure all your details are correct!
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-black/5">
                <button
                  onClick={onConfirm}
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: "#FF5B04" }}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing...
                    </>
                  ) : "Confirm & Publish"}
                </button>
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="h-11 px-5 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Save Draft Modal ────────────────────────────────────────────────────────
const SaveDraftModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  blogData,
  isSuccess,
  onViewBlogs,
  onKeepEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  blogData: { title: string; excerpt: string };
  isSuccess: boolean;
  onViewBlogs: () => void;
  onKeepEditing: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[400px] max-w-[95vw] border border-black/5"
        style={{ animation: "fadeSlideIn 0.2s ease" }}
      >
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulse" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-geist text-gray-900 mb-2">Draft Saved!</h3>
            <p className="text-sm font-geist text-gray-500 mb-6">Your progress has been saved successfully as a draft.</p>
            <div className="flex gap-3">
              <button
                onClick={onViewBlogs}
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#FF5B04" }}
              >
                Go to Post List
              </button>
              <button
                onClick={onKeepEditing}
                className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 bg-orange-50 text-[#FF5B04] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900">Save Draft</h3>
              <p className="text-xs font-geist text-gray-500 mt-1">Save your current progress to finish editing later.</p>
            </div>

            <div className="bg-black/5 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold">Post Title</div>
              <div className="text-sm font-geist text-gray-800 font-semibold line-clamp-1">{blogData.title || "Untitled Post"}</div>
              {blogData.excerpt && (
                <>
                  <div className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold pt-1">Excerpt</div>
                  <div className="text-xs font-geist text-gray-500 line-clamp-2">{blogData.excerpt}</div>
                </>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-black/5">
              <button
                onClick={onConfirm}
                disabled={isSaving}
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "#FF5B04" }}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Draft"}
              </button>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="h-11 px-5 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── AI Excerpt Modal ────────────────────────────────────────────────────────
const AIExcerptModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
  excerpt,
  setExcerpt,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
  excerpt: string;
  setExcerpt: (val: string) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<"openai" | "gemini" | "puter">(() => (loadAIConfig().defaultEngine ?? "puter") as "openai" | "gemini" | "puter");
  const [model, setModel] = useState<string>(() => loadAIConfig().defaultModel ?? "gpt-4o-mini");

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "openai" || engine === "puter") {
      if (!model.startsWith("gpt")) {
        setModel("gpt-5.5");
      }
    } else {
      setModel("gemini-flash-latest");
    }
  }, [engine, model]);

  // Sync result with initial excerpt if any
  useEffect(() => {
    if (isOpen) {
      setResult(excerpt || "");
      setError("");
    }
  }, [isOpen, excerpt]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textToSummarize = plainText.trim() || postTitle || "Untitled Post";

      if (engine === "puter") {
        let systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters) summarizing the following content. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text. Content:\n\n${textToSummarize}`;
        
        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });
        
        let text = "";
        if (chatResponse.message?.content) {
          text = typeof chatResponse.message.content === "string"
            ? chatResponse.message.content
            : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```html")) {
          text = text.replace(/^```html/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }
        
        // Remove surrounding quotes if model added them
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.substring(1, text.length - 1);
        }

        setResult(text);
      } else {
        // Send a custom prompt for excerpt if prompt is provided
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "excerpt",
            title: postTitle,
            content: prompt.trim() 
              ? `${textToSummarize}\n\nCustom Instructions:\n${prompt.trim()}`
              : textToSummarize,
            postType,
            engine,
            model,
            clientApiKey: (() => { try { const cfg = JSON.parse(localStorage.getItem("uipirate-ai-config") || "{}"); return engine === "gemini" ? cfg.geminiKey : cfg.openaiKey; } catch { return undefined; } })(),
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate excerpt.");
        }

        let cleanText = data.data.trim();
        if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
          cleanText = cleanText.substring(1, cleanText.length - 1);
        }
        setResult(cleanText);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    setExcerpt(result);
    onClose();
  };

  if (!isOpen) return null;

  // SEO bounds helper
  const getCounterColor = (len: number) => {
    if (len === 0) return "text-gray-400";
    if (len >= 120 && len <= 160) return "text-emerald-500 font-bold";
    if (len > 200) return "text-red-500 font-bold animate-pulse";
    return "text-amber-500 font-semibold";
  };

  const getCounterBg = (len: number) => {
    if (len === 0) return "bg-gray-100 border-gray-200 text-gray-500";
    if (len >= 120 && len <= 160) return "bg-emerald-50 border-emerald-200 text-emerald-800";
    if (len > 200) return "bg-red-50 border-red-200 text-red-800";
    return "bg-amber-50 border-amber-200 text-amber-800";
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
              : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        {/* Header with beautiful gradient badge */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              📝
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">AI Excerpt Generator</h3>
              <p className="text-xs text-gray-400 font-geist">Draft perfectly summarized, SEO-friendly snippets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Engine & Model Selector */}
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            {/* Engine selector */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">AI Intelligence Engine</span>
                <span className="text-[10px] text-gray-400 font-geist">Select the AI brain for excerpting</span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setEngine("openai")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-emerald-500 font-bold">●</span> OpenAI
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("gemini")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-blue-500 font-bold">✦</span> Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("puter")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-[#FF5B04] font-bold">⚡</span> Puter
                </button>
              </div>
            </div>

            {/* Separator line */}
            <div className="h-px bg-black/5" />

            {/* Model selector */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">Model Version</span>
                <span className="text-[10px] text-gray-400 font-geist">Choose the specific model capability</span>
              </div>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
              >
                {engine === "openai" || engine === "puter" ? (
                  <>
                    <option value="gpt-5.5-pro">👑 GPT-5.5 Pro (State-of-the-Art)</option>
                    <option value="gpt-5.5">🔥 GPT-5.5 Standard (Advanced & Creative)</option>
                    <option value="gpt-5.4-pro">💎 GPT-5.4 Pro (High Precision)</option>
                    <option value="gpt-5.4">⚡ GPT-5.4 Standard (Balanced & Fast)</option>
                    <option value="gpt-5.4-mini">🟢 GPT-5.4 Mini (Lightweight & Efficient)</option>
                    <option value="gpt-5.4-nano">🌱 GPT-5.4 Nano (Super Speed)</option>
                    <option value="gpt-5.3-chat">💬 GPT-5.3 Chat (Conversational)</option>
                    <option value="gpt-5.3-codex">💻 GPT-5.3 Codex (Programming & Logic)</option>
                    <option value="gpt-5.2-pro">💎 GPT-5.2 Pro (Professional)</option>
                    <option value="gpt-5.2-chat">💬 GPT-5.2 Chat (Standard Chat)</option>
                    <option value="gpt-5.2">⚡ GPT-5.2 Standard (General)</option>
                    <option value="gpt-5.1-chat-latest">💬 GPT-5.1 Chat (Legacy Chat)</option>
                    <option value="gpt-5.1">⚡ GPT-5.1 Standard (Legacy General)</option>
                    <option value="gpt-4o">🔥 GPT-4o Premium (Advanced & Creative)</option>
                    <option value="gpt-4o-mini">🟢 GPT-4o Mini (Fast & Efficient)</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-flash-latest">⚡ Gemini 1.5 Flash (Super Fast)</option>
                    <option value="gemini-1.5-pro-latest">🧬 Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash (Next-Gen Preview)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Custom Focus Instructions */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Focus Guidelines (Optional)
            </label>
            <input
              type="text"
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              placeholder="e.g. 'Emphasize the coding aspect', 'Make it sound casual'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin text-xs">🌀</span>
                  <span>Summarizing Post...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Excerpt</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Result / Preview Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label 
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                      ? "#3B82F6"
                      : "#FF5B04",
                }}
              >
                Draft Excerpt Preview
              </label>
              
              {/* Color-Coded SEO Character Counter */}
              <div className={`text-xs font-geist px-2 py-0.5 rounded-full border transition-all duration-300 ${getCounterBg(result.length)}`}>
                <span className={getCounterColor(result.length)}>{result.length}</span> / 160 chars
                {result.length >= 120 && result.length <= 160 && (
                  <span className="ml-1 text-[10px] font-semibold text-emerald-600">✓ Perfect SEO Length</span>
                )}
                {result.length > 200 && (
                  <span className="ml-1 text-[10px] font-bold text-red-600">⚠️ Truncated in search</span>
                )}
              </div>
            </div>

            <textarea
              rows={4}
              className={`w-full text-sm font-geist bg-gray-50 border rounded-2xl p-4 outline-none resize-none transition-all duration-300 ${
                isGenerating
                  ? engine === "openai"
                    ? "animate-pulse border-emerald-200"
                    : engine === "gemini"
                    ? "animate-pulse border-blue-200"
                    : "animate-pulse border-orange-200"
                  : "border-black/5 focus:border-orange-200 focus:ring-1 focus:ring-orange-100"
              }`}
              placeholder="Your AI excerpt will generate here, or you can type here to refine manually..."
              value={result}
              onChange={(e) => setResult(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleApply}
            disabled={!result.trim() || isGenerating}
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                  ? "#3B82F6"
                  : "#FF5B04",
            }}
          >
            <span>Apply Excerpt</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Title Modal ─────────────────────────────────────────────────────────
const AITitleModal = ({
  isOpen,
  onClose,
  editor,
  title,
  setTitle,
  postType,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  title: string;
  setTitle: (val: string) => void;
  postType: string;
}) => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<"openai" | "gemini" | "puter">(() => (loadAIConfig().defaultEngine ?? "puter") as "openai" | "gemini" | "puter");
  const [model, setModel] = useState<string>(() => loadAIConfig().defaultModel ?? "gpt-4o-mini");

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "openai" || engine === "puter") {
      if (!model.startsWith("gpt")) {
        setModel("gpt-5.5");
      }
    } else {
      setModel("gemini-flash-latest");
    }
  }, [engine, model]);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedTitle("");
      setSuggestions([]);
      setError("");
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textContext = plainText.trim().substring(0, 3000);

      if (engine === "puter") {
        let systemInstructions = `Suggest 3 high-impact, highly clickable, and search-optimized alternative titles for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${textContext}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["Optimized Title 1", "Optimized Title 2", "Optimized Title 3"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
        
        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });
        
        let text = "";
        if (chatResponse.message?.content) {
          text = typeof chatResponse.message.content === "string"
            ? chatResponse.message.content
            : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```html")) {
          text = text.replace(/^```html/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed);
        } else {
          throw new Error("Failed to parse array from response.");
        }
      } else {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "titles",
            title,
            content: prompt.trim() 
              ? `${textContext}\n\nCustom Instructions:\n${prompt.trim()}`
              : textContext,
            postType,
            engine,
            model,
            clientApiKey: (() => { try { const cfg = JSON.parse(localStorage.getItem("uipirate-ai-config") || "{}"); return engine === "gemini" ? cfg.geminiKey : cfg.openaiKey; } catch { return undefined; } })(),
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate titles.");
        }

        setSuggestions(data.data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (selectedTitle) {
      setTitle(selectedTitle);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
              : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              👑
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">AI Title Optimizer</h3>
              <p className="text-xs text-gray-400 font-geist">Generate high-impact headline recommendations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">AI Intelligence Engine</span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setEngine("openai")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-emerald-500 font-bold">●</span> OpenAI
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("gemini")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-blue-500 font-bold">✦</span> Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("puter")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-[#FF5B04] font-bold">⚡</span> Puter
                </button>
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">Model Version</span>
              </div>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
              >
                {engine === "openai" || engine === "puter" ? (
                  <>
                    <option value="gpt-5.5-pro">👑 GPT-5.5 Pro (State-of-the-Art)</option>
                    <option value="gpt-5.5">🔥 GPT-5.5 Standard (Advanced & Creative)</option>
                    <option value="gpt-5.4-pro">💎 GPT-5.4 Pro (High Precision)</option>
                    <option value="gpt-5.4">⚡ GPT-5.4 Standard (Balanced & Fast)</option>
                    <option value="gpt-4o">🔥 GPT-4o Premium (Advanced & Creative)</option>
                    <option value="gpt-4o-mini">🟢 GPT-4o Mini (Fast & Efficient)</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-flash-latest">⚡ Gemini 1.5 Flash (Super Fast)</option>
                    <option value="gemini-1.5-pro-latest">🧬 Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash (Next-Gen Preview)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Guidelines / Key Focus Words (Optional)
            </label>
            <input
              type="text"
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              placeholder="e.g. 'Make it sound casual', 'Focus on React performance'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin text-xs">🌀</span>
                  <span>Generating headlines...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Alternatives</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">{error}</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2.5">
              <label 
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                      ? "#3B82F6"
                      : "#FF5B04",
                }}
              >
                Select Your Favorite Headline
              </label>
              
              <div className="space-y-2">
                {suggestions.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTitle(t)}
                    className={`w-full text-left text-sm font-geist p-3.5 rounded-2xl transition-all border flex items-start gap-3 cursor-pointer ${
                      selectedTitle === t
                        ? engine === "openai"
                          ? "bg-emerald-50/50 border-emerald-500 text-emerald-950 font-medium shadow-sm"
                          : engine === "gemini"
                          ? "bg-indigo-50/50 border-indigo-500 text-indigo-950 font-medium shadow-sm"
                          : "bg-orange-50/50 border-[#FF5B04] text-orange-950 font-medium shadow-sm"
                        : "bg-gray-50 border-black/5 hover:border-black/10 text-gray-800"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold border transition-colors ${
                      selectedTitle === t
                        ? engine === "openai"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : engine === "gemini"
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-[#FF5B04] text-white border-[#FF5B04]"
                        : "bg-white border-black/10 text-gray-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-snug">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleApply}
            disabled={!selectedTitle || isGenerating}
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                  ? "#3B82F6"
                  : "#FF5B04",
            }}
          >
            <span>Apply Selected Headline</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Tags Modal ──────────────────────────────────────────────────────────
const AITagsModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
  tags,
  setTags,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
  tags: string[];
  setTags: (val: string[]) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<"openai" | "gemini" | "puter">(() => (loadAIConfig().defaultEngine ?? "puter") as "openai" | "gemini" | "puter");
  const [model, setModel] = useState<string>(() => loadAIConfig().defaultModel ?? "gpt-4o-mini");

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "openai" || engine === "puter") {
      if (!model.startsWith("gpt")) {
        setModel("gpt-5.5");
      }
    } else {
      setModel("gemini-flash-latest");
    }
  }, [engine, model]);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedTags([]);
      setSuggestions([]);
      setError("");
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textContext = plainText.trim().substring(0, 3000);

      if (engine === "puter") {
        let systemInstructions = `Suggest 5-8 highly relevant, lowercase, search-optimized tags / keywords for a post with the title: "${postTitle || ""}", category: "${postType || "blog"}", and content: "${textContext}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["tech", "javascript", "react"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
        
        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });
        
        let text = "";
        if (chatResponse.message?.content) {
          text = typeof chatResponse.message.content === "string"
            ? chatResponse.message.content
            : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```html")) {
          text = text.replace(/^```html/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed.map(t => t.toLowerCase()));
          setSelectedTags(parsed.map(t => t.toLowerCase()));
        } else {
          throw new Error("Failed to parse array from response.");
        }
      } else {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "tags",
            title: postTitle,
            content: prompt.trim() 
              ? `${textContext}\n\nCustom Instructions:\n${prompt.trim()}`
              : textContext,
            postType,
            engine,
            model,
            clientApiKey: (() => { try { const cfg = JSON.parse(localStorage.getItem("uipirate-ai-config") || "{}"); return engine === "gemini" ? cfg.geminiKey : cfg.openaiKey; } catch { return undefined; } })(),
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate tags.");
        }

        const parsedTags = data.data.map((t: string) => t.toLowerCase());
        setSuggestions(parsedTags);
        setSelectedTags(parsedTags);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleApply = () => {
    const combined = Array.from(new Set([...tags, ...selectedTags]));
    setTags(combined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
              : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              🏷️
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">AI Tag Suggestor</h3>
              <p className="text-xs text-gray-400 font-geist">Generate optimized tags and taxonomies</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">AI Intelligence Engine</span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setEngine("openai")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-950"
                  }`}
                >
                  <span className="text-emerald-500 font-bold">●</span> OpenAI
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("gemini")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-955"
                  }`}
                >
                  <span className="text-blue-500 font-bold">✦</span> Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("puter")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-955"
                  }`}
                >
                  <span className="text-[#FF5B04] font-bold">⚡</span> Puter
                </button>
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">Model Version</span>
              </div>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
              >
                {engine === "openai" || engine === "puter" ? (
                  <>
                    <option value="gpt-5.5-pro">👑 GPT-5.5 Pro (State-of-the-Art)</option>
                    <option value="gpt-5.5">🔥 GPT-5.5 Standard (Advanced & Creative)</option>
                    <option value="gpt-5.4-pro">💎 GPT-5.4 Pro (High Precision)</option>
                    <option value="gpt-5.4">⚡ GPT-5.4 Standard (Balanced & Fast)</option>
                    <option value="gpt-4o">🔥 GPT-4o Premium (Advanced & Creative)</option>
                    <option value="gpt-4o-mini">🟢 GPT-4o Mini (Fast & Efficient)</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-flash-latest">⚡ Gemini 1.5 Flash (Super Fast)</option>
                    <option value="gemini-1.5-pro-latest">🧬 Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash (Next-Gen Preview)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Tag Guidelines (Optional)
            </label>
            <input
              type="text"
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              placeholder="e.g. 'Use web development tags', 'Include SEO'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin text-xs">🌀</span>
                  <span>Generating tags...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Tags</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">{error}</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2.5">
              <label 
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                      ? "#3B82F6"
                      : "#FF5B04",
                }}
              >
                Select Tags to Apply
              </label>
              
              <div className="flex flex-wrap gap-2.5">
                {suggestions.map((t, idx) => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`px-4 py-2 rounded-2xl text-xs font-semibold font-geist border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? engine === "openai"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                            : engine === "gemini"
                            ? "bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm"
                            : "bg-orange-50 border-orange-300 text-orange-800 shadow-sm"
                          : "bg-gray-50 border-black/5 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[9px] border transition-colors ${
                        isSelected
                          ? engine === "openai"
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : engine === "gemini"
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-[#FF5B04] text-white border-[#FF5B04]"
                          : "bg-white border-black/10"
                      }`}>
                        {isSelected && "✓"}
                      </span>
                      <span>#{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleApply}
            disabled={selectedTags.length === 0 || isGenerating}
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                  ? "#3B82F6"
                  : "#FF5B04",
            }}
          >
            <span>Apply Selected Tags</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Copilot Modal ────────────────────────────────────────────────────────
const AICopilotModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
}) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<"openai" | "gemini" | "puter">(() => (loadAIConfig().defaultEngine ?? "puter") as "openai" | "gemini" | "puter");
  const [model, setModel] = useState<string>(() => loadAIConfig().defaultModel ?? "gpt-4o-mini");

  // Selection & Context states
  const [selectedText, setSelectedText] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{ from: number; to: number } | null>(null);

  useEffect(() => {
    if (isOpen && editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, " ");
      if (text.trim()) {
        setSelectedText(text.trim());
        setHasSelection(true);
        setSelectionRange({ from, to });
      } else {
        setSelectedText("");
        setHasSelection(false);
        setSelectionRange(null);
      }
    }
  }, [isOpen, editor]);

  useEffect(() => {
    if (engine === "openai" || engine === "puter") {
      if (!model.startsWith("gpt")) {
        setModel("gpt-5.5");
      }
    } else {
      setModel("gemini-flash-latest");
    }
  }, [engine]);

  const presets = [
    { label: "Draft Introduction", prompt: "Write a high-converting, engaging introduction paragraph based on the post title and details." },
    { label: "Step-by-Step Outline", prompt: "Generate a detailed, step-by-step structure/outline with subheadings." },
    { label: "Make Professional", prompt: "Summarize the key ideas and rewrite them in a highly polished, professional tone." },
    { label: "Write Key Takeaways", prompt: "Create a visual checklist of the top 5 key takeaways or learnings." },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setResult("");

    try {
      const editorContent = editor ? editor.getHTML() : "";
      const surroundingText = editor ? editor.getText() : "";
      const surroundingContext = surroundingText.length > 2000
        ? surroundingText.slice(-2000)
        : surroundingText;

      if (engine === "puter") {
        let contextInfo = "";
        if (hasSelection && selectedText) {
          contextInfo += `\n\nTARGET TEXT FOR EDITING (Rewrite, expand, improve, or format this selected text directly based on the user prompt): "${selectedText}"`;
        }
        if (surroundingContext.trim()) {
          contextInfo += `\n\nSURROUNDING BLOG CONTEXT (Ensure your generated section matches this writing style, tone, and flow perfectly, without repeating existing paragraphs): \n... ${surroundingContext.trim()}`;
        }

        const systemInstructions = `You are a world-class professional copywriter and technical content author. The user wants you to write content based on the following prompt: "${activePrompt}". The context of the post is: title: "${postTitle || ""}", category: "${postType || "blog"}".${contextInfo}
Write a comprehensive, fully detailed, and substantial piece of content. Expand on the concepts deeply with rich explanations, multiple robust and fully-fleshed out paragraphs, structured subheadings, and thorough insights (aim for at least 300 to 600 words or a complete, deep-dive section, unless the prompt explicitly requests a short summary or brief answer). Output in standard clean HTML format (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> as appropriate). Do NOT use markdown. Do NOT use <html>, <head>, or <body> tags. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });
        
        let text = "";
        if (chatResponse.message?.content) {
          text = typeof chatResponse.message.content === "string"
            ? chatResponse.message.content
            : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```html")) {
          text = text.replace(/^```html/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        setResult(text);
      } else {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "write",
            title: postTitle,
            content: editorContent,
            selectedText: hasSelection ? selectedText : "",
            surroundingContext: surroundingContext,
            postType,
            prompt: activePrompt,
            engine,
            model,
            clientApiKey: (() => { try { const cfg = JSON.parse(localStorage.getItem("uipirate-ai-config") || "{}"); return engine === "gemini" ? cfg.geminiKey : cfg.openaiKey; } catch { return undefined; } })(),
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate content.");
        }

        setResult(data.data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (result && editor) {
      if (hasSelection && selectionRange) {
        editor
          .chain()
          .focus()
          .setTextSelection(selectionRange)
          .insertContent(result)
          .run();
      } else {
        editor.chain().focus().insertContent(result).run();
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[640px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
              : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        {/* Header with beautiful gradient badge */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                    ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              ✨
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">AI Writing Copilot</h3>
              <p className="text-xs text-gray-400 font-geist">Generate structures, intros, and polished sections instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Engine & Model Selector */}
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            {/* Engine selector */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">AI Intelligence Engine</span>
                <span className="text-[10px] text-gray-400 font-geist">Select the AI brain for composition</span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  onClick={() => setEngine("openai")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-emerald-500 font-bold">●</span> OpenAI
                </button>
                <button
                  onClick={() => setEngine("gemini")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-blue-500 font-bold">✦</span> Gemini
                </button>
                <button
                  onClick={() => setEngine("puter")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="text-[#FF5B04] font-bold">⚡</span> Puter
                </button>
              </div>
            </div>

            {/* Separator line */}
            <div className="h-px bg-black/5" />

            {/* Model selector */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">Model Version</span>
                <span className="text-[10px] text-gray-400 font-geist">Choose the specific model capability</span>
              </div>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm animate-in fade-in duration-200"
              >
                {engine === "openai" || engine === "puter" ? (
                  <>
                    <option value="gpt-5.5-pro">👑 GPT-5.5 Pro (State-of-the-Art)</option>
                    <option value="gpt-5.5">🔥 GPT-5.5 Standard (Advanced & Creative)</option>
                    <option value="gpt-5.4-pro">💎 GPT-5.4 Pro (High Precision)</option>
                    <option value="gpt-5.4">⚡ GPT-5.4 Standard (Balanced & Fast)</option>
                    <option value="gpt-5.4-mini">🟢 GPT-5.4 Mini (Lightweight & Efficient)</option>
                    <option value="gpt-5.4-nano">🌱 GPT-5.4 Nano (Super Speed)</option>
                    <option value="gpt-5.3-chat">💬 GPT-5.3 Chat (Conversational)</option>
                    <option value="gpt-5.3-codex">💻 GPT-5.3 Codex (Programming & Logic)</option>
                    <option value="gpt-5.2-pro">💎 GPT-5.2 Pro (Professional)</option>
                    <option value="gpt-5.2-chat">💬 GPT-5.2 Chat (Standard Chat)</option>
                    <option value="gpt-5.2">⚡ GPT-5.2 Standard (General)</option>
                    <option value="gpt-5.1-chat-latest">💬 GPT-5.1 Chat (Legacy Chat)</option>
                    <option value="gpt-5.1">⚡ GPT-5.1 Standard (Legacy General)</option>
                    <option value="gpt-4o">🔥 GPT-4o Premium (Advanced & Creative)</option>
                    <option value="gpt-4o-mini">🟢 GPT-4o Mini (Fast & Efficient)</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-flash-latest">⚡ Gemini 1.5 Flash (Super Fast)</option>
                    <option value="gemini-1.5-pro-latest">🧬 Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash (Next-Gen Preview)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider mb-2 block">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  disabled={isGenerating}
                  className="text-left text-xs font-geist font-medium text-gray-700 bg-black/[0.02] border border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/30 p-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Instructions
            </label>
            {hasSelection && (
              <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-geist mb-3 border transition-all duration-300 ${
                engine === "openai"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : engine === "gemini"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                  : "bg-orange-50 border-orange-200 text-orange-800"
              }`}>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    engine === "openai"
                      ? "bg-emerald-400"
                      : engine === "gemini"
                      ? "bg-indigo-400"
                      : "bg-orange-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    engine === "openai"
                      ? "bg-emerald-500"
                      : engine === "gemini"
                      ? "bg-indigo-500"
                      : "bg-orange-500"
                  }`}></span>
                </span>
                <span>
                  <strong>Selection Active:</strong> AI will rewrite and refine your highlighted text (<strong>{selectedText.length} characters</strong>).
                </span>
              </div>
            )}
            <textarea
              autoFocus
              rows={3}
              className="w-full text-sm font-geist bg-black/5 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 resize-none transition-all"
              placeholder="Provide details of what you want to write or refine (e.g., 'Draft a highly engaging 3-paragraph introduction detailing the benefits of modern responsive design...')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                style={{
                  background:
                    engine === "openai"
                      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                      : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
                }}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin text-xs">🌀</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨ {hasSelection ? "Refine Selection" : "Compose Segment"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Generation Preview Area */}
          {(isGenerating || result) && (
            <div className="space-y-2">
              <label 
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                      ? "#3B82F6"
                      : "#FF5B04",
                }}
              >
                AI Composition Preview
              </label>
              <div 
                className={`border rounded-2xl p-4 bg-gray-50/50 min-h-[140px] text-sm overflow-y-auto max-h-[260px] font-geist prose prose-sm transition-all duration-300 ${
                  isGenerating
                    ? engine === "openai"
                      ? "animate-pulse border-emerald-200"
                      : engine === "gemini"
                      ? "animate-pulse border-blue-200"
                      : "animate-pulse border-orange-200"
                    : "border-black/5"
                }`}
              >
                {isGenerating ? (
                  <div className="space-y-2.5">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: result }} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {result && !isGenerating && (
          <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
            <button
              onClick={handleInsert}
              className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                background:
                  engine === "openai"
                    ? "#10B981"
                    : engine === "gemini"
                    ? "#3B82F6"
                    : "#FF5B04",
              }}
            >
              <span>{hasSelection ? "Replace Highlighted Text" : "Insert at Cursor Position"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Floating Block Inserter (Medium-style) ───────────────────────────────────
const FloatingBlockInserter = ({
  editor,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
}: {
  editor: any;
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
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
        return { visible: true, top: coords.top };
      } catch {
        return { visible: false, top: 0 };
      }
    },
  });

  const visible = editorState?.visible ?? false;
  const top = editorState?.top ?? 0;

  // Auto-close expanded toolbar when cursor leaves empty line
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!visible) return null;

  const blockItems = [
    {
      id: "upload-image",
      label: "Upload Image",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6" strokeOpacity="0.3"/><line x1="3" y1="18" x2="21" y2="18" strokeOpacity="0.3"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] flex items-center gap-1"
      style={{
        top: top - 14,
        left: "max(16px, calc(50% - 420px))",
        transform: "translateX(-48px)",
      }}
    >
      {/* + Button */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 select-none"
        style={{
          border: "1.5px solid rgba(0,0,0,0.15)",
          background: open ? "#FF5B04" : "#fff",
          color: open ? "#fff" : "#9ca3af",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        title="Add block"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Expanded block toolbar */}
      {open && (
        <div
          className="flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            animation: "fadeSlideIn 0.15s ease",
          }}
        >
          {blockItems.map((item) => (
            <button
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault();
                item.action();
              }}
              title={item.label}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 transition-all duration-150"
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

// ─── Slash Command Menu ───────────────────────────────────────────────────────
const SlashCommandMenu = ({
  editor,
  isOpen,
  onClose,
  position,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
}: {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const commands = React.useMemo(
    () => [
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
      },
      {
        title: "Divider",
        icon: "—",
        desc: "Add a horizontal rule",
        command: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        title: "Image Upload",
        icon: "🖼",
        desc: "Upload an image from disk",
        command: () => {
          imageUploadRef.current?.click();
        },
      },
      {
        title: "Image URL",
        icon: "🔗",
        desc: "Embed an image via URL",
        command: onImageUrl,
      },
      {
        title: "Embed Video",
        icon: "▶",
        desc: "YouTube, Vimeo, Loom…",
        command: onVideoEmbed,
      },
      {
        title: "Table",
        icon: "田",
        desc: "Insert a 3x3 table",
        command: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
    ],
    [editor, onImageUrl, onVideoEmbed, imageUploadRef]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[150] rounded-2xl shadow-2xl py-2 min-w-[260px] max-h-[380px] overflow-y-auto"
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
          <span className="text-xs font-bold font-jetbrains-mono text-gray-400 w-7 text-center flex-shrink-0">
            {command.icon}
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

// ─── Formatting Toolbar (top) ─────────────────────────────────────────────────
const FormattingToolbar = ({
  editor,
  onLinkClick,
  onCopilotClick,
}: {
  editor: any;
  onLinkClick: () => void;
  onCopilotClick: () => void;
}) => {
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);
  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg transition-all font-semibold text-sm font-geist ${
      active ? "text-white" : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
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
      className="sticky z-40 backdrop-blur-md py-2 px-4 flex items-center gap-0.5 flex-wrap"
      style={{
        top: "61px",
        background: "rgba(247,247,246,0.96)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={onCopilotClick}
        className="mr-2 px-3 py-1.5 rounded-lg text-white font-semibold text-sm font-geist transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow flex items-center gap-1 cursor-pointer relative overflow-hidden group animate-pulse"
        style={{
          background: "linear-gradient(135deg, #FF5B04 0%, #D946EF 100%)",
        }}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span>✨ AI Copilot</span>
      </button>
      {sep}
      <button className={btn(editor.isActive("bold"))} style={editor.isActive("bold") ? activeStyle : {}} title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button className={btn(editor.isActive("italic"))} style={editor.isActive("italic") ? activeStyle : {}} title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
      <button className={btn(editor.isActive("strike"))} style={editor.isActive("strike") ? activeStyle : {}} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
      <button className={btn(editor.isActive("code"))} style={editor.isActive("code") ? activeStyle : {}} title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}>{"<>"}</button>
      <button className={btn(editor.isActive("highlight"))} style={editor.isActive("highlight") ? activeStyle : {}} title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()}>Mk</button>
      
      {/* Sleek Text Color Menu */}
      <div className="relative flex items-center">
        <button
          className={btn(colorPaletteOpen)}
          style={colorPaletteOpen ? activeStyle : {}}
          title="Text Color"
          onClick={() => setColorPaletteOpen(!colorPaletteOpen)}
        >
          <span className="flex items-center gap-1">
            A<span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#1A1A1A" }} />
          </span>
        </button>
        {colorPaletteOpen && (
          <div className="absolute top-full left-0 mt-1 flex items-center gap-1.5 bg-white border border-black/10 shadow-lg rounded-xl p-2 z-50 animate-in fade-in duration-100">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  editor.chain().focus().setColor(c.value).run();
                  setColorPaletteOpen(false);
                }}
                className="w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-125 cursor-pointer"
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setColorPaletteOpen(false);
              }}
              className="text-[10px] font-geist px-1.5 py-0.5 bg-black/5 hover:bg-black/10 rounded-md border border-black/10 text-gray-500 hover:text-black transition-colors cursor-pointer"
              title="Reset Color"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <button
        className={btn(editor.isActive("link"))}
        style={editor.isActive("link") ? activeStyle : {}}
        title="Insert Link (Ctrl+K)"
        onClick={onLinkClick}
      >
        🔗 Link
      </button>
      {editor.isActive("link") && (
        <button
          className={btn(false)}
          title="Remove Link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink 🔓
        </button>
      )}

      {sep}
      <button className={btn(editor.isActive("heading", { level: 1 }))} style={editor.isActive("heading", { level: 1 }) ? activeStyle : {}} title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button className={btn(editor.isActive("heading", { level: 2 }))} style={editor.isActive("heading", { level: 2 }) ? activeStyle : {}} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button className={btn(editor.isActive("heading", { level: 3 }))} style={editor.isActive("heading", { level: 3 }) ? activeStyle : {}} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      {sep}
      <button className={btn(editor.isActive("bulletList"))} style={editor.isActive("bulletList") ? activeStyle : {}} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button className={btn(editor.isActive("orderedList"))} style={editor.isActive("orderedList") ? activeStyle : {}} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button className={btn(editor.isActive("blockquote"))} style={editor.isActive("blockquote") ? activeStyle : {}} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo; Quote</button>
      <button className={btn(editor.isActive("codeBlock"))} style={editor.isActive("codeBlock") ? activeStyle : {}} title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
      {sep}
      <button className={btn(false)} title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</button>
      {editor.isActive("table") && (
        <>
          {sep}
          <div className="flex items-center gap-1 bg-orange-50/60 border border-orange-100 rounded-xl px-2 py-0.5">
            <span className="text-[10px] font-bold font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider mr-1">Table Controls:</span>
            
            <button className={btn(false)} title="Add Row Above" onClick={() => editor.chain().focus().addRowBefore().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Row ↑</span>
            </button>
            
            <button className={btn(false)} title="Add Row Below" onClick={() => editor.chain().focus().addRowAfter().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Row ↓</span>
            </button>
            
            <button className={btn(false)} title="Delete Row" onClick={() => editor.chain().focus().deleteRow().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Row</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button className={btn(false)} title="Add Column Before" onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Col ←</span>
            </button>
            
            <button className={btn(false)} title="Add Column After" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Col →</span>
            </button>
            
            <button className={btn(false)} title="Delete Column" onClick={() => editor.chain().focus().deleteColumn().run()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
              <span className="text-[10px] ml-1">Col</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button className={btn(false)} title="Toggle Header Row" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
              <span className="text-[10px]">H-Row</span>
            </button>

            <button className={btn(false)} title="Toggle Header Column" onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
              <span className="text-[10px]">H-Col</span>
            </button>

            <button className={btn(false)} title="Delete Table" style={{ color: "#dc2626" }} onClick={() => editor.chain().focus().deleteTable().run()}>
              <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span className="text-[10px] ml-1">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BlogEditor = () => {
  const [mounted, setMounted] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [excerpt, setExcerpt] = useState("");

  // AI States
  const [isExcerptModalOpen, setIsExcerptModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // AI API Handlers
  const [featuredImage, setFeaturedImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [postType, setPostType] = useState<"blog" | "tutorial" | "case-study" | "community-insight">("blog");
  const [typeSelected, setTypeSelected] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error"
  >("Draft");
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState<"draft" | "publish" | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineImageUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { isLoading: authLoading } = useAuth(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Heading";
          return "Type '/' for commands or click + to add a block…";
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] px-8 py-6",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "/") {
            const { selection } = view.state;
            const { $from } = selection;
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
            if (textBefore === "" || textBefore.endsWith(" ")) {
              setTimeout(() => {
                const coords = view.coordsAtPos(selection.from);
                setSlashMenuPosition({
                  top: coords.bottom + window.scrollY,
                  left: coords.left + window.scrollX,
                });
                setSlashMenuOpen(true);
              }, 0);
            }
          } else if (event.key === "Escape" && slashMenuOpen) {
            setSlashMenuOpen(false);
            return true;
          }
          return false;
        },
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                const node = schema.nodes.image.create({ src: url });
                view.dispatch(view.state.tr.insert(coordinates.pos, node));
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const url = e.target?.result as string;
                  editor?.chain().focus().setImage({ src: url }).run();
                };
                reader.readAsDataURL(file);
              }
              return true;
            }
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  // Real-time analytics counter hook
  const editorStats = useEditorState({
    editor,
    selector: (ctx: any) => {
      if (!ctx.editor) return { words: 0, characters: 0, paragraphs: 0, readTime: 1 };
      const text = ctx.editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const readTime = Math.ceil(words / 200) || 1;
      let paragraphs = 0;
      ctx.editor.state.doc.descendants((node: any) => {
        if (node.type.name === "paragraph") {
          paragraphs++;
        }
      });
      return { words, characters, paragraphs, readTime };
    },
  }) || { words: 0, characters: 0, paragraphs: 0, readTime: 1 };

  // Inline image upload handler (from the + toolbar)
  const handleInlineImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
      // Reset so same file can be re-selected
      event.target.value = "";
    },
    [editor]
  );

  const handleBannerImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setFeaturedImage(url);
          setBannerImage(url);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const saveBlog = async (published: boolean) => {
    setIsSaving(true);
    setSaveStatus(published ? "Publishing…" : "Saving…");
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: editor?.getHTML() || "",
          excerpt,
          featuredImage,
          bannerImage,
          tags,
          published,
          postType,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save blog");
      setSaveStatus(published ? "Published" : "Saved");
      setModalSuccess(published ? "publish" : "draft");
      
      // Auto-redirect to dashboard after 3 seconds, but user can also click immediately
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 3000);
    } catch (error: any) {
      setSaveStatus("Error");
      setShowPublishModal(false);
      setShowSaveModal(false);
      setValidationError(error.message || "Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = useCallback(() => {
    if (!title.trim()) {
      setValidationError("Please enter a title for your blog post.");
      return;
    }
    if (!editor || editor.isEmpty) {
      setValidationError("Please add some content to your blog post.");
      return;
    }
    setShowSaveModal(true);
  }, [title, editor]);

  const handlePublish = useCallback(() => {
    if (!title.trim()) {
      setValidationError("Please enter a title for your blog post.");
      return;
    }
    if (!editor || editor.isEmpty) {
      setValidationError("Please add some content to your blog post.");
      return;
    }
    setShowPublishModal(true);
  }, [title, editor]);

  if (!mounted || !editor || authLoading) return null;

  // ── Post Type definitions (shared between modal and badge) ──
  const postTypes = [
    {
      value: "blog" as const,
      label: "Blog",
      description: "Share thoughts, insights and perspectives",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
    },
    {
      value: "tutorial" as const,
      label: "Tutorial",
      description: "Step-by-step guides and how-tos",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      value: "case-study" as const,
      label: "Case Study",
      description: "In-depth analysis of a project or problem",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      value: "community-insight" as const,
      label: "Community Insight",
      description: "Trends, observations and community highlights",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
  ];

  const selectedTypeInfo = postTypes.find((t) => t.value === postType)!;

  // ── Type selection gate ──
  if (!typeSelected) {
    return (
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-[520px] max-w-[95vw] p-8"
          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        >
          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest font-semibold mb-1" style={{ color: "#FF5B04" }}>New Post</p>
            <h2 className="text-xl font-bold font-geist text-gray-900">What are you creating?</h2>
            <p className="text-sm text-gray-400 font-geist mt-1">Choose a post type. This can't be changed after you start writing.</p>
          </div>

          {/* Type grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {postTypes.map(({ value, label, description, icon }) => (
              <button
                key={value}
                onClick={() => setPostType(value)}
                className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                  postType === value
                    ? "border-[#FF5B04] bg-orange-50"
                    : "border-black/8 bg-black/[0.01] hover:border-[#FF5B04]/40 hover:bg-orange-50/40"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    background: postType === value ? "rgba(255,91,4,0.12)" : "rgba(0,0,0,0.05)",
                    color: postType === value ? "#FF5B04" : "#6b7280",
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold font-geist ${ postType === value ? "text-[#FF5B04]" : "text-gray-800"}`}>{label}</p>
                  <p className="text-[11px] text-gray-400 font-geist mt-0.5 leading-snug">{description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a href="/admin/blogs" className="text-sm font-geist text-gray-400 hover:text-gray-600 transition-colors">
              Cancel
            </a>
            <button
              onClick={() => setTypeSelected(true)}
              className="ml-auto flex items-center gap-2 text-sm font-semibold font-geist text-white h-10 px-6 rounded-xl transition-colors"
              style={{ background: "#FF5B04" }}
            >
              Continue as {selectedTypeInfo.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");
      if (t && !tags.includes(t)) setTags([...tags, t]);
      setTagInput("");
    }
  };

  const statusColor: Record<string, string> = {
    Draft: "#6b7280",
    "Saving…": "#FF5B04",
    "Publishing…": "#FF5B04",
    Saved: "#16a34a",
    Published: "#16a34a",
    Error: "#dc2626",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F6" }}>
      {/* ── Top Bar ── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(247,247,246,0.95)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <a
            href="/admin/blogs"
            className="flex items-center gap-1.5 text-xs font-geist text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Posts
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium font-geist text-gray-900">New Post</span>
          {/* Locked type badge */}
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold font-jetbrains-mono px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: "rgba(255,91,4,0.10)", color: "#FF5B04" }}
            title="Post type is locked for this draft"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {selectedTypeInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-geist font-medium transition-colors"
            style={{ color: statusColor[saveStatus] ?? "#6b7280" }}
          >
            {saveStatus}
          </span>
          <Button
            variant="flat"
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="font-geist text-sm h-9 px-4 rounded-xl bg-black/5 text-gray-700 font-medium"
          >
            Save Draft
          </Button>
          <Button
            disabled={isSaving}
            isLoading={isSaving}
            onClick={handlePublish}
            className="font-geist text-sm h-9 px-4 rounded-xl font-medium text-white"
            style={{ background: "#FF5B04" }}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* ── Formatting Toolbar ── */}
      <FormattingToolbar 
        editor={editor} 
        onLinkClick={() => { editor.chain().focus().extendMarkRange("link").run(); setShowLinkModal(true); }} 
        onCopilotClick={() => setIsCopilotOpen(true)}
      />

      {/* ── Two-column Layout ── */}
      <div className="flex gap-6 p-6 items-start">
        {/* Editor Column */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          {/* Banner image area */}
          {bannerImage ? (
            <div className="relative group">
              <img
                src={bannerImage}
                alt="Banner"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <button
                onClick={() => { setBannerImage(""); setFeaturedImage(""); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                ✕
              </button>
              <label className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-xs font-geist font-medium text-white bg-black/60 hover:bg-black/80 transition-colors px-3 py-1.5 rounded-lg">
                  Change Banner
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
              </label>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-10 pt-6 pb-2 cursor-pointer group w-fit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF5B04] transition-colors">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-xs font-geist text-gray-300 group-hover:text-[#FF5B04] transition-colors">
                Add cover image
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
            </label>
          )}

          {/* Title */}
          <div className={bannerImage ? "px-10 pt-6 pb-4 relative" : "px-10 pt-4 pb-4 relative"}>
            <div className="flex items-center gap-3">
              <input
                className="w-full text-4xl font-bold font-geist border-none outline-none bg-transparent text-gray-900 placeholder-gray-200 leading-tight"
                placeholder="Post title…"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setIsTitleModalOpen(true);
                }}
                className="flex-shrink-0 text-xs font-semibold font-geist px-3 py-1.5 rounded-xl border border-orange-100 hover:border-[#FF5B04] text-[#FF5B04] hover:bg-orange-50/50 transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-sm bg-white"
              >
                ✨ AI Assistant
              </button>
            </div>
          </div>

          <div className="h-px mx-10" style={{ background: "rgba(0,0,0,0.06)" }} />

          {/* Editor area */}
          <div ref={editorRef} className="relative px-2 py-4">
            {/* Floating Block Inserter */}
            <FloatingBlockInserter
              editor={editor}
              onImageUrl={() => setShowImageUrlModal(true)}
              onVideoEmbed={() => setShowVideoModal(true)}
              imageUploadRef={inlineImageUploadRef}
            />

            {/* Hidden file input for inline image upload */}
            <input
              ref={inlineImageUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInlineImageUpload}
            />

            <div className="notion-editor-wrapper min-h-[520px]">
              <EditorContent editor={editor} />
            </div>

            <SlashCommandMenu
              editor={editor}
              isOpen={slashMenuOpen}
              position={slashMenuPosition}
              onClose={() => setSlashMenuOpen(false)}
              onImageUrl={() => { setSlashMenuOpen(false); setShowImageUrlModal(true); }}
              onVideoEmbed={() => { setSlashMenuOpen(false); setShowVideoModal(true); }}
              imageUploadRef={inlineImageUploadRef}
            />
          </div>
        </div>

        {/* ── Settings Sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Analytics Card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
              Analytics
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                <div className="text-2xl font-bold font-geist text-gray-900">{editorStats.words}</div>
                <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">Words</div>
              </div>
              <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                <div className="text-2xl font-bold font-geist text-gray-900">{editorStats.characters}</div>
                <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">Characters</div>
              </div>
              <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                <div className="text-2xl font-bold font-geist text-gray-900">{editorStats.paragraphs}</div>
                <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">Paragraphs</div>
              </div>
              <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                <div className="text-2xl font-bold font-geist text-[#FF5B04]">{editorStats.readTime} min</div>
                <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">Read Time</div>
              </div>
            </div>
            
            {/* Writing Goal Progress */}
            <div className="mt-3.5 pt-3 border-t border-black/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-geist text-gray-500 font-medium">Writing Goal</span>
                <span className="text-[10px] font-jetbrains-mono text-gray-400 font-semibold">
                  {Math.min(100, Math.round((editorStats.words / 500) * 100))}% ({editorStats.words}/500 words)
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.min(100, (editorStats.words / 500) * 100)}%`,
                    background: "#FF5B04"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Excerpt card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                Excerpt
              </p>
              <button
                onClick={() => {
                  if (!editor || editor.isEmpty) {
                    setValidationError("Please write some content first so the AI can summarize it.");
                    return;
                  }
                  setIsExcerptModalOpen(true);
                }}
                className="text-[10px] font-geist font-semibold text-[#FF5B04] hover:text-[#d946ef] transition-colors flex items-center gap-1 cursor-pointer"
              >
                ✨ AI Assistant
              </button>
            </div>
            <textarea
              className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 placeholder-gray-300"
              style={{ minHeight: 80 }}
              placeholder="Short summary shown in blog listings…"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Tags card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                Tags
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsTagsModalOpen(true);
                }}
                className="text-[10px] font-geist font-semibold text-[#FF5B04] hover:text-[#d946ef] transition-colors flex items-center gap-1 cursor-pointer"
              >
                ✨ AI Assistant
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-geist px-2 py-0.5 rounded-full"
                  style={{ background: "#FFF0E8", color: "#FF5B04" }}
                >
                  {tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="opacity-60 hover:opacity-100 leading-none">✕</button>
                </span>
              ))}
            </div>
            <input
              className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none placeholder-gray-300"
              placeholder="Add tag, press Enter…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          {/* Quick insert card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
              Quick Insert
            </p>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleInlineImageUpload} />
              </label>
              <button
                onClick={() => setShowImageUrlModal(true)}
                className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Image from URL
              </button>
              <button
                onClick={() => setShowVideoModal(true)}
                className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                Embed video
              </button>
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                </svg>
                Add divider
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
                Code block
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        editor={editor}
        postTitle={title}
        postType={postType}
      />
      <AIExcerptModal
        isOpen={isExcerptModalOpen}
        onClose={() => setIsExcerptModalOpen(false)}
        editor={editor}
        postTitle={title}
        postType={postType}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
      />
      <AITitleModal
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        editor={editor}
        title={title}
        setTitle={setTitle}
        postType={postType}
      />
      <AITagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        editor={editor}
        postTitle={title}
        postType={postType}
        tags={tags}
        setTags={setTags}
      />
      {showImageUrlModal && (
        <ImageUrlModal
          editor={editor}
          onClose={() => setShowImageUrlModal(false)}
        />
      )}
      {showVideoModal && (
        <VideoEmbedModal
          editor={editor}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showLinkModal && (
        <LinkModal
          editor={editor}
          onClose={() => setShowLinkModal(false)}
        />
      )}

      {validationError && (
        <AlertModal
          title="Attention Required"
          message={validationError}
          onClose={() => setValidationError(null)}
        />
      )}

      <PublishConfirmModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={() => saveBlog(true)}
        isSaving={isSaving}
        blogData={{ title, bannerImage, excerpt, tags }}
        isSuccess={modalSuccess === "publish"}
        onViewBlogs={() => router.push("/admin/blogs")}
        onKeepEditing={() => {
          setShowPublishModal(false);
          setModalSuccess(null);
        }}
      />

      <SaveDraftModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={() => saveBlog(false)}
        isSaving={isSaving}
        blogData={{ title, excerpt }}
        isSuccess={modalSuccess === "draft"}
        onViewBlogs={() => router.push("/admin/blogs")}
        onKeepEditing={() => {
          setShowSaveModal(false);
          setModalSuccess(null);
        }}
      />

      {/* ── Styles ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .notion-editor-wrapper .ProseMirror {
          position: relative;
          outline: none;
          min-height: 500px;
        }

        .notion-editor-wrapper .ProseMirror > * {
          position: relative;
          margin-bottom: 0.25rem;
        }

        .notion-editor-wrapper .ProseMirror > *:hover {
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }

        .notion-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .notion-editor-wrapper .ProseMirror p {
          line-height: 1.75;
          font-size: 1rem;
          color: #374151;
          margin: 0.5rem 0;
        }

        .notion-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .notion-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 2px solid rgba(0,0,0,0.08);
          margin: 2rem 0;
          border-radius: 4px;
        }

        .notion-editor-wrapper .ProseMirror ul,
        .notion-editor-wrapper .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .notion-editor-wrapper .ProseMirror li {
          margin: 0.5rem 0;
          line-height: 1.75;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-top: 0.25rem;
          user-select: none;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label input {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }

        .notion-editor-wrapper .ProseMirror blockquote {
          border-left: 3px solid #FF5B04;
          padding-left: 1.25rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: #6b7280;
          font-style: italic;
          margin: 1.5rem 0;
          background-color: rgba(255, 91, 4, 0.04);
          border-radius: 0 8px 8px 0;
        }

        .notion-editor-wrapper .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.9em;
          font-family: "Fira Code", monospace;
          color: #e11d48;
        }

        .notion-editor-wrapper .ProseMirror pre {
          background-color: #1e293b;
          color: #f1f5f9;
          border-radius: 12px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #334155;
        }

        .notion-editor-wrapper .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .notion-editor-wrapper .ProseMirror mark {
          background-color: #fef3c7;
          border-radius: 3px;
          padding: 0.125rem 0.25rem;
        }

        .notion-editor-wrapper .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          line-height: 1.2;
        }

        .notion-editor-wrapper .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .notion-editor-wrapper .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.4;
        }

        /* Video embed styles */
        .video-embed-wrapper {
          margin: 1.5rem 0;
        }

        .video-embed-ratio {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        .video-embed-ratio iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }

        /* Table Styles inside Editor */
        .notion-editor-wrapper .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
        }
        .notion-editor-wrapper .ProseMirror td,
        .notion-editor-wrapper .ProseMirror th {
          min-width: 1em;
          border: 1px solid #e5e5e5;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .notion-editor-wrapper .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f5f5f5;
        }
        .notion-editor-wrapper .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(255, 91, 4, 0.08);
          pointer-events: none;
        }
        .notion-editor-wrapper .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #FF5B04;
          pointer-events: none;
        }

        /* Smooth transitions */
        .notion-editor-wrapper .ProseMirror * {
          transition: background-color 0.15s ease;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;

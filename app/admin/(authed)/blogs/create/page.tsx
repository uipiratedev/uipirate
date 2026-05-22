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
            <p className="text-sm font-geist text-gray-500 mb-6">Your blog post has been successfully published and is now live.</p>
            <div className="flex gap-3">
              <button
                onClick={onViewBlogs}
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#FF5B04" }}
              >
                Go to Blog List
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
                Go to Blog List
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
}: {
  editor: any;
  onLinkClick: () => void;
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
  const [featuredImage, setFeaturedImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
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
            Blogs
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium font-geist text-gray-900">New Post</span>
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
      <FormattingToolbar editor={editor} onLinkClick={() => { editor.chain().focus().extendMarkRange("link").run(); setShowLinkModal(true); }} />

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
          <div className={bannerImage ? "px-10 pt-6 pb-4" : "px-10 pt-4 pb-4"}>
            <input
              className="w-full text-4xl font-bold font-geist border-none outline-none bg-transparent text-gray-900 placeholder-gray-200 leading-tight"
              placeholder="Post title…"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
          {/* Publish card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
              Publish
            </p>
            <div className="space-y-2">
              <Button
                className="w-full font-geist font-medium text-white text-sm h-10 rounded-xl"
                style={{ background: "#FF5B04" }}
                disabled={isSaving}
                isLoading={isSaving}
                onClick={handlePublish}
              >
                Publish Now
              </Button>
              <Button
                variant="flat"
                className="w-full font-geist font-medium text-sm h-10 rounded-xl bg-black/5 text-gray-600"
                disabled={isSaving}
                onClick={handleSaveDraft}
              >
                Save as Draft
              </Button>
            </div>
          </div>

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
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
              Excerpt
            </p>
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
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
              Tags
            </p>
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

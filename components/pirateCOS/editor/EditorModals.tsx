import React, { useState, useEffect } from "react";

// ─── Shared Base Modal Component ──────────────────────────────────────────────
export const Modal = ({
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
        <p className="text-sm font-semibold font-geist text-gray-800">
          {title}
        </p>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          onClick={onClose}
        >
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Image URL Modal ─────────────────────────────────────────────────────────
export const ImageUrlModal = ({
  editor,
  onClose,
  setIsDirty,
}: {
  editor: any;
  onClose: () => void;
  setIsDirty?: (dirty: boolean) => void;
}) => {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const insert = () => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .setImage({ src: url.trim(), alt: alt.trim() || undefined })
        .run();
      if (setIsDirty) setIsDirty(true);
      onClose();
    }
  };

  return (
    <Modal title="Insert Image from URL" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Image URL *
          </label>
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
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Alt text (optional)
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Describe the image…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Insert Image
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Video Embed Modal ────────────────────────────────────────────────────────
export const VideoEmbedModal = ({
  editor,
  onClose,
  setIsDirty,
}: {
  editor: any;
  onClose: () => void;
  setIsDirty?: (dirty: boolean) => void;
}) => {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const getEmbedUrl = (raw: string): string | null => {
    // YouTube
    const ytMatch = raw.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
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
      editor
        .chain()
        .focus()
        .insertContent({
          type: "videoEmbed",
          attrs: {
            src: embedUrl,
            caption: caption || null,
          },
        })
        .run();
      if (setIsDirty) setIsDirty(true);
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
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Caption (optional)
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Add a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Embed Video
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Link Modal ──────────────────────────────────────────────────────────────
export const LinkModal = ({
  editor,
  onClose,
  setIsDirty,
}: {
  editor: any;
  onClose: () => void;
  setIsDirty?: (dirty: boolean) => void;
}) => {
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [ctaType, setCtaType] = useState<"none" | "primary" | "secondary">(
    "none",
  );

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
          .insertContent(
            `<a href="${trimmedUrl}" class="blog-cta-btn">${trimmedText}</a> `,
          )
          .run();
      } else if (ctaType === "secondary") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${trimmedUrl}" class="blog-cta-btn-secondary">${trimmedText}</a> `,
          )
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${trimmedUrl}">${trimmedText}</a>`)
          .run();
      }
      if (setIsDirty) setIsDirty(true);
      onClose();
    }
  };

  return (
    <Modal title="Insert or Edit Link" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Link Text *
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Text to display…"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Link URL *
          </label>
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
          <label className="text-xs font-geist text-gray-500 block">
            Link Style / Call to Action
          </label>
          <div className="flex gap-2">
            {[
              { id: "none", label: "Default Link" },
              { id: "primary", label: "Primary CTA" },
              { id: "secondary", label: "Secondary CTA" },
            ].map((opt) => (
              <button
                key={opt.id}
                className={`flex-1 py-2 rounded-xl text-xs font-geist font-semibold transition-all border ${
                  ctaType === opt.id
                    ? "bg-[#FF5B04]/5 text-[#FF5B04] border-[#FF5B04]"
                    : "bg-white text-gray-400 border-black/5 hover:bg-black/5 hover:text-gray-600"
                }`}
                onClick={() => setCtaType(opt.id as any)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-black/5">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Apply Link
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

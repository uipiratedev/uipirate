"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

// Slash command menu component
const SlashCommandMenu = ({
  editor,
  isOpen,
  onClose,
  position,
}: {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const commands = React.useMemo(
    () => [
      {
        title: "Heading 1",
        icon: "H1",
        command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Heading 2",
        icon: "H2",
        command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Heading 3",
        icon: "H3",
        command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bullet List",
        icon: "•",
        command: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        icon: "1.",
        command: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Task List",
        icon: "☑",
        command: () => editor.chain().focus().toggleTaskList().run(),
      },
      {
        title: "Quote",
        icon: '"',
        command: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code Block",
        icon: "</>",
        command: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: "Image",
        icon: "🖼",
        command: () => {
          const url = window.prompt("Enter image URL:");

          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        },
      },
    ],
    [editor],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 rounded-xl shadow-2xl py-1.5 min-w-[220px]"
      style={{
        top: `${position.top + 8}px`,
        left: `${position.left}px`,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <p className="px-3 py-1.5 text-[9px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest">
        Blocks
      </p>
      {commands.map((command, index) => (
        <button
          key={index}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-black/5 transition-colors text-left"
          onClick={() => { command.command(); onClose(); }}
        >
          <span className="text-xs font-bold font-jetbrains-mono text-gray-400 w-7 text-center">{command.icon}</span>
          <span className="text-sm font-medium font-geist text-gray-800">{command.title}</span>
        </button>
      ))}
    </div>
  );
};

// Formatting toolbar component
const FormattingToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg transition-all font-semibold text-sm font-geist ${
      active ? "text-white" : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
    }`;
  const activeStyle = { background: "#FF5B04" };
  const sep = <div className="w-px h-5 bg-black/10 mx-1" />;

  return (
    <div className="sticky top-0 z-40 backdrop-blur-md py-2 px-4 flex items-center gap-0.5 flex-wrap"
      style={{ background: "rgba(247,247,246,0.96)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <button className={btn(editor.isActive("bold"))} style={editor.isActive("bold") ? activeStyle : {}} title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button className={btn(editor.isActive("italic"))} style={editor.isActive("italic") ? activeStyle : {}} title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
      <button className={btn(editor.isActive("strike"))} style={editor.isActive("strike") ? activeStyle : {}} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
      <button className={btn(editor.isActive("code"))} style={editor.isActive("code") ? activeStyle : {}} title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}>{"<>"}</button>
      <button className={btn(editor.isActive("highlight"))} style={editor.isActive("highlight") ? activeStyle : {}} title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()}>Mk</button>
      {sep}
      <button className={btn(editor.isActive("heading", { level: 1 }))} style={editor.isActive("heading", { level: 1 }) ? activeStyle : {}} title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button className={btn(editor.isActive("heading", { level: 2 }))} style={editor.isActive("heading", { level: 2 }) ? activeStyle : {}} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button className={btn(editor.isActive("heading", { level: 3 }))} style={editor.isActive("heading", { level: 3 }) ? activeStyle : {}} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      {sep}
      <button className={btn(editor.isActive("bulletList"))} style={editor.isActive("bulletList") ? activeStyle : {}} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button className={btn(editor.isActive("orderedList"))} style={editor.isActive("orderedList") ? activeStyle : {}} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button className={btn(editor.isActive("blockquote"))} style={editor.isActive("blockquote") ? activeStyle : {}} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo; Quote</button>
      <button className={btn(editor.isActive("codeBlock"))} style={editor.isActive("codeBlock") ? activeStyle : {}} title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
    </div>
  );
};

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
  const [saveStatus, setSaveStatus] = useState<"Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error">("Draft");
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { isLoading: authLoading } = useAuth(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading";
          }

          return "Type '/' for commands...";
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      TextStyle,
      Color,
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

            // Only show menu if at start of line or after space
            const textBefore = $from.parent.textContent.slice(
              0,
              $from.parentOffset,
            );

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
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          const fileType = file.type;

          if (fileType.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();

            reader.onload = (e) => {
              const url = e.target?.result as string;
              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (coordinates) {
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.insert(coordinates.pos, node);

                view.dispatch(transaction);
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

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, editor: any) => {
      const file = event.target.files?.[0];

      if (file && editor) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const url = e.target?.result as string;

          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    [],
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
    [],
  );

  const saveBlog = async (published: boolean) => {
    if (!title.trim()) {
      alert("Please enter a title for your blog");

      return;
    }

    if (!editor?.getHTML()) {
      alert("Please add some content to your blog");

      return;
    }

    setIsSaving(true);
    setSaveStatus(published ? "Publishing..." : "Saving...");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: editor.getHTML(),
          excerpt,
          featuredImage,
          bannerImage,
          tags,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog");
      }

      setSaveStatus(published ? "Published" : "Draft Saved");
      alert(
        published
          ? "Blog published successfully!"
          : "Draft saved successfully!",
      );

      // Redirect to blog list or edit page
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    } catch (error: any) {
      alert(error.message || "Failed to save blog");
      setSaveStatus("Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = useCallback(() => {
    saveBlog(false);
  }, [title, editor, excerpt, featuredImage, bannerImage, tags]);

  const handlePublish = useCallback(() => {
    saveBlog(true);
  }, [title, editor, excerpt, featuredImage, bannerImage, tags]);

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
    Draft: "#6b7280", "Saving…": "#FF5B04", "Publishing…": "#FF5B04",
    Saved: "#16a34a", Published: "#16a34a", Error: "#dc2626",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F6" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(247,247,246,0.95)", borderBottom: "1px solid rgba(0,0,0,0.07)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-3">
          <a href="/admin/blogs" className="flex items-center gap-1.5 text-xs font-geist text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Blogs
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium font-geist text-gray-900">New Post</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-geist font-medium transition-colors" style={{ color: statusColor[saveStatus] ?? "#6b7280" }}>
            {saveStatus}
          </span>
          <Button variant="flat" disabled={isSaving} onClick={handleSaveDraft}
            className="font-geist text-sm h-9 px-4 rounded-xl bg-black/5 text-gray-700 font-medium">
            Save Draft
          </Button>
          <Button disabled={isSaving} isLoading={isSaving} onClick={handlePublish}
            className="font-geist text-sm h-9 px-4 rounded-xl font-medium text-white"
            style={{ background: "#FF5B04" }}>
            Publish
          </Button>
        </div>
      </div>

      {/* Formatting toolbar */}
      <FormattingToolbar editor={editor} />

      {/* Two-column layout */}
      <div className="flex gap-6 p-6 items-start">
        {/* ── Editor column ── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          {/* Title */}
          <div className="px-10 pt-10 pb-4">
            <input
              className="w-full text-4xl font-bold font-geist border-none outline-none bg-transparent text-gray-900 placeholder-gray-300 leading-tight"
              placeholder="Post title…"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-xs font-jetbrains-mono text-gray-300 mt-3">Type <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">/</kbd> in the editor for block commands</p>
          </div>

          <div className="h-px mx-10" style={{ background: "rgba(0,0,0,0.06)" }} />

          {/* Editor */}
          <div ref={editorRef} className="relative px-10 py-6">
            <div className="notion-editor-wrapper min-h-[520px]">
              <EditorContent editor={editor} />
            </div>
            <SlashCommandMenu editor={editor} isOpen={slashMenuOpen} position={slashMenuPosition} onClose={() => setSlashMenuOpen(false)} />
          </div>
        </div>

        {/* ── Settings sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Publish card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Publish</p>
            <div className="space-y-2">
              <Button className="w-full font-geist font-medium text-white text-sm h-10 rounded-xl" style={{ background: "#FF5B04" }}
                disabled={isSaving} isLoading={isSaving} onClick={handlePublish}>
                Publish Now
              </Button>
              <Button variant="flat" className="w-full font-geist font-medium text-sm h-10 rounded-xl bg-black/5 text-gray-600"
                disabled={isSaving} onClick={handleSaveDraft}>
                Save as Draft
              </Button>
            </div>
          </div>

          {/* Banner image card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Banner Image</p>
            {bannerImage ? (
              <div className="relative group">
                <img src={bannerImage} alt="Banner" className="w-full h-32 object-cover rounded-xl" />
                <button onClick={() => { setBannerImage(""); setFeaturedImage(""); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-[#FF5B04] hover:bg-orange-50"
                style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5B04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-xs font-geist text-gray-400 mt-2">Click to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
              </label>
            )}
          </div>

          {/* Excerpt card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Excerpt</p>
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
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs font-geist px-2 py-0.5 rounded-full"
                  style={{ background: "#FFF0E8", color: "#FF5B04" }}>
                  {tag}
                  <button onClick={() => setTags(tags.filter(t => t !== tag))} className="opacity-60 hover:opacity-100 leading-none">✕</button>
                </span>
              ))}
            </div>
            <input className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none placeholder-gray-300"
              placeholder="Add tag, press Enter…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          {/* Insert image card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Insert Image</p>
            <label className="flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-gray-900 bg-black/5 rounded-xl px-3 py-2.5 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, editor)} />
            </label>
          </div>
        </div>
      </div>

      <style>{`
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

        .dark .notion-editor-wrapper .ProseMirror > *:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .notion-editor-wrapper
          .ProseMirror
          p.is-editor-empty:first-child::before {
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

        .dark .notion-editor-wrapper .ProseMirror p {
          color: #d1d5db;
        }

        .notion-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

        .notion-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li
          > label {
          flex: 0 0 auto;
          margin-top: 0.25rem;
          user-select: none;
        }

        .notion-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li
          > label
          input {
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

        .dark .notion-editor-wrapper .ProseMirror code {
          background-color: #374151;
          color: #fb7185;
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

        .dark .notion-editor-wrapper .ProseMirror mark {
          background-color: #92400e;
          color: #fef3c7;
        }

        .notion-editor-wrapper .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          line-height: 1.2;
        }

        .dark .notion-editor-wrapper .ProseMirror h1 {
          color: #f9fafb;
        }

        .notion-editor-wrapper .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .dark .notion-editor-wrapper .ProseMirror h2 {
          color: #f3f4f6;
        }

        .notion-editor-wrapper .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.4;
        }

        .dark .notion-editor-wrapper .ProseMirror h3 {
          color: #e5e7eb;
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

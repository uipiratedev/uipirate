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
import { Button } from "@nextui-org/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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
    [editor]
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
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[240px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Blocks
      </div>
      {commands.map((command, index) => (
        <button
          key={index}
          onClick={() => {
            command.command();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left rounded-lg"
        >
          <span className="text-gray-600 dark:text-gray-300 text-lg font-semibold w-8 text-center">
            {command.icon}
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {command.title}
          </span>
        </button>
      ))}
    </div>
  );
};

// Formatting toolbar component
const FormattingToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold text-sm ${
      isActive
        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
        : "text-gray-600 dark:text-gray-400"
    }`;

  return (
    <div className="sticky top-[73px] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 py-3 px-6">
      <div className="max-w-4xl mx-auto flex items-center gap-1 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={buttonClass(editor.isActive("code"))}
          title="Code"
        >
          {"<>"}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={buttonClass(editor.isActive("highlight"))}
          title="Highlight"
        >
          ⬛
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          1.
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={buttonClass(editor.isActive("taskList"))}
          title="Task List"
        >
          ☑
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive("blockquote"))}
          title="Quote"
        >
          "
        </button>
      </div>
    </div>
  );
};

const BlogEditor = () => {
  const [mounted, setMounted] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("Draft");
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Require authentication
  const { isAuthenticated, isLoading: authLoading } = useAuth(true);

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
              $from.parentOffset
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
    []
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
        published ? "Blog published successfully!" : "Draft saved successfully!"
      );

      // Redirect to blog list or edit page
      setTimeout(() => {
        router.push("/admin/dashboard/blogs");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving blog:", error);
      alert(error.message || "Failed to save blog");
      setSaveStatus("Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = useCallback(() => {
    saveBlog(false);
  }, [title, editor, excerpt, featuredImage, tags]);

  const handlePublish = useCallback(() => {
    saveBlog(true);
  }, [title, editor, excerpt, featuredImage, tags]);

  if (!mounted || !editor || authLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Create Post
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {saveStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveDraft}
              variant="flat"
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSaving}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <FormattingToolbar editor={editor} />

      <div className="max-w-4xl mx-auto pt-12 pb-24 px-6">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Untitled Post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold border-none outline-none bg-transparent mb-6 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:placeholder-gray-300"
        />

        {/* Editor Container */}
        <div ref={editorRef} className="relative">
          {/* Editor Content */}
          <div className="notion-editor-wrapper  min-h-[600px]">
            <EditorContent editor={editor} />
          </div>

          {/* Slash Command Menu */}
          <SlashCommandMenu
            editor={editor}
            isOpen={slashMenuOpen}
            onClose={() => setSlashMenuOpen(false)}
            position={slashMenuPosition}
          />
        </div>

        {/* Floating Toolbar at bottom */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4 z-50">
          <label className="cursor-pointer p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-2xl">🖼️</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, editor)}
              className="hidden"
            />
          </label>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={() => {
              const url = window.prompt("Enter image URL:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Add Image URL
          </button>
        </div>
      </div>

      <style jsx global>{`
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
          border-left: 3px solid #3b82f6;
          padding-left: 1.25rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: #6b7280;
          font-style: italic;
          margin: 1.5rem 0;
          background-color: rgba(59, 130, 246, 0.05);
          border-radius: 0 8px 8px 0;
        }

        .dark .notion-editor-wrapper .ProseMirror blockquote {
          border-left-color: #60a5fa;
          color: #9ca3af;
          background-color: rgba(59, 130, 246, 0.1);
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

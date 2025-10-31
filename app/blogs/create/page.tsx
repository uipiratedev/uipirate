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
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdCode,
  MdFormatQuote,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCheckBox,
  MdImage,
  MdHighlight,
} from "react-icons/md";
import { BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs";

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

  const commands = [
    {
      title: "Heading 1",
      icon: <BsTypeH1 className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      icon: <BsTypeH2 className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      icon: <BsTypeH3 className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: "Bullet List",
      icon: <MdFormatListBulleted className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      icon: <MdFormatListNumbered className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "Task List",
      icon: <MdCheckBox className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      title: "Quote",
      icon: <MdFormatQuote className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      title: "Code Block",
      icon: <MdCode className="w-5 h-5" />,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Image",
      icon: <MdImage className="w-5 h-5" />,
      command: () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
  ];

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
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <span className="text-gray-600 dark:text-gray-300">
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

  return (
    <div className="sticky top-20 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-3 px-8">
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("bold")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Bold (Ctrl+B)"
        >
          <MdFormatBold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("italic")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Italic (Ctrl+I)"
        >
          <MdFormatItalic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("strike")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Strikethrough"
        >
          <MdFormatStrikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("code")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Code"
        >
          <MdCode className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("highlight")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Highlight"
        >
          <MdHighlight className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Heading 1"
        >
          <BsTypeH1 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Heading 2"
        >
          <BsTypeH2 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Heading 3"
        >
          <BsTypeH3 className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Bullet List"
        >
          <MdFormatListBulleted className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Numbered List"
        >
          <MdFormatListNumbered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("taskList")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Task List"
        >
          <MdCheckBox className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            editor.isActive("blockquote")
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
          title="Quote"
        >
          <MdFormatQuote className="w-5 h-5" />
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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = useCallback(
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
    },
    []
  );

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
      handleDrop: (view, event, slice, moved) => {
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
      handlePaste: (view, event) => {
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

  if (!mounted || !editor) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Formatting Toolbar */}
      <FormattingToolbar editor={editor} />

      <div className="max-w-4xl mx-auto pt-8 pb-24">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Untitled"
          className="w-full text-5xl font-bold border-none outline-none bg-transparent px-8 mb-4 text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />

        {/* Editor Container */}
        <div ref={editorRef} className="relative">
          {/* Editor Content */}
          <div className="notion-editor-wrapper">
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

        {/* Toolbar at bottom */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-4 z-50">
          <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MdImage className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => {
              const url = window.prompt("Enter image URL:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Add Image URL
          </button>
        </div>
      </div>

      <style jsx global>{`
        .notion-editor-wrapper .ProseMirror {
          position: relative;
        }

        .notion-editor-wrapper .ProseMirror > * {
          position: relative;
          padding-left: 2rem;
        }

        .notion-editor-wrapper .ProseMirror > *:hover .drag-handle {
          opacity: 1;
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

        .notion-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }

        .notion-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li
          > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }

        .notion-editor-wrapper .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
        }

        .notion-editor-wrapper .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 4px;
          padding: 0.2rem 0.4rem;
          font-size: 0.9em;
        }

        .notion-editor-wrapper .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
        }

        .notion-editor-wrapper .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .notion-editor-wrapper .ProseMirror mark {
          background-color: #fef3c7;
          border-radius: 2px;
          padding: 0.1rem 0.2rem;
        }

        .notion-editor-wrapper .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .notion-editor-wrapper .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .notion-editor-wrapper .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .dark .notion-editor-wrapper .ProseMirror blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }

        .dark .notion-editor-wrapper .ProseMirror code {
          background-color: #374151;
        }

        .dark .notion-editor-wrapper .ProseMirror mark {
          background-color: #92400e;
          color: #fef3c7;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor } from "@tiptap/react";
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
import { Input } from "@nextui-org/input";

import { useAuth } from "@/hooks/useAuth";

const BlogEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("Draft");
  const [blogId, setBlogId] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  // Require authentication
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, isLoading: authLoading } = useAuth(true);

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
        placeholder: "Start writing your blog content...",
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
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (params.id && mounted && !authLoading && editor) {
      fetchBlog();
    }
  }, [params.id, mounted, authLoading, editor]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const blog = data.data;

        setBlogId(blog._id);
        setTitle(blog.title);
        setExcerpt(blog.excerpt || "");
        setFeaturedImage(blog.featuredImage || "");
        setTags(blog.tags || []);
        setSaveStatus(blog.published ? "Published" : "Draft");

        // Set editor content
        if (editor) {
          editor.commands.setContent(blog.content);
        }
      } else {
        alert("Blog not found");
        router.push("/admin/dashboard/blogs");
      }
    } catch (error) {
      alert("Failed to load blog");
      router.push("/admin/dashboard/blogs");
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update blog");
      }

      setSaveStatus(published ? "Published" : "Draft Saved");
      alert(
        published
          ? "Blog updated and published!"
          : "Blog updated successfully!",
      );

      // Redirect to blog list
      setTimeout(() => {
        router.push("/admin/dashboard/blogs");
      }, 1500);
    } catch (error: any) {
      alert(error.message || "Failed to update blog");
      setSaveStatus("Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = useCallback(() => {
    saveBlog(false);
  }, [title, editor, excerpt, featuredImage, tags, blogId]);

  const handlePublish = useCallback(() => {
    saveBlog(true);
  }, [title, editor, excerpt, featuredImage, tags, blogId]);

  if (!mounted || !editor || authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Edit Post
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {saveStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              disabled={isSaving}
              variant="flat"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              disabled={isSaving}
              onClick={handlePublish}
            >
              {isSaving ? "Saving..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Title Input */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
            <Input
              classNames={{
                input:
                  "text-4xl font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600",
                inputWrapper: "shadow-none bg-transparent",
              }}
              placeholder="Blog Title"
              value={title}
              variant="flat"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Editor */}
          <div ref={editorRef} className="min-h-[600px]">
            <div className="tiptap-editor">{editor && <div />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditPage;

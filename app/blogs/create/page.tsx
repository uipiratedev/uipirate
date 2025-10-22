// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";

// const BlogEditor = () => {
//   const editor = useEditor({
//     extensions: [StarterKit, Image],
//     content: "<p>Start writing your blog...</p>",
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
//       },
//     },
//     // <-- THIS IS THE KEY:
//     immediatelyRender: false,
//   });

//   if (!editor) return null; // render nothing until editor is ready

//   return <EditorContent editor={editor} />;
// };

// export default BlogEditor;
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';

const BlogEditor = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensure editor renders only on client
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Start writing your blog...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    immediatelyRender: false, // <-- prevent SSR error
  });

  if (!mounted || !editor) return null; // render only on client

  return <EditorContent editor={editor} />;
};

export default BlogEditor;

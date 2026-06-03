import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

export function useEditorSelection(editor: Editor | null) {
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{ from: number; to: number } | null>(null);

  useEffect(() => {
    if (!editor) {
      setSelectedText("");
      setSelectionRange(null);
      return;
    }

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      
      if (from === to) {
        // Selection is collapsed. Default to the focused block/paragraph.
        const $from = editor.state.selection.$from;
        const parentNode = $from.parent;
        
        if (parentNode && (parentNode.type.name === "paragraph" || parentNode.type.name === "heading")) {
          const text = parentNode.textContent || "";
          setSelectedText(text.trim());
          setSelectionRange({ from: $from.before(), to: $from.after() });
        } else {
          setSelectedText("");
          setSelectionRange(null);
        }
        return;
      }
      
      const text = editor.state.doc.textBetween(from, to, " ");
      setSelectedText(text.trim());
      setSelectionRange({ from, to });
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("update", handleSelectionUpdate);

    // Initial call
    handleSelectionUpdate();

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("update", handleSelectionUpdate);
    };
  }, [editor]);

  return { selectedText, selectionRange };
}

import Image from "@tiptap/extension-image";
import { NodeSelection } from "@tiptap/pm/state";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.style.width || "auto",
        renderHTML: (attributes) => {
          const w = attributes.width || "auto";
          return {
            style: `width: ${w}; max-width: 100%;`,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => {
          if (
            element.style.float === "left" ||
            element.classList.contains("image-align-left")
          ) {
            return "left";
          }
          if (
            element.style.float === "right" ||
            element.classList.contains("image-align-right")
          ) {
            return "right";
          }

          return "center";
        },
        renderHTML: (attributes) => {
          let margin = "1.5rem auto";
          let floatVal = "none";

          if (attributes.align === "left") {
            margin = "0.5rem 1.5rem 0.5rem 0";
            floatVal = "left";
          } else if (attributes.align === "right") {
            margin = "0.5rem 0 0.5rem 1.5rem";
            floatVal = "right";
          }

          return {
            style: `margin: ${margin}; display: block; float: ${floatVal};`,
            class: `image-align-${attributes.align}`,
          };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement("span");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.maxWidth = "100%";

      const { width, align, src, alt, title } = node.attrs;

      const setAlignment = (alignVal: string) => {
        let margin = "1.5rem auto";
        let floatVal = "none";

        if (alignVal === "left") {
          margin = "0.5rem 1.5rem 0.5rem 0";
          floatVal = "left";
        } else if (alignVal === "right") {
          margin = "0.5rem 0 0.5rem 1.5rem";
          floatVal = "right";
        }

        container.style.margin = margin;
        container.style.float = floatVal;
        container.style.display = alignVal === "center" ? "block" : "inline-block";
      };

      setAlignment(align || "center");
      container.className = `image-resizer-container image-align-${align || "center"}`;

      const img = document.createElement("img");
      img.src = src || "";
      if (alt) img.alt = alt;
      if (title) img.title = title;
      img.style.height = "auto";
      img.style.display = "block";
      img.style.borderRadius = "12px";
      img.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
      img.style.transition = "outline 0.15s ease, outline-offset 0.15s ease";

      const setWidth = (widthVal: string) => {
        if (widthVal === "auto") {
          container.style.width = "auto";
          img.style.width = "auto";
        } else {
          container.style.width = widthVal || "100%";
          img.style.width = "100%";
        }
      };

      setWidth(width || "100%");
      container.appendChild(img);

      let handle: HTMLSpanElement | null = null;

      if (editor.isEditable) {
        // Create resize handle
        handle = document.createElement("span");
        handle.style.position = "absolute";
        handle.style.right = "4px";
        handle.style.bottom = "4px";
        handle.style.width = "14px";
        handle.style.height = "14px";
        handle.style.backgroundColor = "#FF5B04";
        handle.style.cursor = "se-resize";
        handle.style.borderRadius = "50%";
        handle.style.border = "2px solid white";
        handle.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        handle.style.display = "none"; // hidden until selected
        handle.style.zIndex = "10";

        container.appendChild(handle);

        // Make image clickable to select the node
        img.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof getPos === "function") {
            const pos = getPos();
            if (typeof pos === "number") {
              const { state, dispatch } = editor.view;
              const selection = NodeSelection.create(state.doc, pos);
              dispatch(state.tr.setSelection(selection));
            }
          }
        });

        // Handle dragging
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startWidth = container.clientWidth;
          const editorWidth = editor.view.dom.clientWidth || 1;

          const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidthPx = startWidth + deltaX;
            let newWidthPercent = Math.round((newWidthPx / editorWidth) * 100);
            newWidthPercent = Math.max(10, Math.min(100, newWidthPercent));

            container.style.width = `${newWidthPercent}%`;
            img.style.width = "100%";
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            if (typeof getPos === "function") {
              const pos = getPos();
              if (typeof pos === "number") {
                const finalWidth = container.style.width;
                editor.view.dispatch(
                  editor.view.state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: finalWidth,
                  })
                );
              }
            }
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      }

      return {
        dom: container,
        update(newNode) {
          if (newNode.type.name !== node.type.name) {
            return false;
          }
          node = newNode;

          const { width: newWidth, align: newAlign, src: newSrc, alt: newAlt, title: newTitle } = node.attrs;
          setWidth(newWidth || "100%");
          setAlignment(newAlign || "center");
          container.className = `image-resizer-container image-align-${newAlign || "center"}`;

          img.src = newSrc || "";
          if (newAlt) img.alt = newAlt;
          if (newTitle) img.title = newTitle;

          return true;
        },
        selectNode() {
          if (!editor.isEditable) return;
          container.classList.add("ProseMirror-selectednode");
          img.style.outline = "3px solid #FF5B04";
          img.style.outlineOffset = "2px";
          if (handle) handle.style.display = "block";
        },
        deselectNode() {
          container.classList.remove("ProseMirror-selectednode");
          img.style.outline = "none";
          if (handle) handle.style.display = "none";
        },
      };
    };
  },
});


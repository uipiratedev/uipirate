import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const SelectionHighlight = Extension.create({
  name: "selectionHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("selectionHighlight"),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            const { selection } = tr;

            if (selection.empty || selection.from === selection.to) {
              return DecorationSet.empty;
            }

            const deco = Decoration.inline(selection.from, selection.to, {
              class: "brand-selection-highlight",
            });

            return DecorationSet.create(tr.doc, [deco]);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

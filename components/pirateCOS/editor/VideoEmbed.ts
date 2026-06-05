import { Node } from "@tiptap/core";

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true, // Mark as leaf node
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      caption: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.video-embed-wrapper",
        getAttrs: (element: HTMLElement) => {
          const iframe = element.querySelector("iframe");
          const captionText = element.querySelector("p")?.textContent || "";

          return {
            src: iframe?.getAttribute("src") || null,
            caption: captionText || null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const captionHtml = HTMLAttributes.caption
      ? [
          "p",
          {
            style:
              "text-align:center;font-size:0.8rem;color:#9ca3af;margin-top:0.5rem",
          },
          HTMLAttributes.caption,
        ]
      : null;

    return [
      "div",
      { class: "video-embed-wrapper", contenteditable: "false" },
      [
        "div",
        { class: "video-embed-ratio" },
        [
          "iframe",
          {
            src: HTMLAttributes.src,
            frameborder: "0",
            allowfullscreen: "true",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          },
        ],
      ],
      ...(captionHtml ? [captionHtml] : []),
    ];
  },
});

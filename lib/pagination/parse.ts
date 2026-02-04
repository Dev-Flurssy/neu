import { LayoutBlock, BlockType } from "./types";

export function parseHtmlToBlocks(htmlString: string): LayoutBlock[] {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  let children = Array.from(container.children);
  if (children.length === 1 && children[0].tagName === "DIV") {
    children = Array.from(children[0].children);
  }

  return children.map((el, index) => {
    const tag = el.tagName.toLowerCase();

    const type: BlockType =
      tag === "h1" || tag === "h2" || tag === "h3"
        ? "heading"
        : tag === "img"
          ? "image"
          : tag === "table"
            ? "table"
            : tag === "ul" || tag === "ol"
              ? "list"
              : "paragraph";

    return {
      id: `block-${index}`,
      type,
      html: el.outerHTML,
    };
  });
}

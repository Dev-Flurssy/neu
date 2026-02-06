import { LayoutBlock, BlockType } from "./types";

export function parseHtmlToBlocks(html: string): LayoutBlock[] {
  const container = document.createElement("div");
  container.innerHTML = html;

  // Remove whitespace-only text nodes
  Array.from(container.childNodes).forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent?.trim()) {
      n.remove();
    }
  });

  let children = Array.from(container.children);

  // Unwrap TipTap root div if needed
  if (children.length === 1 && children[0].tagName === "DIV") {
    children = Array.from(children[0].children);
  }

  const blocks: LayoutBlock[] = [];
  let index = 0;

  for (const el of children) {
    const tag = el.tagName.toLowerCase();

    // Skip empty paragraphs
    if (tag === "p" && !el.textContent?.trim()) continue;

    // HEADINGS
    if (["h1", "h2", "h3"].includes(tag)) {
      blocks.push({
        id: `block-${index++}`,
        type: "heading",
        html: el.outerHTML,
      });
      continue;
    }

    // IMAGES
    if (tag === "img") {
      blocks.push({
        id: `block-${index++}`,
        type: "image",
        html: el.outerHTML,
      });
      continue;
    }

    // TABLES
    if (tag === "table") {
      blocks.push({
        id: `block-${index++}`,
        type: "table",
        html: el.outerHTML,
      });
      continue;
    }

    // LISTS → convert each <li> into its own block
    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.querySelectorAll(":scope > li"));

      for (const li of items) {
        if (!li.textContent?.trim()) continue;

        blocks.push({
          id: `block-${index++}`,
          type: "list-item", // ✔ matches your BlockType
          html: li.outerHTML,
        });
      }

      continue;
    }

    // PARAGRAPHS / OTHER BLOCKS
    blocks.push({
      id: `block-${index++}`,
      type: "paragraph",
      html: el.outerHTML,
    });
  }

  return blocks;
}

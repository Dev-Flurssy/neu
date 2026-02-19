import type { LayoutBlock as SimpleBlock } from "./types";
import type { LayoutBlock as DocxBlock } from "./layoutExtractor";
import { extractLayoutModel, extractInlineRuns } from "./layoutExtractor";
import type { TableCellMeta, TableRowMeta } from "./layoutExtractor";
import { parseHTML } from "linkedom";

/**
 * Unified parser that returns blocks compatible with both pagination and DOCX export
 */
export function parseHtmlToBlocks(html: string): SimpleBlock[] {
  const { document, Node } = parseHTML(`<!DOCTYPE html><html><body></body></html>`);
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

  const blocks: SimpleBlock[] = [];
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
        meta: {
          layout: extractLayoutModel(el as HTMLElement),
          inline: extractInlineRuns(el as HTMLElement),
        },
      });
      continue;
    }

    // IMAGES (check both direct img tags and imgs inside paragraphs)
    if (tag === "img") {
      const img = el as HTMLImageElement;
      blocks.push({
        id: `block-${index++}`,
        type: "image",
        html: el.outerHTML,
        meta: {
          layout: extractLayoutModel(el as HTMLElement),
          image: {
            src: img.src,
            width: img.width || img.naturalWidth,
            height: img.height || img.naturalHeight,
          },
        },
      });
      continue;
    }

    // Check if paragraph contains only an image
    if (tag === "p") {
      const imgInP = el.querySelector("img");
      if (imgInP && el.children.length === 1) {
        const img = imgInP as HTMLImageElement;
        blocks.push({
          id: `block-${index++}`,
          type: "image",
          html: img.outerHTML,
          meta: {
            layout: extractLayoutModel(img as HTMLElement),
            image: {
              src: img.src,
              width: img.width || img.naturalWidth,
              height: img.height || img.naturalHeight,
            },
          },
        });
        continue;
      }
    }

    // TABLES
    if (tag === "table") {
      const tableEl = el as HTMLTableElement;
      const rows: TableRowMeta[] = Array.from(tableEl.rows).map((tr) => ({
        cells: Array.from(tr.cells).map(
          (td) =>
            ({
              inline: extractInlineRuns(td as HTMLElement),
              borderColor: "#d1d5db",
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 8,
              paddingRight: 8,
            } as TableCellMeta)
        ),
      }));

      blocks.push({
        id: `block-${index++}`,
        type: "table",
        html: el.outerHTML,
        meta: {
          layout: extractLayoutModel(el as HTMLElement),
          table: { rows },
        },
      });
      continue;
    }

    // LISTS → keep as complete block
    if (tag === "ul" || tag === "ol") {
      blocks.push({
        id: `block-${index++}`,
        type: "list",
        html: el.outerHTML,
        meta: {
          layout: extractLayoutModel(el as HTMLElement),
        },
      });
      continue;
    }

    // PARAGRAPHS / OTHER BLOCKS
    blocks.push({
      id: `block-${index++}`,
      type: "paragraph",
      html: el.outerHTML,
      meta: {
        layout: extractLayoutModel(el as HTMLElement),
        inline: extractInlineRuns(el as HTMLElement),
      },
    });
  }

  return blocks;
}

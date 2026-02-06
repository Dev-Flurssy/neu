import type {
  LayoutBlock,
  LayoutModel,
  InlineRun,
  ImageMeta,
  TableMeta,
  TableCellMeta,
  TableRowMeta,
} from "./layoutExtractor";

import { extractLayoutModel, extractInlineRuns } from "./layoutExtractor";

export function parseHtmlToBlocks(html: string): LayoutBlock[] {
  const container = document.createElement("div");
  container.innerHTML = html;

  let children = Array.from(container.children);

  // Unwrap editor root div if needed
  if (children.length === 1 && children[0].tagName === "DIV") {
    children = Array.from(children[0].children);
  }

  return children.map((el, index) => {
    const tag = el.tagName.toLowerCase();
    const type: LayoutBlock["type"] = ["h1", "h2", "h3"].includes(tag)
      ? "heading"
      : tag === "img"
        ? "image"
        : tag === "table"
          ? "table"
          : tag === "ul" || tag === "ol"
            ? "list"
            : "paragraph";

    const meta: {
      layout: LayoutModel;
      inline?: InlineRun[];
      image?: ImageMeta;
      table?: TableMeta;
    } = {
      layout: extractLayoutModel(el as HTMLElement),
      inline: extractInlineRuns(el as HTMLElement),
    };

    if (type === "image") {
      const img = el as HTMLImageElement;
      meta.image = { src: img.src, width: img.width, height: img.height };
    }

    if (type === "table") {
      const tableEl = el as HTMLTableElement;
      const rows: TableRowMeta[] = Array.from(tableEl.rows).map((tr) => ({
        cells: Array.from(tr.cells).map(
          (td) =>
            ({
              inline: extractInlineRuns(td as HTMLElement),
              borderColor: "#000000",
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 2,
              paddingRight: 2,
            } as TableCellMeta)
        ),
      }));
      meta.table = { rows } as TableMeta;
    }

    return { type, html: el.outerHTML, meta } as LayoutBlock;
  });
}

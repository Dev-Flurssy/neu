export interface LayoutModel {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: "left" | "center" | "right" | "justify";
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  color: string;
  backgroundColor: string;
}

export interface InlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  highlight?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface ImageMeta {
  width: number;
  height: number;
  src: string;
}

export interface TableCellMeta {
  inline: InlineRun[];
  borderColor: string;
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

export interface TableRowMeta {
  cells: TableCellMeta[];
}

export interface TableMeta {
  rows: TableRowMeta[];
}

export interface LayoutBlock {
  type: "paragraph" | "heading" | "list" | "image" | "table";
  html: string;
  meta: {
    layout: LayoutModel;
    inline?: InlineRun[];
    image?: ImageMeta;
    table?: TableMeta;
  };
}

export interface PaginationResult {
  pages: { blocks: LayoutBlock[] }[];
}

/* ----------------- EXTRACT LAYOUT & INLINE RUNS ------------------ */

export function extractLayoutModel(element: HTMLElement): LayoutModel {
  // For server-side rendering, return default values
  // In a real implementation, you might want to parse inline styles
  const style = element.style;
  const px = (v: string) => (v && v.endsWith("px") ? parseFloat(v) : 0);
  
  return {
    fontSize: px(style.fontSize) || 16,
    lineHeight: parseFloat(style.lineHeight) || 1.2,
    fontFamily: style.fontFamily || "Arial",
    fontWeight: style.fontWeight || "normal",
    fontStyle: style.fontStyle || "normal",
    textAlign: (style.textAlign as any) || "left",
    marginTop: px(style.marginTop),
    marginBottom: px(style.marginBottom),
    paddingTop: px(style.paddingTop),
    paddingBottom: px(style.paddingBottom),
    paddingLeft: px(style.paddingLeft),
    paddingRight: px(style.paddingRight),
    color: style.color || "#000000",
    backgroundColor: style.backgroundColor || "transparent",
  };
}

export function extractInlineRuns(root: HTMLElement): InlineRun[] {
  const runs: InlineRun[] = [];

  const walk = (node: any, inherited: Partial<InlineRun> = {}) => {
    if (node.nodeType === 3) { // TEXT_NODE
      const text = node.textContent ?? "";
      if (!text.trim()) return;
      runs.push({ text, ...inherited });
      return;
    }

    if (node.nodeType === 1) { // ELEMENT_NODE
      const el = node as HTMLElement;
      const style = el.style;
      const next: Partial<InlineRun> = {
        bold:
          inherited.bold ||
          el.tagName === "B" ||
          el.tagName === "STRONG" ||
          !!(style.fontWeight && parseInt(style.fontWeight) >= 600),
        italic:
          inherited.italic ||
          el.tagName === "I" ||
          el.tagName === "EM" ||
          style.fontStyle === "italic",
        underline:
          inherited.underline ||
          el.tagName === "U" ||
          !!(style.textDecoration && style.textDecoration.includes("underline")),
        color: style.color || inherited.color,
        highlight:
          style.backgroundColor &&
          style.backgroundColor !== "transparent" &&
          style.backgroundColor !== "rgba(0,0,0,0)"
            ? style.backgroundColor
            : inherited.highlight,
        fontSize: (style.fontSize && parseFloat(style.fontSize)) || inherited.fontSize,
        fontFamily: style.fontFamily || inherited.fontFamily,
      };
      node.childNodes.forEach((child: any) => walk(child, next));
    }
  };

  walk(root);
  return runs;
}

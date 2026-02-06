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
  const computed = window.getComputedStyle(element);
  const px = (v: string) => (v.endsWith("px") ? parseFloat(v) : 0);
  const parseLineHeight = (value: string, fontSize: number) => {
    if (value === "normal") return 1.2;
    if (value.endsWith("px")) return parseFloat(value) / fontSize;
    const num = parseFloat(value);
    return !isNaN(num) ? num : 1.2;
  };
  const fontSize = px(computed.fontSize);
  const lineHeight = parseLineHeight(computed.lineHeight, fontSize);
  return {
    fontSize,
    lineHeight,
    fontFamily: computed.fontFamily,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    textAlign: (computed.textAlign as any) || "left",
    marginTop: px(computed.marginTop),
    marginBottom: px(computed.marginBottom),
    paddingTop: px(computed.paddingTop),
    paddingBottom: px(computed.paddingBottom),
    paddingLeft: px(computed.paddingLeft),
    paddingRight: px(computed.paddingRight),
    color: computed.color,
    backgroundColor: computed.backgroundColor,
  };
}

export function extractInlineRuns(root: HTMLElement): InlineRun[] {
  const runs: InlineRun[] = [];

  const walk = (node: Node, inherited: Partial<InlineRun> = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text.trim()) return;
      runs.push({ text, ...inherited });
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const style = window.getComputedStyle(el);
      const next: Partial<InlineRun> = {
        bold:
          inherited.bold ||
          el.tagName === "B" ||
          el.tagName === "STRONG" ||
          parseInt(style.fontWeight) >= 600,
        italic:
          inherited.italic ||
          el.tagName === "I" ||
          el.tagName === "EM" ||
          style.fontStyle === "italic",
        underline:
          inherited.underline ||
          el.tagName === "U" ||
          style.textDecorationLine.includes("underline"),
        color: style.color || inherited.color,
        highlight:
          style.backgroundColor !== "transparent" &&
          style.backgroundColor !== "rgba(0,0,0,0)"
            ? style.backgroundColor
            : inherited.highlight,
        fontSize: parseFloat(style.fontSize) || inherited.fontSize,
        fontFamily: style.fontFamily || inherited.fontFamily,
      };
      node.childNodes.forEach((child) => walk(child, next));
    }
  };

  walk(root);
  return runs;
}

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
  pages: {
    blocks: LayoutBlock[];
  }[];
}

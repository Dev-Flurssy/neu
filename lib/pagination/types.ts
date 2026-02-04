export type BlockType = "paragraph" | "heading" | "image" | "table" | "list";

export interface LayoutBlock {
  id: string;
  type: BlockType;
  html: string;
  meta?: Record<string, any>;
}

export interface PageLayout {
  pageIndex: number;
  blocks: LayoutBlock[];
}

export interface PaginationResult {
  pages: PageLayout[];
  domPages: HTMLDivElement[];
}

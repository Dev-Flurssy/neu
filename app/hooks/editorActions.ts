export type EditorAction =
  | "bold"
  | "italic"
  | "strike"
  | "heading"
  | "quote"
  | "code"
  | "ul"
  | "ol"
  | "link"
  | "image"
  | "table"
  | "horizontal-rule"
  | "preview"
  | "fullscreen"
  | "clear";

export const editorActions: {
  key: EditorAction;
  label: string;
}[] = [
  { key: "bold", label: "Bold" },
  { key: "italic", label: "Italic" },
  { key: "strike", label: "Strike" },
  { key: "heading", label: "H" },
  { key: "quote", label: "Quote" },
  { key: "code", label: "Code" },
  { key: "ul", label: "UL" },
  { key: "ol", label: "OL" },
  { key: "link", label: "Link" },
  { key: "image", label: "Image" },
  { key: "table", label: "Table" },
  { key: "horizontal-rule", label: "HR" },
  { key: "preview", label: "Preview" },
  { key: "fullscreen", label: "Full" },
  { key: "clear", label: "Clear" },
];

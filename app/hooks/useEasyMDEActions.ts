import EasyMDE from "easymde";
import type { EditorAction } from "./editorActions";

export function runEasyMDEAction(mde: EasyMDE, action: EditorAction) {
  switch (action) {
    case "bold":
      EasyMDE.toggleBold(mde);
      break;
    case "italic":
      EasyMDE.toggleItalic(mde);
      break;
    case "strike":
      EasyMDE.toggleStrikethrough(mde);
      break;
    case "heading":
      EasyMDE.toggleHeadingSmaller(mde);
      break;
    case "quote":
      EasyMDE.toggleBlockquote(mde);
      break;
    case "code":
      EasyMDE.toggleCodeBlock(mde);
      break;
    case "ul":
      EasyMDE.toggleUnorderedList(mde);
      break;
    case "ol":
      EasyMDE.toggleOrderedList(mde);
      break;
    case "link":
      EasyMDE.drawLink(mde);
      break;
    case "image":
      EasyMDE.drawImage(mde);
      break;
    case "preview":
      EasyMDE.togglePreview(mde);
      break;
    case "fullscreen":
      EasyMDE.toggleFullScreen(mde);
      break;
    case "horizontal-rule":
      mde.codemirror.replaceSelection("\n---\n");
      break;
    case "table":
      mde.codemirror.replaceSelection("\n| A | B |\n|---|---|\n|   |   |\n");
      break;
    case "clear":
      mde.codemirror.replaceSelection("");
      break;
  }
}

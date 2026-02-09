"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageView } from "../components/editor/ResizableImageView";

// Extend Image to support resizing with custom NodeView
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";

import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

import { useEffect, useRef } from "react";

export function useTiptapEditor(
  value: string,
  onChange: (html: string) => void,
  editable: boolean = true,
) {
  const initialValue = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        strike: false,
      }),

      Heading.configure({ levels: [1, 2, 3] }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      ListItem.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              // If current list item is empty, exit the list
              const { state } = this.editor;
              const { $from } = state.selection;
              const node = $from.node($from.depth);
              
              if (node.type.name === 'listItem' && node.textContent.length === 0) {
                return this.editor.commands.liftListItem('listItem');
              }
              
              return false;
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),

      ResizableImage.configure({ 
        allowBase64: true,
        inline: false,
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      Link.configure({ autolink: true }),

      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],

    content: initialValue.current,

    onUpdate: ({ editor }) => {
      if (editable) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return editor;
}

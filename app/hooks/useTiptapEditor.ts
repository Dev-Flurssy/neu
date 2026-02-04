"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Image from "@tiptap/extension-image";
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
        link: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),

      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,

      Image.configure({ allowBase64: true }),
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

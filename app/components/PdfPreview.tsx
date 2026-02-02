"use client";

import { useEffect, useRef } from "react";
import { paginateContent } from "@/lib/export/paginate";

export default function PdfPreview({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const pages = paginateContent(html);

    pages.forEach((page) => {
      ref.current!.appendChild(page);
    });
  }, [html]);

  return <div className="document-preview" ref={ref} />;
}

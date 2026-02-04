"use client";

import { useEffect, useRef, useState } from "react";
import { parseHtmlToBlocks } from "@/lib/pagination/parse";
import { paginateBlocks } from "@/lib/pagination/engine";

export default function PdfPreview({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [css, setCss] = useState<string | null>(null);

  // Load document CSS once
  useEffect(() => {
    fetch("/document-base.css")
      .then((res) => res.text())
      .then((text) => setCss(text));
  }, []);

  async function waitForImages() {
    const imgs = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }),
      ),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!ref.current || !css) return;

      setLoading(true);
      ref.current.innerHTML = `<style>${css}</style>`;

      // Wait for fonts + images + layout
      await document.fonts.ready;
      await waitForImages();
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const blocks = parseHtmlToBlocks(html);
      const result = await paginateBlocks(blocks);

      if (cancelled) return;

      result.domPages.forEach((page) => {
        ref.current!.appendChild(page);
      });

      setLoading(false);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [html, css]);

  return (
    <div className="document-preview">
      {loading && <div className="text-gray-500 text-sm">Paginating…</div>}
      <div ref={ref} className="page-stack" />
    </div>
  );
}

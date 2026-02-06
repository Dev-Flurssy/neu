"use client";

import { useEffect, useRef, useState } from "react";
import { parseHtmlToBlocks } from "@/lib/export/pagination/parse";
import { paginateBlocks } from "@/lib/export/pagination/paginate";

export default function PdfPreview({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [css, setCss] = useState<string | null>(null);

  // Load CSS once
  useEffect(() => {
    fetch("/base.css")
      .then((res) => res.text())
      .then(setCss);
  }, []);

  async function waitForImages(container: HTMLElement) {
    const imgs = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!ref.current || !css) return;

      setLoading(true);

      // Reset preview container
      ref.current.innerHTML = "";

      // Inject CSS once
      const styleTag = document.createElement("style");
      styleTag.textContent = css;
      document.head.appendChild(styleTag);

      // Wait for fonts to load
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(r));

      const blocks = parseHtmlToBlocks(html);
      const result = await paginateBlocks(blocks);

      if (cancelled) return;

      for (const page of result.domPages) {
        await waitForImages(page);
        ref.current.appendChild(page);
      }

      // Signal Puppeteer
      (window as any).__done = true;

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

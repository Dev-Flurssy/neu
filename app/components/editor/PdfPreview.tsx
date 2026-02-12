"use client";

import { useEffect, useRef, useState } from "react";
import { parseHtmlToBlocks } from "@/lib/export/pagination/parseUnified";
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

      // Wait for fonts to load first
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(r));

      const blocks = parseHtmlToBlocks(html);
      const result = await paginateBlocks(blocks);

      if (cancelled) return;

      // Wait for all images in all pages to load before displaying
      for (const page of result.domPages) {
        await waitForImages(page);
      }

      if (cancelled) return;

      // Now clear and display all pages at once
      ref.current.innerHTML = "";
      
      for (const page of result.domPages) {
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
    <div className="document-preview responsive-preview">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 text-sm">Loading preview...</div>
        </div>
      )}
      <div ref={ref} className="page-stack" />
      
      {/* Responsive hint for mobile users */}
      <style jsx>{`
        @media (max-width: 767px) {
          .responsive-preview::before {
            content: "📱 Mobile Preview - Scroll to view pages";
            display: block;
            text-align: center;
            padding: 10px;
            background: #f0f0f0;
            color: #666;
            font-size: 12px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}

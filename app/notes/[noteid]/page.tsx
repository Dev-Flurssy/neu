"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useNote } from "@/app/hooks/useNote";
import { NoteViewSkeleton } from "@/app/components/skeleton/NoteViewSkeleton";
import { ExportDropdown } from "@/app/components/editor/ExportDropdown";
import { useEffect, useState } from "react";

export default function NotePreview({
  params,
}: {
  params: Promise<{ noteid: string }>;
}) {
  const { noteid } = use(params);
  const router = useRouter();
  const { note, loading, error, deleteNote } = useNote(noteid);
  const [pages, setPages] = useState<string[]>([]);
  const [isPaginating, setIsPaginating] = useState(true);

  useEffect(() => {
    if (!note?.content) return;

    const paginateContent = async () => {
      setIsPaginating(true);
      
      // Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      
      // Wait a bit more for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a temporary container to measure content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.width = '210mm';
      tempContainer.style.padding = '20mm 20mm 25mm 20mm';
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
      tempContainer.style.fontSize = '11pt';
      tempContainer.style.lineHeight = '1.6';
      tempContainer.style.color = '#111';
      tempContainer.className = 'pdf-preview-content';
      tempContainer.innerHTML = note.content;
      document.body.appendChild(tempContainer);

      // Calculate available height per page (matches PDF export)
      // A4: 297mm height, padding: 20mm top + 25mm bottom = 252mm available
      const pageHeightMM = 297;
      const topPaddingMM = 20;
      const bottomPaddingMM = 25;
      const availableHeightMM = pageHeightMM - topPaddingMM - bottomPaddingMM;
      
      // Convert to pixels (96 DPI: 1mm = 3.7795px)
      const mmToPx = 3.7795;
      const availableHeight = availableHeightMM * mmToPx; // ~952px

      const elements = Array.from(tempContainer.children) as HTMLElement[];
      const pagesArray: string[] = [];
      let currentPageHtml = '';
      let currentHeight = 0;

      elements.forEach((element) => {
        // Check if element has explicit page break
        const hasPageBreak = element.style.breakBefore === 'page' || 
                            element.classList.contains('page-break');
        
        // If explicit page break, start new page
        if (hasPageBreak && currentPageHtml) {
          pagesArray.push(currentPageHtml);
          currentPageHtml = element.outerHTML;
          currentHeight = 0;
          return;
        }
        
        // Get computed height including margins
        const style = window.getComputedStyle(element);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const elementHeight = element.getBoundingClientRect().height + marginTop + marginBottom;
        
        // Special handling for lists - try to split them if they're too long
        if ((element.tagName === 'UL' || element.tagName === 'OL') && elementHeight > availableHeight) {
          const listItems = Array.from(element.children) as HTMLElement[];
          let currentListHtml = `<${element.tagName}>`;
          let listHeight = 40; // Approximate list container overhead
          
          listItems.forEach((li, index) => {
            const liStyle = window.getComputedStyle(li);
            const liMarginTop = parseFloat(liStyle.marginTop) || 0;
            const liMarginBottom = parseFloat(liStyle.marginBottom) || 0;
            const liHeight = li.getBoundingClientRect().height + liMarginTop + liMarginBottom;
            
            // If adding this item would exceed page height
            if (currentHeight + listHeight + liHeight > availableHeight && currentPageHtml) {
              // Close current list and save page
              currentListHtml += `</${element.tagName}>`;
              currentPageHtml += currentListHtml;
              pagesArray.push(currentPageHtml);
              
              // Start new page with continuation of list
              currentPageHtml = '';
              currentListHtml = `<${element.tagName} class="list-continuation">`;
              currentHeight = 0;
              listHeight = 40;
            }
            
            currentListHtml += li.outerHTML;
            listHeight += liHeight;
          });
          
          // Close the list
          currentListHtml += `</${element.tagName}>`;
          currentPageHtml += currentListHtml;
          currentHeight += listHeight;
          return;
        }
        
        // If this single element is taller than a page, put it on its own page
        if (elementHeight > availableHeight) {
          if (currentPageHtml) {
            pagesArray.push(currentPageHtml);
            currentPageHtml = '';
            currentHeight = 0;
          }
          pagesArray.push(element.outerHTML);
        }
        // If adding this element would exceed page height, start new page
        else if (currentHeight + elementHeight > availableHeight && currentPageHtml) {
          pagesArray.push(currentPageHtml);
          currentPageHtml = element.outerHTML;
          currentHeight = elementHeight;
        }
        // Otherwise add to current page
        else {
          currentPageHtml += element.outerHTML;
          currentHeight += elementHeight;
        }
      });

      // Add the last page if there's content
      if (currentPageHtml) {
        pagesArray.push(currentPageHtml);
      }

      document.body.removeChild(tempContainer);
      
      // Ensure we have at least one page, even if empty
      const finalPages = pagesArray.length > 0 ? pagesArray : [note.content || '<p>No content</p>'];
      
      // Filter out pages that are essentially empty (only whitespace or empty tags)
      const nonEmptyPages = finalPages.filter(page => {
        const textContent = page.replace(/<[^>]*>/g, '').trim();
        return textContent.length > 0;
      });
      
      // If all pages are empty, show at least one page with the original content
      const pagesToShow = nonEmptyPages.length > 0 ? nonEmptyPages : [note.content || '<p>No content</p>'];
      
      setPages(pagesToShow);
      setIsPaginating(false);
      
      console.log(`Paginated into ${pagesToShow.length} pages`);
    };

    paginateContent();
  }, [note?.content]);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    await deleteNote();
    router.push("/dashboard");
    router.refresh();
  }

  if (loading || isPaginating) return <NoteViewSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Google Docs-like Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition flex-shrink-0"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-medium text-gray-900 truncate">{note.title.replace(/={2,}/g, '').trim()}</h1>
                <p className="text-xs text-gray-500">
                  Preview Mode • {pages.length} {pages.length === 1 ? 'Page' : 'Pages'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => router.push(`/notes/${note.id}/edit`)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition"
              >
                Edit
              </button>
              
              <ExportDropdown title={note.title} content={note.content} />

              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview - Multiple Pages */}
      <div className="pdf-preview-wrapper px-2 sm:px-4">
        {pages.map((pageContent, index) => (
          <div key={index} className="pdf-preview-page">
            <div 
              className="pdf-preview-content"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
            <div className="pdf-page-number">
              {index + 1} / {pages.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

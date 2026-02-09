/**
 * Common CSS styles for export documents
 */
const baseStyles = `
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #111;
    margin: 0;
    padding: 0;
  }
  
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  
  ul, ol {
    margin: 0 0 8pt 0;
    padding-left: 24pt;
  }
  
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  
  li { 
    margin: 0 0 4pt 0;
    padding-left: 4pt;
    line-height: 1.5;
  }
  
  /* Nested lists - proper spacing */
  li ul, li ol {
    margin: 4pt 0;
    padding-left: 20pt;
  }
  
  /* Second level list items */
  li li {
    margin: 2pt 0;
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 12pt auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0;
  }
  
  th, td {
    border: 1px solid #d1d5db;
    padding: 6pt;
    text-align: left;
    font-size: 11pt;
    line-height: 1.4;
  }
  
  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }
  
  tr:nth-child(even) td {
    background-color: #fafafa;
  }
  
  pre, code {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Courier New', Courier, monospace;
    font-size: 10pt;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 8pt;
    border-radius: 4px;
    margin: 8pt 0;
  }
  
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 12pt 0;
  }
`;

/**
 * Generate full HTML document for PDF export
 */
export function createPdfHtml(title: string, html: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Document"}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 20mm 25mm 20mm;
    }
    
    ${baseStyles}
    
    body {
      font-size: 11pt;
      line-height: 1.5;
      padding: 0;
    }
    
    h1 { 
      font-size: 20pt; 
      margin: 12pt 0 6pt 0; 
      font-weight: 700; 
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    }
    
    h2 { 
      font-size: 16pt; 
      margin: 10pt 0 5pt 0; 
      font-weight: 700; 
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    }
    
    h3 { 
      font-size: 13pt; 
      margin: 8pt 0 4pt 0; 
      font-weight: 600; 
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    }
    
    /* Prevent headings from being orphaned at bottom of page */
    h1, h2, h3 {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Keep heading with at least the next element */
    h1 + *, h2 + *, h3 + * {
      page-break-before: avoid;
      break-before: avoid;
    }
    
    p { 
      margin: 0 0 8pt 0; 
      orphans: 2; 
      widows: 2; 
      line-height: 1.5;
    }
    
    /* Allow lists to break across pages but keep individual items together when possible */
    ul, ol { 
      page-break-inside: auto;
      break-inside: auto;
    }
    
    li { 
      page-break-inside: avoid;
      break-inside: avoid;
      orphans: 2;
      widows: 2;
    }
    
    /* Allow images to break if needed, but prefer to keep them together */
    img { 
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-before: auto;
      page-break-after: auto;
    }
    
    /* Tables should avoid breaking when possible */
    table { 
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

/**
 * Generate full HTML document for DOCX/PPTX export
 */
export function createDocumentHtml(html: string, fontSize: string = "11pt"): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${baseStyles}
    
    body {
      font-size: 11pt;
      line-height: 1.5;
      padding: 0;
      zoom: 1.0;
    }
    
    h1 { 
      font-size: 20pt; 
      margin: 12pt 0 6pt 0; 
      font-weight: 700; 
      line-height: 1.3;
    }
    
    h2 { 
      font-size: 16pt; 
      margin: 10pt 0 5pt 0; 
      font-weight: 700; 
      line-height: 1.3;
    }
    
    h3 { 
      font-size: 13pt; 
      margin: 8pt 0 4pt 0; 
      font-weight: 600; 
      line-height: 1.3;
    }
    
    p { 
      margin: 0 0 8pt 0; 
      font-size: 11pt; 
      line-height: 1.5;
    }
    
    ul, ol {
      margin: 0 0 8pt 0;
      padding-left: 24pt;
      line-height: 1.5;
    }
    
    li { 
      font-size: 11pt; 
      line-height: 1.5;
      margin: 0 0 4pt 0;
      padding-left: 4pt;
    }
    
    /* Nested lists */
    li ul, li ol {
      margin: 4pt 0;
      padding-left: 20pt;
    }
    
    th, td { 
      font-size: 11pt; 
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div id="content">${html}</div>
</body>
</html>`;
}


/**
 * Generate full HTML document for PDF export WITH client-side pagination
 * This ensures the PDF matches the preview exactly
 */
export function createPdfHtmlWithPagination(title: string, html: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Document"}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/linkedom@0.14.0/dist/linkedom.min.js">
  <style>
    ${baseStyles}
    
    body {
      font-size: 11pt;
      line-height: 1.5;
      padding: 0;
      margin: 0;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Page styling matching preview */
    .page {
      width: 794px;
      min-height: 1123px;
      background: #ffffff;
      padding: 76px 76px 95px 76px;
      box-sizing: border-box;
      position: relative;
      display: block;
      margin: 0 auto;
      page-break-after: always;
      page-break-inside: avoid;
    }
    
    .page-content {
      min-height: 952px;
      box-sizing: border-box;
    }
    
    .document-content {
      max-width: 100%;
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #111111;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    h1 { 
      font-size: 20pt; 
      margin: 12pt 0 6pt 0; 
      font-weight: 700; 
      line-height: 1.3;
    }
    
    h2 { 
      font-size: 16pt; 
      margin: 10pt 0 5pt 0; 
      font-weight: 700; 
      line-height: 1.3;
    }
    
    h3 { 
      font-size: 13pt; 
      margin: 8pt 0 4pt 0; 
      font-weight: 600; 
      line-height: 1.3;
    }
    
    p { 
      margin: 0 0 8pt 0; 
      line-height: 1.5;
      font-size: 11pt;
    }
    
    ul, ol {
      margin: 0 0 8pt 0;
      padding-left: 24pt;
      line-height: 1.5;
    }
    
    li {
      margin: 0 0 4pt 0;
      padding-left: 4pt;
      line-height: 1.5;
      font-size: 11pt;
    }
    
    img {
      display: block;
      margin: 12pt auto;
      max-width: 100%;
    }
    
    /* Images without explicit dimensions use auto height */
    img:not([width]):not([height]) {
      height: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 6pt;
      text-align: left;
      font-size: 11pt;
      line-height: 1.4;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
    
    .list-continuation {
      margin-top: 0 !important;
    }
    
    #preview-container {
      padding: 0;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div id="preview-container"></div>
  
  <script type="module">
    // Inline the pagination logic
    const html = ${JSON.stringify(html)};
    
    // Simple block parser
    function parseHtmlToBlocks(htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString('<div>' + htmlContent + '</div>', 'text/html');
      const container = doc.body.firstChild;
      
      const blocks = [];
      let index = 0;
      
      for (const el of container.children) {
        const tag = el.tagName.toLowerCase();
        
        if (tag === 'p' && !el.textContent.trim()) continue;
        
        let type = 'paragraph';
        if (['h1', 'h2', 'h3'].includes(tag)) type = 'heading';
        else if (tag === 'img') type = 'image';
        else if (tag === 'table') type = 'table';
        else if (tag === 'ul' || tag === 'ol') type = 'list';
        
        blocks.push({
          id: 'block-' + index++,
          type: type,
          html: el.outerHTML
        });
      }
      
      return blocks;
    }
    
    // Simple pagination
    async function paginate() {
      const blocks = parseHtmlToBlocks(html);
      const container = document.getElementById('preview-container');
      // Match Puppeteer's A4 with 20mm/25mm margins
      // A4 height: 842pt, margins: 56.69pt + 70.87pt = 127.56pt
      // Content: 714.44pt × 1.333 = 952px
      const pageHeight = 952;
      const pageWidth = 642; // 481.62pt × 1.333
      
      const pages = [];
      let currentPage = document.createElement('div');
      currentPage.className = 'page';
      let currentContent = document.createElement('div');
      currentContent.className = 'page-content document-content';
      currentPage.appendChild(currentContent);
      pages.push(currentPage);
      
      let currentHeight = 0;
      
      function startNewPage() {
        currentPage = document.createElement('div');
        currentPage.className = 'page';
        currentContent = document.createElement('div');
        currentContent.className = 'page-content document-content';
        currentPage.appendChild(currentContent);
        pages.push(currentPage);
        currentHeight = 0;
      }
      
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const temp = document.createElement('div');
        temp.innerHTML = block.html;
        const element = temp.firstElementChild;
        
        if (!element) continue;
        
        // Measure element with exact content width
        const measurer = document.createElement('div');
        measurer.style.position = 'absolute';
        measurer.style.visibility = 'hidden';
        measurer.style.width = pageWidth + 'px';
        measurer.style.fontFamily = 'Arial, Helvetica, sans-serif';
        measurer.style.fontSize = '11pt';
        measurer.style.lineHeight = '1.5';
        measurer.appendChild(element.cloneNode(true));
        document.body.appendChild(measurer);
        
        // Force layout
        measurer.offsetHeight;
        const height = measurer.getBoundingClientRect().height;
        document.body.removeChild(measurer);
        
        // Heading orphan prevention
        if (block.type === 'heading' && blocks[i + 1]) {
          const minContentHeight = 50;
          const nextBlock = blocks[i + 1];
          
          // Only apply orphan prevention if the next block is NOT an image
          if (nextBlock.type !== 'image') {
            if (currentHeight + height <= pageHeight && 
                currentHeight + height + minContentHeight > pageHeight) {
              startNewPage();
            }
          }
        }
        
        // Check if fits
        if (currentHeight + height > pageHeight) {
          startNewPage();
        }
        
        currentContent.appendChild(element);
        currentHeight += height;
      }
      
      // Remove empty pages
      const nonEmptyPages = pages.filter(page => {
        const content = page.querySelector('.page-content');
        return content && (content.children.length > 0 || content.textContent.trim().length > 0);
      });
      
      // Remove page-break-after from last page
      if (nonEmptyPages.length > 0) {
        const lastPage = nonEmptyPages[nonEmptyPages.length - 1];
        lastPage.style.pageBreakAfter = 'auto';
      }
      
      // Append all pages
      nonEmptyPages.forEach(page => container.appendChild(page));
      
      window.__done = true;
    }
    
    // Wait for fonts and run pagination
    document.fonts.ready.then(() => {
      setTimeout(paginate, 100);
    });
  </script>
</body>
</html>`;
}

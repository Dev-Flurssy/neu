/**
 * Common CSS styles for export documents
 */
const baseStyles = `
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #111;
    margin: 0;
    padding: 20px;
  }
  
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  
  ul, ol {
    margin: 10pt 0;
    padding-left: 25pt;
  }
  
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  
  li { margin: 4pt 0; }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 12pt auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
  }
  
  th, td {
    border: 1px solid #d1d5db;
    padding: 6pt;
    text-align: left;
  }
  
  th {
    background-color: #f3f4f6;
    font-weight: 600;
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
      line-height: 1.6;
    }
    
    h1 { font-size: 24pt; margin: 20pt 0 10pt 0; font-weight: 700; page-break-after: avoid; }
    h2 { font-size: 18pt; margin: 16pt 0 10pt 0; font-weight: 700; page-break-after: avoid; }
    h3 { font-size: 14pt; margin: 12pt 0 8pt 0; font-weight: 600; page-break-after: avoid; }
    
    p { margin: 8pt 0; orphans: 3; widows: 3; }
    
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
    
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
    
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 15pt 0;
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
export function createDocumentHtml(html: string, fontSize: string = "14pt"): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${baseStyles}
    
    body {
      font-size: ${fontSize};
      line-height: 1.6;
    }
    
    h1 { font-size: ${fontSize === "11pt" ? "24pt" : "28pt"}; margin: 20pt 0 10pt 0; font-weight: 700; }
    h2 { font-size: ${fontSize === "11pt" ? "18pt" : "20pt"}; margin: 16pt 0 10pt 0; font-weight: 700; }
    h3 { font-size: ${fontSize === "11pt" ? "14pt" : "16pt"}; margin: 12pt 0 8pt 0; font-weight: 600; }
    
    p { margin: 8pt 0; font-size: ${fontSize}; }
    li { font-size: ${fontSize}; }
    th, td { font-size: ${fontSize}; }
  </style>
</head>
<body>
  <div id="content">${html}</div>
</body>
</html>`;
}

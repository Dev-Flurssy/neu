import { exportPDF } from "./client/pdf";
import { exportDOCX } from "./client/docx";
import { exportPPTX } from "./client/pptx";

export type ExportFormat = "pdf" | "docx" | "pptx";

export async function exportNote(
  format: ExportFormat,
  title: string,
  content: string,
) {
  if (format === "pdf") return exportPDF(title, content);
  if (format === "docx") return exportDOCX(title, content);
  if (format === "pptx") return exportPPTX(title, content);
}

import { getDocument } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export async function extractTextFromPdf(file: File): Promise<string> {
  const data = await file.arrayBuffer();

  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => (isTextItem(it) ? (it as TextItem)?.str : ""))
      .join(" ");
    pages.push(text);
  }

  return normalizeWhitespace(pages.join("\n\n"));
}

function isTextItem(it: unknown) {
  if (it && typeof it === "object" && "str" in it) {
    return it && typeof it.str === "string";
  }
}

function normalizeWhitespace(s: string) {
  return s
    .replace(/\u00A0/g, " ") // nbsp -> space
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export type PdfBasicInfo = {
  name: string;
  type: string;
  extension: string;
  sizeBytes: number;
  numPages: number;
};

export async function getPdfBasicInfo(file: File): Promise<PdfBasicInfo> {
  const buf = await file.arrayBuffer();
  const loadingTask = getDocument({ data: buf });
  const pdf = await loadingTask.promise;

  const info: PdfBasicInfo = {
    name: file.name,
    type: file.type || "application/pdf",
    extension: (file.name.split(".").pop() || "").toLowerCase(),
    sizeBytes: file.size,
    numPages: pdf.numPages,
  };

  await pdf.destroy(); // free resources
  return info;
}

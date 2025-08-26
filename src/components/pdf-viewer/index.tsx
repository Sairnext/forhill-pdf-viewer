import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  FileWrapper,
  DocumentSectionWrapper,
  AsideThumbnailMenu,
  AsideThumbnailButton,
} from "./styled.tsx";

type Props = {
  file: File;
  height?: number | string;
  minPageWidth?: number;
  maxPageWidth?: number;
  thumbWidthPx?: number;
  query?: string | string[];
};

export function PdfPreview({
  file,
  height = "80vh",
  minPageWidth = 560,
  maxPageWidth = 1200,
  thumbWidthPx = 120,
  query,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [activePage, setActivePage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // --- sizing ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      if (w) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = entries[0];
        for (const e of entries) {
          if (e.intersectionRatio > (best?.intersectionRatio ?? 0)) best = e;
        }
        if (best?.target) {
          const idx = Number((best.target as HTMLElement).dataset.pageIndex);
          if (!Number.isNaN(idx)) setActivePage(idx + 1);
        }
      },
      { root, threshold: [0.1, 0.25, 0.5, 0.75, 1] },
    );

    pageRefs.current
      .slice(0, numPages)
      .forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages]);

  const horizontalPadding = 32;
  const fittedWidth = Math.min(
    Math.max(containerWidth - horizontalPadding * 2, 320),
    maxPageWidth,
  );
  const pageWidth = Math.max(fittedWidth, minPageWidth);

  const scrollToPage = (pageIndex: number) => {
    const container = containerRef.current;
    const target = pageRefs.current[pageIndex];
    if (!container || !target) return;
    const top = target.offsetTop - 80;
    container.scrollTo({ top, behavior: "smooth" });
  };

  const terms = useMemo(() => {
    const arr = Array.isArray(query) ? query : query ? [query] : [];
    return arr.map((s) => s.trim()).filter(Boolean);
  }, [query]);

  const highlightRe = useMemo(() => {
    if (!terms.length) return null;
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const parts = terms.map(escape).sort((a, b) => b.length - a.length);
    return new RegExp(`(${parts.join("|")})`, "gi");
  }, [terms]);

  const customTextRenderer = useCallback(
    (item: { str: string }) => {
      if (!highlightRe) return item.str;
      return item.str.replace(
        highlightRe,
        (m) => `<mark class="pdf-hit" data-hit="true">${m}</mark>`,
      );
    },
    [highlightRe],
  );

  useEffect(() => {
    if (!terms.length) return;
    const container = containerRef.current;
    if (!container) return;

    const id = window.setTimeout(() => {
      const first = container.querySelector<HTMLElement>(".pdf-hit");
      if (!first) return;

      const pageEl = first.closest<HTMLElement>("[data-page-index]");
      if (pageEl) {
        const idx = Number(pageEl.dataset.pageIndex);
        if (!Number.isNaN(idx)) setActivePage(idx + 1);
      }

      const firstTop = first.getBoundingClientRect().top;
      const contTop = container.getBoundingClientRect().top;
      container.scrollBy({ top: firstTop - contTop - 40, behavior: "smooth" });

      first.setAttribute("tabindex", "-1");
      try {
        first.focus({ preventScroll: true });
      } catch {
        console.warn("Unable to scroll to a specified section");
      }
    }, 50);

    return () => window.clearTimeout(id);
  }, [terms, numPages, pageWidth]);

  return (
    <FileWrapper style={{ height }}>
      <style>{`
        .pdf-hit {
          all: unset;
          display: inline;
          background-color: rgba(250, 204, 21, 0.45);
          color: inherit;
          font: inherit;
          line-height: inherit;
          white-space: inherit;
          padding: 0;
          margin: 0;
          border: 0;
          box-shadow: inset 0 0 0 0.75px rgba(245, 158, 11, 0.6);
        }
      `}</style>

      <Document
        file={file}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          pageRefs.current = Array(numPages).fill(null);
        }}
        onLoadError={(e) => console.error("PDF load error:", e)}
        loading={<div>Loading PDF…</div>}
      >
        <DocumentSectionWrapper>
          <div
            ref={containerRef}
            style={{ minWidth: minPageWidth, height, overflow: "scroll" }}
          >
            <div>
              {Array.from({ length: numPages }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <div
                    key={pageNumber}
                    ref={(el) => {
                      pageRefs.current[i] = el;
                    }}
                    data-page-index={i}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer
                      customTextRenderer={customTextRenderer}
                      loading={
                        <div style={{ height: Math.round(pageWidth * 1.33) }} />
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <AsideThumbnailMenu>
            {Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <AsideThumbnailButton
                  key={pageNumber}
                  type="button"
                  onClick={() => scrollToPage(i)}
                  title={`Page ${pageNumber}`}
                  data-active={activePage === pageNumber || undefined}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={thumbWidthPx}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={
                      <div
                        style={{
                          width: thumbWidthPx,
                          height: Math.round(thumbWidthPx * 1.33),
                        }}
                      />
                    }
                  />
                </AsideThumbnailButton>
              );
            })}
          </AsideThumbnailMenu>
        </DocumentSectionWrapper>
      </Document>
    </FileWrapper>
  );
}

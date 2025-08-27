import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Document, Page } from "react-pdf";

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
  thumbWidthPx = 120,
  query,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [activePage, setActivePage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const container = containerRef.current;
    const topOffset = 40;

    if (!terms.length || !container) return;

    const id = setTimeout(() => {
      const first = container.querySelector<HTMLElement>(".pdf-hit");
      if (!first) return;

      const pageEl = first.closest<HTMLElement>("[data-page-index]");
      if (pageEl) {
        const idx = Number(pageEl.dataset.pageIndex);
        if (!Number.isNaN(idx)) setActivePage(idx + 1);
      }

      const firstTop = first.getBoundingClientRect().top;
      const contTop = container.getBoundingClientRect().top;
      container.scrollBy({
        top: firstTop - contTop - topOffset,
        behavior: "smooth",
      });

      first.setAttribute("tabindex", "-1");
      try {
        first.focus({ preventScroll: true });
      } catch {
        console.warn("Unable to scroll to a specified section");
      }
    }, 50);

    return () => window.clearTimeout(id);
  }, [terms, numPages]);

  return (
    <>
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
                        width={560}
                        renderAnnotationLayer={false}
                        renderTextLayer
                        customTextRenderer={customTextRenderer}
                        loading={<div>Loading</div>}
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
    </>
  );
}

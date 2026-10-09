import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SparkIcon } from "./Icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalItemsLabel?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  totalItemsLabel,
  className = "",
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>("");

  if (totalPages <= 1) return null;

  // Build page window array with numbers and ellipses
  function getPageNumbers(): (number | string)[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  }

  function handleJumpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages && p !== currentPage) {
      onPageChange(p);
      setJumpPage("");
    }
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={`mt-12 flex flex-col items-center gap-4 ${className}`}
    >
      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className={`dbtn text-xs py-1.5 px-3 inline-flex items-center gap-1 transition ${
            currentPage <= 1 || isLoading
              ? "opacity-40 cursor-not-allowed pointer-events-none"
              : "hover:border-ember hover:text-ember"
          }`}
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">السابق</span>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs opacity-50 select-none font-mono"
              >
                &hellip;
              </span>
            );
          }

          const pageNum = Number(item);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-[34px] h-[34px] px-2 text-xs font-mono transition-colors border rounded-xs flex items-center justify-center ${
                isActive
                  ? "bg-ember text-paper border-ember font-bold shadow-xs"
                  : "border-ink/20 text-ink/80 hover:border-ember hover:text-ember bg-paper"
              } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className={`dbtn text-xs py-1.5 px-3 inline-flex items-center gap-1 transition ${
            currentPage >= totalPages || isLoading
              ? "opacity-40 cursor-not-allowed pointer-events-none"
              : "hover:border-ember hover:text-ember"
          }`}
          title="Next Page"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page Info and Quick Jump */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sc text-ink/70">
        <div>
          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-ember">
              <SparkIcon className="w-3.5 h-3.5 animate-spin" />
              <span>جارٍ تحميل الصفحة...</span>
            </span>
          ) : (
            <span>
              الصفحة <strong>{currentPage}</strong> من <strong>{totalPages}</strong>
              {totalItemsLabel && <span> &bull; {totalItemsLabel}</span>}
            </span>
          )}
        </div>

        {/* Quick Jump Input */}
        {totalPages > 3 && (
          <form onSubmit={handleJumpSubmit} className="inline-flex items-center gap-1.5">
            <label htmlFor="jump-to-page" className="opacity-80">
              الانتقال لصفحة:
            </label>
            <input
              id="jump-to-page"
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder={String(currentPage)}
              className="w-12 py-1 px-1.5 text-center text-xs font-mono border border-ink/30 bg-transparent rounded-xs outline-none focus:border-ember"
            />
            <button
              type="submit"
              disabled={!jumpPage || isLoading}
              className="dbtn text-[11px] py-1 px-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              اذهب
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}

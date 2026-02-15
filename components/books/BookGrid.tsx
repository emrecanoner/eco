"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Book } from "@/lib/utils/types";
import { BookCard } from "./BookCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  filterBooks,
  getBookFilterLabel,
  getRecentlyReadBooks,
  getTopRatedBooks,
  getUniqueGenres,
  getUniqueYears,
  getUniqueAuthors,
  sortBooks,
  type BookFilters,
  type BookSortOption,
} from "@/lib/utils/books";
import { useGridColumns, getCardDirection } from "@/lib/hooks/useGridColumns";

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const shouldScrollToTopOnPageChange = useRef(false);
  const cols = useGridColumns();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCardSelect = useCallback((id: string) => {
    setSelectedCardId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!selectedCardId) return;
    const handleClick = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setSelectedCardId(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCardId(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [selectedCardId]);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "top-rated" | "recently-read" | "readlist" | "reading"
  >("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<BookSortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const ITEMS_PER_PAGE = 16;

  const isToRead = statusFilter === "readlist";
  const isReading = statusFilter === "reading";
  const isSpecialFilter = statusFilter === "top-rated" || statusFilter === "recently-read";
  const isUnratedStatus = isToRead || isReading;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (genreFilter !== "all") count++;
    if (yearFilter !== "all") count++;
    if (minRating > 0) count++;
    if (authorFilter !== "all") count++;
    if (sortBy !== "date-desc") count++;
    return count;
  }, [genreFilter, yearFilter, minRating, authorFilter, sortBy]);

  const sourceBooks = useMemo(() => {
    if (statusFilter === "readlist") return books.filter((b) => b.status === "readlist");
    if (statusFilter === "reading") return books.filter((b) => b.status === "reading");
    return books.filter((b) => b.status === "read");
  }, [books, statusFilter]);

  const uniqueGenres = useMemo(() => getUniqueGenres(sourceBooks), [sourceBooks]);
  const uniqueYears = useMemo(() => getUniqueYears(sourceBooks), [sourceBooks]);
  const uniqueAuthors = useMemo(() => getUniqueAuthors(sourceBooks), [sourceBooks]);

  const filteredAndSorted = useMemo(() => {
    if (statusFilter === "top-rated") {
      return getTopRatedBooks(books, 8);
    }
    if (statusFilter === "recently-read") {
      return getRecentlyReadBooks(books, 8);
    }

    const base =
      statusFilter === "readlist"
        ? books.filter((b) => b.status === "readlist")
        : statusFilter === "reading"
          ? books.filter((b) => b.status === "reading")
          : books.filter((b) => b.status === "read");

    const filters: BookFilters = {
      genres: genreFilter !== "all" ? [genreFilter] : undefined,
      year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
      minRating: !isUnratedStatus && minRating > 0 ? minRating : undefined,
      author: authorFilter !== "all" ? authorFilter : undefined,
    };

    const filtered = filterBooks(base, filters);
    return sortBooks(filtered, sortBy);
  }, [books, statusFilter, genreFilter, yearFilter, authorFilter, minRating, sortBy, isUnratedStatus]);

  useEffect(() => {
    if (!isUnratedStatus) return;
    setMinRating(0);
    setSortBy((prev) => (prev.startsWith("rating-") ? "title-asc" : prev));
  }, [isUnratedStatus]);

  useEffect(() => {
    if (genreFilter !== "all" && !uniqueGenres.includes(genreFilter)) {
      setGenreFilter("all");
    }

    if (yearFilter !== "all") {
      const yearValue = parseInt(yearFilter);
      if (!uniqueYears.includes(yearValue)) {
        setYearFilter("all");
      }
    }

    if (authorFilter !== "all" && !uniqueAuthors.includes(authorFilter)) {
      setAuthorFilter("all");
    }
  }, [genreFilter, yearFilter, authorFilter, uniqueGenres, uniqueYears, uniqueAuthors]);

  useEffect(() => {
    if (isSpecialFilter) setShowFilters(false);
  }, [isSpecialFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genreFilter, yearFilter, authorFilter, minRating, sortBy]);

  const totalPages = isSpecialFilter ? 1 : Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    if (isSpecialFilter) return filteredAndSorted;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage, isSpecialFilter]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSorted.length);

  useEffect(() => {
    if (!shouldScrollToTopOnPageChange.current) return;
    shouldScrollToTopOnPageChange.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (books.length === 0) {
    return <EmptyState message="No books available yet." />;
  }

  return (
    <div>
      <div className="mb-6 space-y-3 sm:mb-8">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 overflow-x-auto -mx-1 pb-2 sm:mx-0 sm:overflow-visible sm:pb-0">
            <div className="flex gap-2 px-1 sm:flex-wrap sm:gap-3 sm:px-0">
              {(["all", "top-rated", "recently-read", "reading", "readlist"] as const).map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none active:border-zinc-900 active:bg-zinc-900 active:text-white dark:active:border-zinc-100 dark:active:bg-zinc-100 dark:active:text-zinc-900 sm:px-4 sm:py-2 sm:text-sm ${
                    statusFilter === filter
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-pressed={statusFilter === filter}
                  aria-label={`Filter by ${filter}`}
                >
                  {getBookFilterLabel(filter)}
                </motion.button>
              ))}
            </div>
          </div>

          {!isSpecialFilter && (
            <motion.button
              onClick={() => setShowFilters((v) => !v)}
              className={`relative flex-shrink-0 rounded-lg border p-2.5 transition-colors duration-200 focus:outline-none sm:p-2 ${
                showFilters
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {showFilters && !isSpecialFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-5 sm:gap-3">
                <SelectDropdown
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Genres" },
                    ...uniqueGenres.map((g) => ({ value: g, label: g })),
                  ]}
                  ariaLabel="Filter by genre"
                />

                <SelectDropdown
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Years" },
                    ...uniqueYears.map((y) => ({ value: y.toString(), label: y.toString() })),
                  ]}
                  ariaLabel="Filter by year"
                />

                <SelectDropdown
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  disabled={isUnratedStatus}
                  options={[
                    { value: 0, label: "All Ratings" },
                    { value: 4, label: "4+ Stars" },
                    { value: 4.5, label: "4.5+ Stars" },
                    { value: 5, label: "5 Stars" },
                  ]}
                  ariaLabel="Filter by minimum rating"
                />

                <SelectDropdown
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Authors" },
                    ...uniqueAuthors.map((a) => ({ value: a, label: a })),
                  ]}
                  ariaLabel="Filter by author"
                />

                <SelectDropdown
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as BookSortOption)}
                  options={[
                    { value: "date-desc", label: "Newest First" },
                    { value: "date-asc", label: "Oldest First" },
                    ...(isUnratedStatus
                      ? []
                      : [
                          { value: "rating-desc" as const, label: "Highest Rated" },
                          { value: "rating-asc" as const, label: "Lowest Rated" },
                        ]),
                    { value: "year-desc", label: "Newest Year" },
                    { value: "year-asc", label: "Oldest Year" },
                    { value: "title-asc", label: "Title A-Z" },
                    { value: "title-desc", label: "Title Z-A" },
                  ]}
                  ariaLabel="Sort books"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredAndSorted.length === 0 ? (
        <EmptyState message="No books match your filters." />
      ) : (
        <>
          <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ overflow: "visible" }}>
            {paginatedBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                isSelected={selectedCardId === book.id}
                direction={getCardDirection(index, cols)}
                onSelect={handleCardSelect}
              />
            ))}
          </div>

          {totalPages > 1 && !isSpecialFilter && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing {startIndex}-{endIndex} of {filteredAndSorted.length}
              </p>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => {
                    shouldScrollToTopOnPageChange.current = true;
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={currentPage === 1}
                  className={`rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold transition-colors focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 sm:px-5 sm:py-2.5 sm:text-sm ${
                    currentPage === 1
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.02 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-label="Previous page"
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </motion.button>
                <motion.button
                  onClick={() => {
                    shouldScrollToTopOnPageChange.current = true;
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className={`rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold transition-colors focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 sm:px-5 sm:py-2.5 sm:text-sm ${
                    currentPage === totalPages
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.02 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-label="Next page"
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

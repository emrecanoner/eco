"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Book } from "@/lib/utils/types";
import { BookCard } from "./BookCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { motion } from "framer-motion";
import {
  filterBooks,
  getBookFilterLabel,
  getRecentlyReadBooks,
  getTopRatedBooks,
  getUniqueGenres,
  getUniqueYears,
  sortBooks,
  type BookFilters,
  type BookSortOption,
} from "@/lib/utils/books";

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const shouldScrollToTopOnPageChange = useRef(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "top-rated" | "recently-read" | "readlist" | "reading"
  >("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<BookSortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 16;

  const isToRead = statusFilter === "readlist";
  const isReading = statusFilter === "reading";
  const isSpecialFilter = statusFilter === "top-rated" || statusFilter === "recently-read";
  const isUnratedStatus = isToRead || isReading;

  const sourceBooks = useMemo(() => {
    if (statusFilter === "readlist") return books.filter((b) => b.status === "readlist");
    if (statusFilter === "reading") return books.filter((b) => b.status === "reading");
    return books.filter((b) => b.status === "read");
  }, [books, statusFilter]);

  const uniqueGenres = useMemo(() => getUniqueGenres(sourceBooks), [sourceBooks]);
  const uniqueYears = useMemo(() => getUniqueYears(sourceBooks), [sourceBooks]);

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
    };

    const filtered = filterBooks(base, filters);
    return sortBooks(filtered, sortBy);
  }, [books, statusFilter, genreFilter, yearFilter, minRating, sortBy, isUnratedStatus]);

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
  }, [genreFilter, yearFilter, uniqueGenres, uniqueYears]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genreFilter, yearFilter, minRating, sortBy]);

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
      <div className="mb-6 space-y-4 sm:mb-8">
        <div className="overflow-x-auto -mx-1 pb-2 sm:mx-0 sm:pb-0">
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

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <SelectDropdown
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            disabled={isSpecialFilter}
            options={[
              { value: "all", label: "All Genres" },
              ...uniqueGenres.map((g) => ({ value: g, label: g })),
            ]}
            ariaLabel="Filter by genre"
          />

          <SelectDropdown
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            disabled={isSpecialFilter}
            options={[
              { value: "all", label: "All Years" },
              ...uniqueYears.map((y) => ({ value: y.toString(), label: y.toString() })),
            ]}
            ariaLabel="Filter by year"
          />

          <SelectDropdown
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            disabled={isUnratedStatus || isSpecialFilter}
            options={[
              { value: 0, label: "All Ratings" },
              { value: 4, label: "4+ Stars" },
              { value: 4.5, label: "4.5+ Stars" },
              { value: 5, label: "5 Stars" },
            ]}
            ariaLabel="Filter by minimum rating"
          />

          <SelectDropdown
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as BookSortOption)}
            disabled={isSpecialFilter}
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
      </div>

      {filteredAndSorted.length === 0 ? (
        <EmptyState message="No books match your filters." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
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


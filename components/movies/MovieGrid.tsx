"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Movie } from "@/lib/utils/types";
import { MovieCard } from "./MovieCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { filterMovies, sortMovies, getUniqueGenres, getUniqueYears, getUniqueDirectors, getTopRated, getRecentlyWatched, getFilterTypeLabel, type MovieFilters, type SortOption } from "@/lib/utils/movies";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  const shouldScrollToTopOnPageChange = useRef(false);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "movie" | "series" | "top-rated" | "recently-watched" | "watchlist"
  >("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [directorFilter, setDirectorFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const ITEMS_PER_PAGE = 16;

  const isWatchlist = typeFilter === "watchlist";
  const isSpecialFilter = typeFilter === "top-rated" || typeFilter === "recently-watched";

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (genreFilter !== "all") count++;
    if (yearFilter !== "all") count++;
    if (minRating > 0) count++;
    if (directorFilter !== "all") count++;
    if (sortBy !== "date-desc") count++;
    return count;
  }, [genreFilter, yearFilter, minRating, directorFilter, sortBy]);

  const sourceMovies = useMemo(() => {
    if (isWatchlist) return movies.filter((m) => m.status === "watchlist");
    return movies.filter((m) => m.status !== "watchlist");
  }, [movies, isWatchlist]);

  const uniqueGenres = useMemo(() => getUniqueGenres(sourceMovies), [sourceMovies]);
  const uniqueYears = useMemo(() => getUniqueYears(sourceMovies), [sourceMovies]);
  const uniqueDirectors = useMemo(() => getUniqueDirectors(sourceMovies), [sourceMovies]);

  const filteredAndSorted = useMemo(() => {
    if (typeFilter === "top-rated") {
      return getTopRated(movies, 8);
    }
    if (typeFilter === "recently-watched") {
      return getRecentlyWatched(movies, 8);
    }
    if (typeFilter === "watchlist") {
      const watchlistMovies = movies.filter((m) => m.status === "watchlist");
      const filtered = filterMovies(watchlistMovies, {
        genres: genreFilter !== "all" ? [genreFilter] : undefined,
        year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
        director: directorFilter !== "all" ? directorFilter : undefined,
      });
      return sortMovies(filtered, sortBy);
    }
    const watchedMovies = movies.filter((m) => m.status !== "watchlist");
    const filters: MovieFilters = {
      type: typeFilter === "all" ? undefined : typeFilter,
      genres: genreFilter !== "all" ? [genreFilter] : undefined,
      year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
      minRating: minRating > 0 ? minRating : undefined,
      director: directorFilter !== "all" ? directorFilter : undefined,
    };
    const filtered = filterMovies(watchedMovies, filters);
    return sortMovies(filtered, sortBy);
  }, [movies, typeFilter, genreFilter, yearFilter, directorFilter, minRating, sortBy]);

  useEffect(() => {
    if (!isWatchlist) return;
    setMinRating(0);
    setSortBy((prev) => (prev.startsWith("rating-") ? "title-asc" : prev));
  }, [isWatchlist]);

  useEffect(() => {
    if (!isWatchlist) return;

    if (genreFilter !== "all" && !uniqueGenres.includes(genreFilter)) {
      setGenreFilter("all");
    }

    if (yearFilter !== "all") {
      const yearValue = parseInt(yearFilter);
      if (!uniqueYears.includes(yearValue)) {
        setYearFilter("all");
      }
    }

    if (directorFilter !== "all" && !uniqueDirectors.includes(directorFilter)) {
      setDirectorFilter("all");
    }
  }, [isWatchlist, genreFilter, yearFilter, directorFilter, uniqueGenres, uniqueYears, uniqueDirectors]);

  useEffect(() => {
    if (isSpecialFilter) setShowFilters(false);
  }, [isSpecialFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, genreFilter, yearFilter, directorFilter, minRating, sortBy]);

  const totalPages = isSpecialFilter ? 1 : Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const paginatedMovies = useMemo(() => {
    if (isSpecialFilter) {
      return filteredAndSorted;
    }
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

  if (movies.length === 0) {
    return <EmptyState message="No movies or shows available yet." />;
  }

  return (
    <div>
      <div className="mb-6 space-y-3 sm:mb-8">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 overflow-x-auto -mx-1 pb-2 sm:mx-0 sm:overflow-visible sm:pb-0">
            <div className="flex gap-2 px-1 sm:flex-wrap sm:gap-3 sm:px-0">
              {(["all", "movie", "series", "top-rated", "recently-watched", "watchlist"] as const).map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setTypeFilter(filterType)}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none active:border-zinc-900 active:bg-zinc-900 active:text-white dark:active:border-zinc-100 dark:active:bg-zinc-100 dark:active:text-zinc-900 sm:px-4 sm:py-2 sm:text-sm ${
                    typeFilter === filterType
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-pressed={typeFilter === filterType}
                  aria-label={`Filter by ${filterType}`}
                >
                  {getFilterTypeLabel(filterType)}
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
                    ...uniqueGenres.map((genre) => ({ value: genre, label: genre })),
                  ]}
                  ariaLabel="Filter by genre"
                />

                <SelectDropdown
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Years" },
                    ...uniqueYears.map((year) => ({ value: year.toString(), label: year.toString() })),
                  ]}
                  ariaLabel="Filter by year"
                />

                <SelectDropdown
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  disabled={isWatchlist}
                  options={[
                    { value: 0, label: "All Ratings" },
                    { value: 4, label: "4+ Stars" },
                    { value: 4.5, label: "4.5+ Stars" },
                    { value: 5, label: "5 Stars" },
                  ]}
                  ariaLabel="Filter by minimum rating"
                />

                <SelectDropdown
                  value={directorFilter}
                  onChange={(e) => setDirectorFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Directors" },
                    ...uniqueDirectors.map((d) => ({ value: d, label: d })),
                  ]}
                  ariaLabel="Filter by director"
                />

                <SelectDropdown
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  options={[
                    { value: "date-desc", label: "Newest First" },
                    { value: "date-asc", label: "Oldest First" },
                    ...(isWatchlist
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
                  ariaLabel="Sort movies"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredAndSorted.length === 0 ? (
        <EmptyState message="No movies match your filters." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>

          {totalPages > 1 && typeFilter !== "top-rated" && typeFilter !== "recently-watched" && (
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

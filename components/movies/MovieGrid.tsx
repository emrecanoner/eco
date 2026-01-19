"use client";

import { useState } from "react";
import { Movie } from "@/lib/utils/types";
import { MovieCard } from "./MovieCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { motion } from "framer-motion";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  const [filter, setFilter] = useState<"all" | "movie" | "series">("all");

  const filteredMovies =
    filter === "all"
      ? movies
      : movies.filter((movie) => movie.type === filter);

  if (movies.length === 0) {
    return <EmptyState message="No movies or shows available yet." />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
        {(["all", "movie", "series"] as const).map((filterType) => (
          <motion.button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus-ring sm:px-4 sm:py-2 sm:text-sm ${
              filter === filterType
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-pressed={filter === filterType}
            aria-label={`Filter by ${filterType}`}
          >
            {filterType === "all"
              ? "All"
              : filterType === "movie"
              ? "Movies"
              : "Series"}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
}


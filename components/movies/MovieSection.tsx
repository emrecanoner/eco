"use client";

import { Movie } from "@/lib/utils/types";
import { MovieCard } from "./MovieCard";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  emptyMessage?: string;
}

export function MovieSection({ title, movies, emptyMessage }: MovieSectionProps) {
  if (movies.length === 0 && emptyMessage) {
    return null;
  }

  return (
    <div className="mb-12 sm:mb-16">
      <h2 className="mb-6 text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
}


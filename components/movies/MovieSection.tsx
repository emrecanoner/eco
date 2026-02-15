"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Movie } from "@/lib/utils/types";
import { MovieCard } from "./MovieCard";
import { useGridColumns, getCardDirection } from "@/lib/hooks/useGridColumns";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  emptyMessage?: string;
}

export function MovieSection({ title, movies, emptyMessage }: MovieSectionProps) {
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

  if (movies.length === 0 && emptyMessage) {
    return null;
  }

  return (
    <div className="mb-12 sm:mb-16">
      <h2 className="mb-6 text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ overflow: "visible" }}>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            isSelected={selectedCardId === movie.id}
            direction={getCardDirection(index, cols)}
            onSelect={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
}


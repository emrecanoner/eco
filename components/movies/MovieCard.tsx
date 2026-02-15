"use client";

import { Movie } from "@/lib/utils/types";
import { Card } from "@/components/ui/Card";
import { CardDetailPanel } from "@/components/ui/CardDetailPanel";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  index: number;
  isSelected: boolean;
  direction: "left" | "right";
  onSelect: (id: string) => void;
}

export function MovieCard({ movie, index, isSelected, direction, onSelect }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(movie.id)}
      className="relative cursor-pointer"
      style={{ overflow: "visible" }}
    >
      <Card className="overflow-hidden p-0">
        {movie.poster && movie.poster.startsWith("http") ? (
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            {!isSelected && movie.rating > 0 && (
              <div className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-1 text-xs font-bold text-white">
                ⭐ {movie.rating.toFixed(1)}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[2/3] w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{movie.title}</span>
          </div>
        )}
      </Card>

      <div style={{ pointerEvents: isSelected ? "auto" : "none" }}>
        <AnimatePresence>
          {isSelected && (
            <CardDetailPanel
              direction={direction}
              title={movie.title}
              subtitle={movie.type === "series" ? "Series" : "Movie"}
              rating={movie.rating}
              details={[
                { label: "Director", value: movie.director },
                { label: "Year", value: movie.year },
              ]}
              genres={movie.genre}
              onClose={() => onSelect(movie.id)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

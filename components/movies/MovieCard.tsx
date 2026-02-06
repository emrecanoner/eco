"use client";

import { useState } from "react";
import { Movie } from "@/lib/utils/types";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { renderStars } from "@/lib/utils/movies";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="overflow-hidden p-0">
        {movie.poster && movie.poster.startsWith("http") ? (
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-zinc-900/80 p-4 flex flex-col justify-end"
                >
                  <h3 className="text-base font-semibold text-white mb-2 sm:text-lg">{movie.title}</h3>
                  {movie.rating > 0 && (
                    <div className="mb-2 text-xs text-yellow-300 sm:text-sm">
                      {renderStars(movie.rating)}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.rating > 0 && <span>{movie.rating.toFixed(1)}/5</span>}
                    {movie.genre && (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5">{movie.genre}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!isHovered && movie.rating > 0 && (
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
    </motion.div>
  );
}


"use client";

import { useState } from "react";
import { Book } from "@/lib/utils/types";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { renderStars } from "@/lib/utils/ratings";

interface BookCardProps {
  book: Book;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
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
        {book.cover && book.cover.startsWith("http") ? (
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={book.cover}
              alt={book.title}
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
                  className="absolute inset-0 bg-zinc-900/80"
                >
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <h3 className="mb-2 text-sm font-semibold text-white sm:text-base">{book.title}</h3>

                    <div className="mb-2 text-[10px] text-zinc-300 sm:text-xs">
                      {book.author}
                    </div>

                    {book.status === "read" && book.rating > 0 && (
                      <div className="mb-2 text-[10px] text-yellow-300 sm:text-xs">
                        {renderStars(book.rating)}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-[10px] text-zinc-300 sm:text-xs">
                      {book.year && <span>{book.year}</span>}
                      {book.status === "read" && book.rating > 0 && <span>{book.rating.toFixed(1)}/5</span>}
                      {book.pages && <span>{book.pages} pages</span>}
                    </div>

                    {book.genre && (
                      <div className="mt-2 text-[10px] text-zinc-300 sm:text-xs">
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5">{book.genre}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {book.status === "read" && book.rating > 0 && !isHovered && (
              <div className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-1 text-xs font-bold text-white">
                ⭐ {book.rating.toFixed(1)}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[2/3] w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{book.title}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}


"use client";

import { Movie } from "@/lib/utils/types";
import { calculateMovieStats } from "@/lib/utils/movies";
import { Card } from "@/components/ui/Card";
import { RevealTruncatedText } from "@/components/ui/RevealTruncatedText";
import { motion } from "framer-motion";

interface MovieStatsProps {
  movies: Movie[];
}

export function MovieStats({ movies }: MovieStatsProps) {
  const stats = calculateMovieStats(movies);

  if (movies.length === 0) {
    return null;
  }

  const statCards = [
    {
      label: "Total",
      value: stats.total.toString(),
      subtitle: `${stats.movies} movies, ${stats.series} series`,
    },
    {
      label: "Average Rating",
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—",
      subtitle: "out of 5",
    },
    {
      label: "Top Genre",
      value: stats.topGenres[0]?.genre || "—",
      subtitle: stats.topGenres[0] ? `${stats.topGenres[0].count} watched` : "",
    },
    {
      label: "Top Director",
      value: stats.topDirectors[0]?.director || "—",
      subtitle: stats.topDirectors[0] ? `${stats.topDirectors[0].count} watched` : "",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="h-full p-4 sm:p-6">
              <p className="mb-1 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                {stat.label}
              </p>
              <div className="min-w-0 text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl leading-tight">
                {stat.label === "Top Genre" || stat.label === "Top Director" ? (
                  <RevealTruncatedText text={stat.value} />
                ) : (
                  <span>{stat.value}</span>
                )}
              </div>
              {stat.subtitle && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  {stat.subtitle}
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


"use client";

import { motion } from "framer-motion";

interface DetailItem {
  label: string;
  value?: string | number | null;
}

interface CardDetailPanelProps {
  direction: "left" | "right";
  title: string;
  subtitle?: string;
  details: DetailItem[];
  genres?: string[];
  rating?: number;
  onClose: () => void;
}

export function CardDetailPanel({
  direction,
  title,
  subtitle,
  details,
  genres,
  rating,
  onClose,
}: CardDetailPanelProps) {
  const isRight = direction === "right";

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? -12 : 12, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRight ? -12 : 12, scale: 0.96 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className={`absolute top-0 z-30 h-full w-[calc(100%-4px)] ${
        isRight ? "left-[calc(100%+4px)]" : "right-[calc(100%+4px)]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Close detail panel"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3 className="pr-6 text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-base">
          {title}
        </h3>

        {subtitle && (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:text-xs">
            {subtitle}
          </span>
        )}

        {/* Rating */}
        {rating !== undefined && rating > 0 && (
          <div className="mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 sm:text-sm">
            ⭐ {rating.toFixed(1)}
          </div>
        )}

        {/* Details */}
        <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
          {details
            .filter((d) => d.value !== undefined && d.value !== null && d.value !== "")
            .map((d) => (
              <div key={d.label} className="flex items-baseline gap-1.5 text-[10px] sm:text-xs">
                <span className="shrink-0 text-zinc-400 dark:text-zinc-500">{d.label}</span>
                <span className="text-zinc-700 dark:text-zinc-300">{d.value}</span>
              </div>
            ))}
        </div>

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2 sm:gap-1.5 sm:pt-3">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 sm:text-[10px]"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}


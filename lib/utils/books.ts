import { Book } from "./types";

export interface BookStats {
  total: number;
  averageRating: number;
  topRated: Book[];
  topGenres: Array<{ genre: string; count: number }>;
}

export interface BookFilters {
  genres?: string[];
  year?: number;
  minRating?: number;
}

export type BookSortOption =
  | "date-desc"
  | "date-asc"
  | "rating-desc"
  | "rating-asc"
  | "year-desc"
  | "year-asc"
  | "title-asc"
  | "title-desc";

function isRead(book: Book): boolean {
  return (book.status ?? "read") === "read";
}

function dateValue(value: string): number {
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function calculateBookStats(books: Book[]): BookStats {
  const readBooks = books.filter(isRead);
  if (readBooks.length === 0) {
    return {
      total: 0,
      averageRating: 0,
      topRated: [],
      topGenres: [],
    };
  }

  const ratings = readBooks.filter((b) => b.rating > 0).map((b) => b.rating);
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

  const topRated = [...readBooks]
    .filter((b) => b.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const genreCount: Record<string, number> = {};
  readBooks.forEach((b) => {
    if (b.genre) {
      genreCount[b.genre] = (genreCount[b.genre] || 0) + 1;
    }
  });

  const topGenres = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: readBooks.length,
    averageRating,
    topRated,
    topGenres,
  };
}

export function filterBooks(books: Book[], filters: BookFilters): Book[] {
  let filtered = [...books];

  if (filters.genres && filters.genres.length > 0) {
    filtered = filtered.filter((b) => b.genre && filters.genres!.includes(b.genre));
  }

  if (filters.year) {
    filtered = filtered.filter((b) => b.year === filters.year);
  }

  if (filters.minRating !== undefined) {
    filtered = filtered.filter((b) => b.rating >= filters.minRating!);
  }

  return filtered;
}

export function sortBooks(books: Book[], sortBy: BookSortOption): Book[] {
  const sorted = [...books];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort((a, b) => dateValue(b.readDate) - dateValue(a.readDate));
    case "date-asc":
      return sorted.sort((a, b) => dateValue(a.readDate) - dateValue(b.readDate));
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "rating-asc":
      return sorted.sort((a, b) => a.rating - b.rating);
    case "year-desc":
      return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    case "year-asc":
      return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

export function getTopRatedBooks(books: Book[], limit = 8): Book[] {
  return [...books]
    .filter(isRead)
    .filter((b) => b.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getRecentlyReadBooks(books: Book[], limit = 8): Book[] {
  return [...books]
    .filter(isRead)
    .sort((a, b) => dateValue(b.readDate) - dateValue(a.readDate))
    .slice(0, limit);
}

export function getUniqueGenres(books: Book[]): string[] {
  const genres = new Set<string>();
  books.forEach((b) => {
    if (b.genre) genres.add(b.genre);
  });
  return Array.from(genres).sort();
}

export function getUniqueYears(books: Book[]): number[] {
  const years = new Set<number>();
  books.forEach((b) => {
    if (b.year) years.add(b.year);
  });
  return Array.from(years).sort((a, b) => b - a);
}

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  "top-rated": "Top Rated",
  "recently-read": "Recently Read",
  readlist: "Readlist",
  reading: "Reading",
};

export function getBookFilterLabel(filter: string): string {
  return FILTER_LABELS[filter] || filter;
}



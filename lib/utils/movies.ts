import { Movie } from "./types";

export interface MovieStats {
  total: number;
  movies: number;
  series: number;
  averageRating: number;
  byYear: Record<number, number>;
  topGenres: Array<{ genre: string; count: number }>;
  topDirectors: Array<{ director: string; count: number }>;
}

export interface MovieFilters {
  type?: "all" | "movie" | "series";
  genres?: string[];
  year?: number;
  minRating?: number;
  director?: string;
}

export type SortOption = 
  | "date-desc" 
  | "date-asc" 
  | "rating-desc" 
  | "rating-asc" 
  | "year-desc" 
  | "year-asc"
  | "title-asc"
  | "title-desc";

function isWatched(movie: Movie): boolean {
  return (movie.status ?? "watched") === "watched";
}

export function calculateMovieStats(movies: Movie[]): MovieStats {
  const watchedMovies = movies.filter(isWatched);
  if (watchedMovies.length === 0) {
    return {
      total: 0,
      movies: 0,
      series: 0,
      averageRating: 0,
      byYear: {},
      topGenres: [],
      topDirectors: [],
    };
  }

  const moviesOnly = watchedMovies.filter((m) => m.type === "movie");
  const seriesOnly = watchedMovies.filter((m) => m.type === "series");

  const ratings = watchedMovies.filter((m) => m.rating > 0).map((m) => m.rating);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  const byYear: Record<number, number> = {};
  watchedMovies.forEach((movie) => {
    if (movie.year) {
      byYear[movie.year] = (byYear[movie.year] || 0) + 1;
    }
  });

  const genreCount: Record<string, number> = {};
  watchedMovies.forEach((movie) => {
    if (movie.genre) {
      movie.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }
  });

  const topGenres = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const directorCount: Record<string, number> = {};
  watchedMovies.forEach((movie) => {
    if (movie.director) {
      directorCount[movie.director] = (directorCount[movie.director] || 0) + 1;
    }
  });

  const topDirectors = Object.entries(directorCount)
    .map(([director, count]) => ({ director, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: watchedMovies.length,
    movies: moviesOnly.length,
    series: seriesOnly.length,
    averageRating,
    byYear,
    topGenres,
    topDirectors,
  };
}

export function filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
  let filtered = [...movies];

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((m) => m.type === filters.type);
  }

  if (filters.genres && filters.genres.length > 0) {
    filtered = filtered.filter((m) =>
      m.genre && m.genre.some((g) => filters.genres!.includes(g))
    );
  }

  if (filters.year) {
    filtered = filtered.filter((m) => m.year === filters.year);
  }

  if (filters.minRating !== undefined) {
    filtered = filtered.filter((m) => m.rating >= filters.minRating!);
  }

  if (filters.director) {
    filtered = filtered.filter((m) => m.director === filters.director);
  }

  return filtered;
}

export function sortMovies(movies: Movie[], sortBy: SortOption): Movie[] {
  const sorted = [...movies];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort((a, b) => 
        new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime()
      );
    case "date-asc":
      return sorted.sort((a, b) => 
        new Date(a.watchedDate).getTime() - new Date(b.watchedDate).getTime()
      );
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

export function getTopRated(movies: Movie[], limit = 10): Movie[] {
  return [...movies]
    .filter(isWatched)
    .filter((m) => m.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getRecentlyWatched(movies: Movie[], limit = 10): Movie[] {
  return [...movies]
    .filter(isWatched)
    .sort((a, b) => 
      new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime()
    )
    .slice(0, limit);
}

export function getUniqueGenres(movies: Movie[]): string[] {
  const genres = new Set<string>();
  movies.forEach((movie) => {
    if (movie.genre) {
      movie.genre.forEach((g) => genres.add(g));
    }
  });
  return Array.from(genres).sort();
}

export function getUniqueYears(movies: Movie[]): number[] {
  const years = new Set<number>();
  movies.forEach((movie) => {
    if (movie.year) {
      years.add(movie.year);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
}

export function getUniqueDirectors(movies: Movie[]): string[] {
  const directors = new Set<string>();
  movies.forEach((movie) => {
    if (movie.director) {
      directors.add(movie.director);
    }
  });
  return Array.from(directors).sort();
}

const FILTER_TYPE_LABELS: Record<string, string> = {
  all: "All",
  movie: "Movies",
  series: "Series",
  "top-rated": "Top Rated",
  "recently-watched": "Recently Watched",
  watchlist: "Watchlist",
};

export function getFilterTypeLabel(type: string): string {
  return FILTER_TYPE_LABELS[type] || type;
}

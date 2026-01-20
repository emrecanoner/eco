import { getMovies } from "@/lib/notion/movies";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function MoviesPage() {
  const movies = await getMovies();

  if (!movies || movies.length === 0) {
    return (
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Movies.
          </h1>
          <EmptyState message="No movies or shows available yet." />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 sm:py-16 lg:py-20">
        <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Movies.
        </h1>
        <MovieGrid movies={movies} />
      </div>
    </Container>
  );
}


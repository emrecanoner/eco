import { getBooks } from "@/lib/notion/books";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await getBooks();

  if (!books || books.length === 0) {
    return (
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Books.
          </h1>
          <EmptyState message="No books available yet." />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 sm:py-16 lg:py-20">
        <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Books.
        </h1>
        <BookGrid books={books} />
      </div>
    </Container>
  );
}


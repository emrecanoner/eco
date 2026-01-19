import { getBlogPosts } from "@/lib/notion/blog";
import { BlogList } from "@/components/blog/BlogList";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  if (!posts || posts.length === 0) {
    return (
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Blog.
          </h1>
          <EmptyState message="No blog posts available yet." />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 sm:py-16 lg:py-20">
        <h1 className="mb-12 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Blog.
        </h1>
        <BlogList posts={posts} />
      </div>
    </Container>
  );
}


import { BlogPost } from "@/lib/utils/types";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return <EmptyState message="No blog posts available yet." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}


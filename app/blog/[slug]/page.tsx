import { getBlogPostBySlug, getBlogPosts } from "@/lib/notion/blog";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function renderBlocks(blocks: BlockObjectResponse[]): React.ReactNode {
  const elements: React.ReactNode[] = [];
  let currentList: BlockObjectResponse[] = [];
  let listType: "bulleted" | "numbered" | null = null;

  blocks.forEach((block) => {
    if (block.type === "bulleted_list_item") {
      if (listType !== "bulleted") {
        if (currentList.length > 0) {
          elements.push(renderList(currentList, listType!));
          currentList = [];
        }
        listType = "bulleted";
      }
      currentList.push(block);
    } else if (block.type === "numbered_list_item") {
      if (listType !== "numbered") {
        if (currentList.length > 0) {
          elements.push(renderList(currentList, listType!));
          currentList = [];
        }
        listType = "numbered";
      }
      currentList.push(block);
    } else {
      if (currentList.length > 0) {
        elements.push(renderList(currentList, listType!));
        currentList = [];
        listType = null;
      }
      elements.push(renderBlock(block));
    }
  });

  if (currentList.length > 0) {
    elements.push(renderList(currentList, listType!));
  }

  return elements;
}

function renderList(blocks: BlockObjectResponse[], type: "bulleted" | "numbered") {
  const ListTag = type === "bulleted" ? "ul" : "ol";
  return (
    <ListTag key={`list-${blocks[0].id}`} className="mb-4 ml-6">
      {blocks.map((block) => {
        if (block.type === "bulleted_list_item") {
          return (
            <li
              key={block.id}
              className="mb-2 text-zinc-700 dark:text-zinc-300"
            >
              {block.bulleted_list_item.rich_text.map((text, i) => (
                <span key={i}>{text.plain_text}</span>
              ))}
            </li>
          );
        }
        if (block.type === "numbered_list_item") {
          return (
            <li
              key={block.id}
              className="mb-2 text-zinc-700 dark:text-zinc-300"
            >
              {block.numbered_list_item.rich_text.map((text, i) => (
                <span key={i}>{text.plain_text}</span>
              ))}
            </li>
          );
        }
        return null;
      })}
    </ListTag>
  );
}

function renderBlock(block: BlockObjectResponse): React.ReactNode {
  switch (block.type) {
    case "paragraph":
      const hasContent = block.paragraph.rich_text.length > 0;
      if (!hasContent) return <br key={block.id} className="mb-4" />;
      return (
        <p
          key={block.id}
          className="mb-4 text-zinc-700 dark:text-zinc-300"
        >
          {block.paragraph.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </p>
      );
    case "heading_1":
      return (
        <h1
          key={block.id}
          className="mb-4 mt-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100"
        >
          {block.heading_1.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </h1>
      );
    case "heading_2":
      return (
        <h2
          key={block.id}
          className="mb-4 mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {block.heading_2.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </h2>
      );
    case "heading_3":
      return (
        <h3
          key={block.id}
          className="mb-4 mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {block.heading_3.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </h3>
      );
    case "code":
      return (
        <pre
          key={block.id}
          className="mb-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800"
        >
          <code className="text-sm text-zinc-900 dark:text-zinc-100">
            {block.code.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </code>
        </pre>
      );
    case "quote":
      return (
        <blockquote
          key={block.id}
          className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        >
          {block.quote.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </blockquote>
      );
    default:
      return null;
  }
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Container>
        <article className="py-16">
          <Card>
            {post.coverImage && post.coverImage.startsWith("http") && (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              {post.title}
            </h1>
            <div className="mb-8 text-sm text-zinc-500 dark:text-zinc-500">
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {post.excerpt && (
              <p className="mb-8 text-xl text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {post.content && renderBlocks(post.content as BlockObjectResponse[])}
            </div>
          </Card>
        </article>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}


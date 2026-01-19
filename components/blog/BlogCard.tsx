"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/utils/types";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  if (!post.slug) {
    return null;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="block focus-ring group">
        <Card className="overflow-hidden">
          <div className="space-y-4">
            {post.coverImage && post.coverImage.startsWith("http") && (
              <div className="relative aspect-video w-full max-h-48 overflow-hidden rounded-lg sm:max-h-none">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div>
              <h2 className="mb-2 text-lg font-semibold tracking-normal text-zinc-900 transition-colors group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-zinc-300 sm:text-xl">
                {post.title}
              </h2>
              <div className="mb-3 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span>
                  {new Date(post.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {post.excerpt && (
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.article>
  );
}


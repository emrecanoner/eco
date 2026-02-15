"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

const portfolioItems = [
  {
    href: "/blog",
    label: "Blog",
    description: "Articles and thoughts",
  },
  {
    href: "/movies",
    label: "Movies & Shows",
    description: "What I've watched",
  },
  {
    href: "/books",
    label: "Books",
    description: "What I've read",
  },
];

export default function PortfolioPage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100dvh-12rem)] items-center justify-center py-12 sm:min-h-[calc(100dvh-14rem)] sm:py-16">
        <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={item.href} className="block">
                <Card className="group transition-all hover:border-zinc-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 sm:text-xl">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}


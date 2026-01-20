import { revalidatePath } from "next/cache";

const PAGES_TO_REVALIDATE = [
  { path: "/", type: "page" as const },
  { path: "/movies", type: "page" as const },
  { path: "/books", type: "page" as const },
  { path: "/blog", type: "page" as const },
  { path: "/blog", type: "layout" as const },
  { path: "/portfolio", type: "page" as const },
  { path: "/contact", type: "page" as const },
] as const;

export function revalidateAllPages() {
  PAGES_TO_REVALIDATE.forEach(({ path, type }) => {
    revalidatePath(path, type);
  });
}


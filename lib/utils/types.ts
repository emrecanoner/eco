import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: (BlockObjectResponse | PartialBlockObjectResponse)[] | null;
  publishedDate: string;
  status: "published" | "draft";
  excerpt?: string;
  coverImage?: string;
}

export interface Movie {
  id: string;
  title: string;
  type: "movie" | "series";
  status: "watched" | "watchlist";
  rating: number;
  watchedDate: string;
  poster?: string;
  year?: number;
  genre?: string;
  director?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: "read" | "readlist" | "reading";
  rating: number;
  readDate: string;
  cover?: string;
  genre?: string;
  pages?: number;
  year?: number;
}

export interface Settings {
  title: string;
  favicon?: string;
  siteName: string;
  description: string;
  metaTags?: string;
}


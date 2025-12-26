import { Author } from "./authors";

// Input type for creating a post - omits DB-generated fields
export type CreatePostInput = Omit<
  Post,
  "id" | "slug" | "createdAt" | "updatedAt"
>;
// Domain JSON type - no Prisma dependencies
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Full Post type with all DB fields
export type Post = {
  id: string;
  title: string;
  content: JsonValue; // Editor JSON content
  contentHtml: string; // Derived HTML cache for fast rendering (can be empty)
  slug: string;
  authorId: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PostDetails = Post & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
  };
  categories: { id: string; label: string; slug: string }[];
  tags: { id: string; name: string }[];
};

export type PostPreview = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "coverImage"
  | "publishedAt"
  | "createdAt"
  | "status"
>;

export type PostListItem = PostPreview & { author: Author };

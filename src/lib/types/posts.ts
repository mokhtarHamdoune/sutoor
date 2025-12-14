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
  slug: string;
  authorId: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

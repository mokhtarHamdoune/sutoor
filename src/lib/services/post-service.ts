import { prisma } from "@/db";
import BaseService from "./base-service";
import { generateSlug } from "../utils";
import { InputJsonValue as PrismaJsonValue } from "@prisma/client/runtime/library";
import { JsonValue } from "../shared/types";

// Full Post type with all DB fields
export type Post = {
  id: string;
  title: string;
  content: JsonValue; // Editor JSON content
  slug: string;
  authorId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Input type for creating a post - omits DB-generated fields
export type CreatePostInput = Omit<
  Post,
  "id" | "slug" | "createdAt" | "updatedAt"
>;

class PostService implements BaseService<Post> {
  async save(input: CreatePostInput): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        ...input,
        content: input.content as PrismaJsonValue, // Cast to satisfy Prisma's JsonValue type
        slug: generateSlug(input.title),
      },
    });
    return { ...post, content: post.content as JsonValue };
  }

  async getById(id: string): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }

  async getBy(filter: Partial<Post>): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, item: Partial<Post>): Promise<Post> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default PostService;

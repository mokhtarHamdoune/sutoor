import { prisma } from "@/db";
import BaseRepository from "./base-repository";
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

class PostRepository implements BaseRepository<Post> {
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
  // eslint-disable-next-line
  async getById(id: string): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }

  async getBy(filter: Partial<Omit<Post, "content">>): Promise<Post[]> {
    return await prisma.post
      .findMany({
        where: {
          ...filter,
        },
      })
      .then((posts) =>
        posts.map((post) => ({
          ...post,
          content: post.content as JsonValue,
        }))
      );
  }
  // eslint-disable-next-line
  async update(id: string, item: Partial<Post>): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getBySlug(slug: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
    });
    if (!post) {
      return null;
    }
    return { ...post, content: post.content as JsonValue };
  }
}

export default PostRepository;

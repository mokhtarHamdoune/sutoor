import { prisma } from "@/db";
import BaseRepository from "./base-repository";
import { generateSlug } from "../utils";
import { InputJsonValue as PrismaJsonValue } from "@prisma/client/runtime/client.js";
import { JsonValue } from "../shared/types";

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

// Input type for creating a post - omits DB-generated fields
export type CreatePostInput = Omit<
  Post,
  "id" | "slug" | "createdAt" | "updatedAt"
>;

class PostRepository implements BaseRepository<Post> {
  async save(input: CreatePostInput & { categoryId?: string }): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        title: input.title,
        content: input.content as PrismaJsonValue,
        slug: generateSlug(input.title),
        authorId: input.authorId,
        status: input.status,
        publishedAt: input.publishedAt,
        coverImage: input.coverImage,
        ...(input.categoryId && {
          categories: {
            connect: { id: input.categoryId },
          },
        }),
      },
      include: {
        categories: {
          select: { id: true, label: true, slug: true },
        },
      },
    });
    return { ...post, content: post.content as JsonValue };
  }

  async getById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    return { ...post, content: post.content as JsonValue };
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

  async update(
    id: string,
    item: Partial<Post> & { categoryId?: string }
  ): Promise<Post> {
    const updateData: Record<string, unknown> = {};

    // Handle content type conversion if present
    if (item.content !== undefined) {
      updateData.content = item.content as PrismaJsonValue;
    }

    // If title is being updated, regenerate the slug
    if (item.title) {
      updateData.slug = generateSlug(item.title);
      updateData.title = item.title;
    }

    // Handle other fields
    if (item.status) updateData.status = item.status;
    if (item.publishedAt !== undefined)
      updateData.publishedAt = item.publishedAt;
    if (item.coverImage !== undefined) updateData.coverImage = item.coverImage;

    // Handle category connection
    if (item.categoryId !== undefined) {
      if (item.categoryId) {
        // Connect new category (will replace existing)
        updateData.categories = {
          set: [], // Disconnect all
          connect: { id: item.categoryId }, // Connect new one
        };
      } else {
        // Disconnect all categories
        updateData.categories = { set: [] };
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          select: { id: true, label: true, slug: true },
        },
      },
    });

    return { ...post, content: post.content as JsonValue };
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }

  async getBySlug(slug: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categories: {
          select: { id: true, label: true, slug: true },
        },
      },
    });
    if (!post) {
      return null;
    }
    return { ...post, content: post.content as JsonValue };
  }

  async listAuthorPostPreviews(
    authorId: string,
    options?: {
      take?: number;
      skip?: number;
      statuses?: Array<Post["status"]>;
      orderBy?: "createdAt" | "publishedAt";
      orderDirection?: "asc" | "desc";
    }
  ): Promise<PostPreview[]> {
    const take = options?.take ?? 12;
    const skip = options?.skip ?? 0;
    const orderBy = options?.orderBy ?? "createdAt";
    const orderDirection = options?.orderDirection ?? "desc";

    return prisma.post.findMany({
      where: {
        authorId,
        ...(options?.statuses?.length
          ? {
              status: { in: options.statuses },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
      take,
      skip,
    });
  }

  async countAuthorPosts(
    authorId: string,
    options?: {
      statuses?: Array<Post["status"]>;
    }
  ): Promise<number> {
    return prisma.post.count({
      where: {
        authorId,
        ...(options?.statuses?.length
          ? {
              status: { in: options.statuses },
            }
          : {}),
      },
    });
  }
}

export default PostRepository;

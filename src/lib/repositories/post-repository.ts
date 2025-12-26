import { prisma } from "@/db";
import { generateSlug } from "../utils";
import { InputJsonValue as PrismaJsonValue } from "@prisma/client/runtime/client.js";
import {
  Post,
  PostDetails,
  JsonValue,
  PostListItem,
  CreatePostInput,
  PostPreview,
} from "../types/posts";
// TODO: implement post details service where we return the post along with the categor plus the tags ,
// basiclay every thingb
// TODO: maybe we shoud create a new method and keep the details or fitgure out a solution

class PostRepository {
  async save(input: CreatePostInput & { categoryId?: string }): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        title: input.title,
        content: input.content as PrismaJsonValue,
        contentHtml: input.contentHtml,
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

  async getBy(filter: Partial<Omit<Post, "content">>): Promise<PostListItem[]> {
    return await prisma.post.findMany({
      where: {
        ...filter,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        status: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
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

    // Derived HTML cache (treat as computed from content)
    if (item.contentHtml !== undefined) {
      updateData.contentHtml = item.contentHtml;
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
    });
    if (!post) {
      return null;
    }
    return { ...post, content: post.content as JsonValue };
  }
  // FIXME : I do not like this it looks bad
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

  /**
   * Get post details by slug, including author and categories, tags and everything needed
   */

  async getDetailsBySlug(slug: string): Promise<PostDetails | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        categories: { select: { id: true, label: true, slug: true } },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      content: post.content as JsonValue,
    };
  }
}

export default PostRepository;

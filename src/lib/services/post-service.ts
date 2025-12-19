import PostRepository from "../repositories/post-repository";
import UserRepository from "../repositories/user-repository";
import { Post, JsonValue } from "../types/posts";

export class PostService {
  constructor(
    private postRepo = new PostRepository(),
    private userRepo = new UserRepository()
  ) {}

  /**
   * Create a new draft post
   * Business logic: Sets status to DRAFT, publishedAt to null
   */
  async createDraft(
    authorId: string,
    title: string,
    content: JsonValue,
    categoryId?: string,
    coverImage?: string
  ): Promise<Post> {
    // Verify user exists
    const user = await this.userRepo.getById(authorId);

    if (!user) {
      throw new Error("User not found. Please authenticate first.");
    }

    return this.postRepo.save({
      title,
      content,
      authorId,
      status: "DRAFT",
      publishedAt: null,
      coverImage: coverImage || null,
      categoryId,
    });
  }

  // TODO: add pagination
  /**
   *  Get Post list by filters
   * @returns
   */
  async getBy(filters: Partial<Omit<Post, "content">>): Promise<Post[]> {
    return this.postRepo.getBy(filters);
  }

  async getBySlug(slug: string): Promise<Post | null> {
    const post = await this.postRepo.getBySlug(slug);
    return post;
  }

  /**
   * Publish a draft post
   * Business logic: Only drafts can be published, sets publishedAt date
   */
  async publish(postId: string): Promise<Post> {
    const post = await this.postRepo.getById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.status === "PUBLISHED") {
      throw new Error("Post is already published");
    }

    if (post.status === "ARCHIVED") {
      throw new Error("Cannot publish an archived post");
    }

    return this.postRepo.update(postId, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
  }

  /**
   * Archive a post
   * Business logic: Can archive any post
   */
  async archive(postId: string): Promise<Post> {
    const post = await this.postRepo.getById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.status === "ARCHIVED") {
      throw new Error("Post is already archived");
    }

    return this.postRepo.update(postId, {
      status: "ARCHIVED",
    });
  }

  /**
   * Update a post's content
   * Business logic: Can only update drafts
   */
  async updateDraft(
    postId: string,
    updates: {
      title?: string;
      content?: JsonValue;
      categoryId?: string;
      coverImage?: string;
    }
  ): Promise<Post> {
    const post = await this.postRepo.getById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.status !== "DRAFT") {
      throw new Error("Can only update draft posts");
    }

    return this.postRepo.update(postId, updates);
  }

  /**
   * Get a post by ID
   */
  async getPostById(postId: string): Promise<Post | null> {
    return this.postRepo.getById(postId);
  }

  /**
   * Delete a post
   * Business logic: Only allow deleting drafts
   */
  async deleteDraft(postId: string): Promise<void> {
    const post = await this.postRepo.getById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.status !== "DRAFT") {
      throw new Error("Can only delete draft posts");
    }

    return this.postRepo.delete(postId);
  }

  /**
   * Get detailed post information by slug, including author, categories, and tags
   */
  async getDetailsBySlug(slug: string) {
    return this.postRepo.getDetailsBySlug(slug);
  }
}

// Singleton instance
export const postService = new PostService();

// Default export for convenience and tests
export default postService;

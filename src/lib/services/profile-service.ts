import { type PostPreview } from "@/lib/types/posts";
import PostRepository from "@/lib/repositories/post-repository";
import UserRepository, {
  type UserProfileSummary,
} from "@/lib/repositories/user-repository";

export type ProfileView = UserProfileSummary & {
  postsPreview: PostPreview[];
  publishedPostsCount: number;
};

class ProfileService {
  constructor(
    private userRepo = new UserRepository(),
    private postRepo = new PostRepository(),
  ) {}

  async getProfileView(
    userId: string,
    options?: {
      previewLimit?: number;
    },
  ): Promise<ProfileView | null> {
    const previewLimit = options?.previewLimit ?? 12;

    const user = await this.userRepo.getProfileSummaryById(userId);

    if (!user) {
      return null;
    }

    const [postsPreview, publishedPostsCount] = await Promise.all([
      this.postRepo.listAuthorPostPreviews(userId, {
        take: previewLimit,
        orderBy: "createdAt",
        orderDirection: "desc",
      }),
      this.postRepo.countAuthorPosts(userId, {
        statuses: ["PUBLISHED"],
      }),
    ]);

    return {
      ...user,
      postsPreview,
      publishedPostsCount,
    };
  }
}

export default ProfileService;

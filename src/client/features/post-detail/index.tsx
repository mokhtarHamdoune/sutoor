import { ReactNode } from "react";
import { PostHeader } from "./components/post-header";
import { PostContent } from "./components/post-content";
import { PostFooter } from "./components/post-footer";
import { PostDetails } from "@/lib/types/posts";

interface PostDetailProps {
  post: PostDetails;
  children: ReactNode;
  currentUserId?: string;
}

export function PostDetail({ post, children, currentUserId }: PostDetailProps) {
  const isAuthor = currentUserId === post.author.id;

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Full-width hero header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto">
          <PostHeader
            title={post.title}
            author={post.author}
            publishedAt={post.publishedAt}
            categories={post.categories}
            slug={post.slug}
            coverImage={post.coverImage}
            isAuthor={isAuthor}
          />
        </div>
      </div>

      {/* Narrower content for readability */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="py-12">
          <PostContent>{children}</PostContent>
        </div>

        <PostFooter author={post.author} />
      </div>
    </div>
  );
}

export { PostHeader } from "./components/post-header";
export { PostContent } from "./components/post-content";
export { PostFooter } from "./components/post-footer";

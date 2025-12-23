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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Content card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-10 lg:p-12">
          <PostHeader
            title={post.title}
            author={post.author}
            publishedAt={post.publishedAt}
            categories={post.categories}
            slug={post.slug}
            coverImage={post.coverImage}
            isAuthor={isAuthor}
          />

          <div className="mt-8">
            <PostContent>{children}</PostContent>
          </div>

          <PostFooter author={post.author} />
        </div>
      </div>
    </div>
  );
}

export { PostHeader } from "./components/post-header";
export { PostContent } from "./components/post-content";
export { PostFooter } from "./components/post-footer";

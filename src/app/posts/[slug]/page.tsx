import Editor from "@/client/features/editor";
import { PostDetail } from "@/client/features/post-detail";
import { postService } from "@/lib/services";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getDetailsBySlug(slug);
  const session = await auth();

  if (!post) {
    notFound();
  }

  return (
    <PostDetail post={post} currentUserId={session?.user?.id}>
      {/* Temporary: Read-only editor until we implement HTML rendering */}
      <Editor editable={false} initContent={String(post.content)} />
    </PostDetail>
  );
}

export default PostPage;

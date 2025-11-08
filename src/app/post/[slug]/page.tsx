import Editor from "@/client/features/editor";
import { postService } from "@/lib/services";

// TODO: we may use the same page for read and right and change only the enable mode
async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="w-5/12 m-auto mt-12">
      <h1 className="text-3xl">{post.title}</h1>
      <Editor editable={false} initContent={String(post.content)} />
    </div>
  );
}

export default PostPage;

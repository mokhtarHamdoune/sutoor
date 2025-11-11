import PostEditor from "@/client/features/post-editor";
import { postService } from "@/lib/services";
import { updateDraftContent, deleteDraftPost } from "../../actions";
import { notFound } from "next/navigation";

async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <PostEditor
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: String(post.content),
        status: post.status,
      }}
      onSave={updateDraftContent.bind(null, post.id)}
      onDelete={deleteDraftPost.bind(null, post.id)}
      cancelHref={`/posts/${slug}`}
    />
  );
}

export default EditPostPage;

import PostEditor from "@/client/features/post-editor";
import { postService, categoryService } from "@/lib/services";
import { updateDraftContent, deleteDraftPost } from "../../actions";
import { notFound } from "next/navigation";

async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, categories] = await Promise.all([
    postService.getDetailsBySlug(slug),
    categoryService.getAll(),
  ]);

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
        coverImage: post.coverImage,
        categoryId: post.categories?.[0]?.id || undefined,
      }}
      onSave={updateDraftContent.bind(null, post.id)}
      onDelete={deleteDraftPost.bind(null, post.id)}
      cancelHref={`/posts/${slug}`}
      categories={categories.map((c) => ({ id: c.id, label: c.label }))}
    />
  );
}

export default EditPostPage;

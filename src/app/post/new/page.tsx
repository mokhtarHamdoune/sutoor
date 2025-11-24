import PostEditor from "@/client/features/post-editor";
import { saveEditorContent } from "../actions";
import { categoryService } from "@/lib/services";

export default async function NewPostPage() {
  // ✅ Server Component can call services directly for READ operations
  // No need for an action wrapper - we're already on the server
  const categories = await categoryService.getAll();

  return (
    <PostEditor
      onSave={saveEditorContent}
      cancelHref="/posts"
      categories={categories.map((c) => ({ id: c.id, label: c.label }))}
    />
  );
}

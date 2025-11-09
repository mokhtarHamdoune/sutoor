import PostEditor from "@/client/features/post-editor";
import { saveEditorContent } from "../actions";

export default function NewPostPage() {
  return <PostEditor onSave={saveEditorContent} cancelHref="/posts" />;
}

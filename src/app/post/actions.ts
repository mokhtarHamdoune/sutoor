"use server";

import { PostService } from "@/lib/services";
import { redirect } from "next/navigation";

// Init the service (contains business logic)
const postService = new PostService();

/**
 * Save editor content as a draft post
 * The service handles: getting user, setting status, etc.
 */
const saveEditorContent = async (title: string, content: string, coverImage?: string) => {
  await postService.createDraft(title, content, coverImage);
  redirect("/");
};

const updateDraftContent = async (
  post_id: string,
  title: string,
  content: string,
  coverImage?: string
) => {
  await postService.updateDraft(post_id, { title, content, coverImage });
  redirect("/");
};

const deleteDraftPost = async (post_id: string) => {
  await postService.deleteDraft(post_id);
  redirect("/");
};

export { saveEditorContent, updateDraftContent, deleteDraftPost };

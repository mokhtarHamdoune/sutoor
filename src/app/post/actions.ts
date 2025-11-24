"use server";

import { postService } from "@/lib/services";
import { redirect } from "next/navigation";

/**
 * Save editor content as a draft post
 * The service handles: getting user, setting status, etc.
 */
const saveEditorContent = async (
  title: string,
  content: string,
  categoryId?: string,
  coverImage?: string
) => {
  await postService.createDraft(title, content, categoryId, coverImage);
  redirect("/");
};

const updateDraftContent = async (
  post_id: string,
  title: string,
  content: string,
  categoryId?: string,
  coverImage?: string
) => {
  await postService.updateDraft(post_id, {
    title,
    content,
    categoryId,
    coverImage,
  });
  redirect("/");
};

const deleteDraftPost = async (post_id: string) => {
  await postService.deleteDraft(post_id);
  redirect("/");
};

export { saveEditorContent, updateDraftContent, deleteDraftPost };

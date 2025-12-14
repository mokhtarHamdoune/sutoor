"use server";

import { postService } from "@/lib/services";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Save editor content as a draft post
 * The service handles: getting user, setting status, etc.
 *
 * Security: Server actions are API endpoints that can be called directly,
 * so we must validate authentication here even if the UI is protected.
 * TODO: Add route middleware for /post/* routes for defense in depth
 */
const saveEditorContent = async (
  title: string,
  content: string,
  categoryId?: string,
  coverImage?: string
) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a post");
  }

  await postService.createDraft(
    session.user.id,
    title,
    content,
    categoryId,
    coverImage
  );
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

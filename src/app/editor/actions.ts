"use server";

import { PostService } from "@/lib/services";
import { redirect } from "next/navigation";

// Init the service (contains business logic)
const postService = new PostService();

/**
 * Save editor content as a draft post
 * The service handles: getting user, setting status, etc.
 */
const saveEditorContent = async (title: string, content: string) => {
  await postService.createDraft(title, content);
  redirect("/");
};

export { saveEditorContent };

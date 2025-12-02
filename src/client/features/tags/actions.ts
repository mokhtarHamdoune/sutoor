"use server";

import { tagsService } from "@/lib/services";

/**
 * Fetch tags matching the search query
 */
const searchTags = async (query: string) => {
  const tags = await tagsService.searchTags(query);
  return tags;
};

const createTag = async (tag: string) => {
  const newTag = await tagsService.createTag(tag);
  return newTag;
};

export { searchTags, createTag };

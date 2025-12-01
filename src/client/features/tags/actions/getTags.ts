"use server";

import { tagsService } from "@/lib/services";

/**
 * Fetch tags matching the search query
 */
const searchTags = async (query: string) => {
  console.log("Searching tags for query:", query);
  const tags = await tagsService.searchTags(query);
  console.log("Found tags:", tags);
  return tags;
};

export { searchTags };

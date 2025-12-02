"use client";

import { Label } from "@/client/shared/ui/label";
import { SelectedTags } from "./components/selected-tags";
import TagsSearch from "./components/tags-search-creator";
import { useState } from "react";
import { searchTags as getTags, createTag } from "./actions";

function Tags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const searchTags = async (query: string) => {
    const tags = await getTags(query);
    setTags(tags.map((tag) => tag.name));
  };
  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreate = async (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const newTag = await createTag(tag);
      setSelectedTags([...selectedTags, newTag.name]);
      setTags((prev) => [...prev, newTag.name]);
    }
  };

  const handleRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-slate-500 uppercase">
        Tags
      </Label>
      <SelectedTags selectedTags={selectedTags} onRemove={handleRemove} />
      <TagsSearch
        tags={tags}
        onSearch={searchTags}
        onSelect={handleSelect}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default Tags;

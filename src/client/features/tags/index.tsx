import { Label } from "@/client/shared/ui/label";
import { SelectedTags } from "./components/tag-input";
import TagsSearch from "./components/tags-search-creator";
import { useState } from "react";
import { searchTags as getTags } from "./actions/getTags";

function Tags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const searchTags = async (query: string) => {
    const tags = await getTags(query);
    console.log(tags);
    setTags(tags.map((tag) => tag.name));
  };
  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };
  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-slate-500 uppercase">
        Tags
      </Label>
      <SelectedTags selectedTags={selectedTags} />
      <TagsSearch tags={tags} onSearch={searchTags} onSelect={handleSelect} />
    </div>
  );
}

export default Tags;

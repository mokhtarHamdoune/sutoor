import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/client/shared/ui/command";

type TagsSearchProps = {
  tags: string[];
  onSelect?: (tag: string) => void;
  onSearch?: (query: string) => void;
};

function TagsSearch({ tags, onSearch, onSelect }: TagsSearchProps) {
  return (
    <Command className="rounded-lg border">
      <CommandInput placeholder="search for tags..." onValueChange={onSearch} />
      <CommandList>
        {tags.map((tag) => (
          <CommandItem key={tag} value={tag} onSelect={onSelect}>
            {tag}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}

export default TagsSearch;

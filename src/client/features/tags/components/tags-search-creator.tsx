import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/client/shared/lib/utils";
import { Button } from "@/client/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/shared/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/shared/ui/popover";

type TagsSearchProps = {
  tags: string[];
  onSelect?: (tag: string) => void;
  onSearch?: (query: string) => void;
  onCreate?: (tag: string) => void;
};

function TagsSearch({ tags, onSearch, onSelect, onCreate }: TagsSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSearch = (query: string) => {
    setValue(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSelect = (tag: string) => {
    if (onSelect) {
      onSelect(tag);
    }
    setOpen(false);
    setValue("");
  };

  const handleCreate = () => {
    if (onCreate && value) {
      onCreate(value);
      setOpen(false);
      setValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : "Search for tags..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for tags..."
            value={value}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty className="p-2 text-sm">
              {value && onCreate ? (
                <div
                  className="flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={handleCreate}
                >
                  Create new tag:{" "}
                  <span className="font-medium text-primary">{value}</span>
                </div>
              ) : (
                "No tags found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => handleSelect(tag)}
                >
                  <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TagsSearch;

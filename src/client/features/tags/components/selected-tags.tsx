"use client";

import { Badge } from "@/client/shared/ui/badge";
import { X } from "lucide-react";

type TagsInputProps = {
  selectedTags: string[];
  onRemove?: (tag: string) => void;
};

export function SelectedTags({ selectedTags, onRemove }: TagsInputProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {selectedTags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button
            className="hover:bg-slate-200 rounded-full p-0.5"
            onClick={() => onRemove && onRemove(tag)}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

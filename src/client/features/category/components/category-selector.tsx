"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/shared/ui/select";
import { Label } from "@/client/shared/ui/label";
import { CreateCategoryDialog } from "./create-category-form";

type CategorySelectorProps = {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
};

export function CategorySelector(props: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-500 uppercase">
          Category
        </Label>
        <CreateCategoryDialog
          onSuccess={(newCategory) => {
            props.onCategoryChange?.(newCategory);
          }}
        />
      </div>
      <Select
        onValueChange={props.onCategoryChange}
        value={props.selectedCategory}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select category..." />
        </SelectTrigger>
        <SelectContent>
          {props.categories?.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

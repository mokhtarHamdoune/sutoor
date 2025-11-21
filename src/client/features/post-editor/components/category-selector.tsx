"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/shared/ui/select";
import { Label } from "@/client/shared/ui/label";

export function CategorySelector() {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-500 uppercase">
        Category
      </Label>
      <Select>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select category..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="life">Lifestyle</SelectItem>
          <SelectItem value="coding">Coding</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

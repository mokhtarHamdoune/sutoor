"use client";

import { Badge } from "@/client/shared/ui/badge";
import { Input } from "@/client/shared/ui/input";
import { Label } from "@/client/shared/ui/label";
import { X } from "lucide-react";

export function TagInput() {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-slate-500 uppercase">
        Tags
      </Label>

      <div className="flex flex-wrap gap-2 mb-2">
        <Badge variant="secondary" className="gap-1 pr-1">
          Next.js
          <button className="hover:bg-slate-200 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
        <Badge variant="secondary" className="gap-1 pr-1">
          React
          <button className="hover:bg-slate-200 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      </div>

      <Input placeholder="Add a tag..." className="bg-white h-9" />
      <p className="text-[10px] text-slate-400">Press enter to add a tag</p>
    </div>
  );
}

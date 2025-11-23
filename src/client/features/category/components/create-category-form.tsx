"use client";

import { createCategory } from "@/app/actions/category";
import { Button } from "@/client/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/shared/ui/dialog";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CategoryForm } from "./category-form";
import { CreateCategoryInput } from "../schema";

interface CreateCategoryDialogProps {
  onSuccess?: (categoryLabel: string) => void;
}

export function CreateCategoryDialog({ onSuccess }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: CreateCategoryInput) => {
    startTransition(async () => {
      const result = await createCategory(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.category) {
        toast.success("Category created successfully");
        setOpen(false);
        onSuccess?.(result.category.label);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          formId="create-category-form"
          onSubmit={handleSubmit}
          isPending={isPending}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            form="create-category-form"
          >
            {isPending ? "Creating..." : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

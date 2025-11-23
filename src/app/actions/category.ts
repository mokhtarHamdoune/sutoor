"use server";

import { categoryService } from "@/lib/services/category-service";
import { createCategorySchema } from "@/client/features/category/schema";
import { revalidatePath } from "next/cache";

export async function createCategory(data: unknown) {
  const result = createCategorySchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  try {
    const category = await categoryService.create({
      label: result.data.label,
      descpription: result.data.description || null,
      color: result.data.color || null,
      image: null,
      parentId: null,
    });

    revalidatePath("/"); // Revalidate cache if needed
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Failed to create category" };
  }
}

export async function getCategories() {
  try {
    const categories = await categoryService.getAll();
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

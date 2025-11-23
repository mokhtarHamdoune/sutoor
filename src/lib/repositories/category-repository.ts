import { prisma } from "@/db";
import BaseRepository from "./base-repository";
import { generateSlug } from "../utils";

// Full Category type with all DB fields
export type Category = {
  id: string;
  label: string;
  slug: string;
  descpription: string | null;
  color: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Input type for creating a category - omits DB-generated fields
export type CreateCategoryInput = Omit<
  Category,
  "id" | "slug" | "createdAt" | "updatedAt"
>;

class CategoryRepository implements BaseRepository<Category> {
  async save(input: CreateCategoryInput): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        ...input,
        slug: generateSlug(input.label),
      },
    });
    return category;
  }

  async getById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  }

  async getBy(filter: Partial<Category>): Promise<Category[]> {
    return await prisma.category.findMany({
      where: {
        ...filter,
      },
    });
  }

  async update(id: string, item: Partial<Category>): Promise<Category> {
    const updateData: Record<string, unknown> = { ...item };

    // If label is being updated, regenerate the slug
    if (item.label) {
      updateData.slug = generateSlug(item.label);
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return category;
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
    });
    return category;
  }
}

export default CategoryRepository;

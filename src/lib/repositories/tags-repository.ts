import { prisma } from "@/db";
import BaseRepository from "./base-repository";
import { Tag as TagModel } from "@/generated/prisma/client";
import { generateSlug } from "../utils";

export type Tag = TagModel;

class TagsRepository implements BaseRepository<Tag> {
  async save(
    input: Omit<Tag, "id" | "slug" | "createdAt" | "updatedAt">,
  ): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: {
        name: input.name,
        slug: generateSlug(input.name),
      },
    });
    return tag;
  }

  async getById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    return tag;
  }

  async getBy(filter: Partial<Tag>): Promise<Tag[]> {
    return await prisma.tag.findMany({
      where: {
        ...filter,
      },
    });
  }
  async update(id: string, item: Partial<Tag>): Promise<Tag> {
    const updateData: Record<string, unknown> = { ...item };

    // If name is being updated, regenerate the slug
    if (item.name) {
      updateData.slug = generateSlug(item.name);
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });
    return tag;
  }

  async delete(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  async search(name: string): Promise<Tag[]> {
    return await prisma.tag.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }
}

export default TagsRepository;

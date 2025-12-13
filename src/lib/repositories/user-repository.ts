import { prisma } from "@/db";
import BaseRepository from "./base-repository";

// User type matching Prisma schema
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  bio: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

// Input type for creating a user
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;

// Input type for updating a user
export type UpdateUserInput = Partial<Pick<User, "name" | "bio" | "image">>;

export type UserProfileSummary = Pick<
  User,
  "id" | "name" | "email" | "image" | "bio" | "role" | "createdAt"
> & {
  totalPosts: number;
};

class UserRepository implements BaseRepository<User> {
  async save(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: input,
    });
    return user as User;
  }

  async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async getProfileSummaryById(id: string): Promise<UserProfileSummary | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return user ? { ...user, totalPosts: user?._count.posts ?? 0 } : null;
  }

  async getBy(filter: Partial<User>): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: filter,
    });
    return users;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export default UserRepository;

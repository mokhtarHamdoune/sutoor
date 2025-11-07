import { prisma } from "@/db";
import BaseRepository from "./base-repository";

// Full User type with all DB fields
export type User = {
  id: string;
  email: string;
  username: string;
  lastName: string;
  firstName: string;
  bio: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

// Input type for creating a user - omits DB-generated fields
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;

class UserRepository implements BaseRepository<User> {
  // eslint-disable-next-line
  async save(input: CreateUserInput): Promise<User> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line
  async getById(id: string): Promise<User | null> {
    // For now, return the first user in the database (mock implementation)
    const user = await prisma.user.findFirst();
    return user;
  }
  // eslint-disable-next-line
  async getBy(filter: Partial<User>): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line
  async update(id: string, item: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default UserRepository;

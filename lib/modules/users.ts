import { prisma } from "@/lib/prisma";

export interface UserData {
  name?: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  email?: string;
  image?: string;
  xp?: number;
}

export interface UserUpdateData {
  name?: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  image?: string;
  xp?: number;
}

export class Users {
  static async add(data: UserData) {
    try {
      const newUser = await prisma.user.create({
        data,
      });
      return newUser;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue creating this user");
    }
  }

  static async all() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching users");
    }
  }

  static async delete(id: string) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue deleting this user");
    }
  }

  static async edit(id: string, data: UserUpdateData) {
    try {
      const disallowedKeys = [
        "id",
        "email",
        "emailVerified",
        "verified",
        "moderator",
        "createdAt",
      ];

      for (const key of disallowedKeys) {
        if (key in data) {
          throw new Error(`Cannot modify protected field: ${key}`);
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue updating this user");
    }
  }

  static async verify(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { verified: true },
      });
    } catch (err: any) {
      throw new Error(err.message || "Could not verify user");
    }
  }

  static async unverify(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { verified: false },
      });
    } catch (err: any) {
      throw new Error(err.message || "Could not unverify user");
    }
  }

  static async mod(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { moderator: true },
      });
    } catch (err: any) {
      throw new Error(err.message || "Could not give moderator rights");
    }
  }

  static async unMod(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { moderator: false },
      });
    } catch (err: any) {
      throw new Error(err.message || "Could not remove moderator rights");
    }
  }

  static async get(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          reviews: {
            include: {
              bubbler: true,
            },
          },
          bubblers: true,
          accounts: true,
          sessions: true,
        },
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching this user");
    }
  }
}

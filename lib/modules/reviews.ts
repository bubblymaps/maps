import { prisma } from "@/lib/prisma";

export interface ReviewData {
  bubblerId: number;
  userId: string;
  rating: number;
  comment?: string;
}

export class Reviews {
  static async add(data: ReviewData) {
    const { bubblerId, userId, rating, comment } = data;

    try {
      const newReview = await prisma.review.create({
        data: {
          bubblerId,
          userId,
          rating,
          comment,
        },
      });
      return newReview;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue adding this review");
    }
  }

  static async all() {
    try {
      const reviews = await prisma.review.findMany({
        include: {
          user: { select: { id: true, displayName: true, handle: true, moderator: true, verified: true, image: true } },
          bubbler: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reviews;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching reviews");
    }
  }

  static async delete(id: number) {
    try {
      const deletedReview = await prisma.review.delete({
        where: { id },
      });
      return deletedReview;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue deleting this review");
    }
  }

  static async byBubbler(bubblerId: number) {
    try {
      const reviews = await prisma.review.findMany({
        where: { bubblerId },
        include: {
          user: { select: { id: true, displayName: true, handle: true, moderator: true, verified: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reviews;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching reviews");
    }
  }

  static async byUser(userId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          bubbler: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reviews;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching user reviews");
    }
  }

  static async getId(id: number) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
      });
      return review;
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch review");
    }
  }
}

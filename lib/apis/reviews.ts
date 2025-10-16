import { prisma } from "@/lib/prisma"

// GET reviews by bubbler or user
export async function getReviews({
  bubblerId,
  userId,
}: { bubblerId?: number; userId?: string }) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        ...(bubblerId !== undefined && { bubblerId }),
        ...(userId && { userId }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, displayName: true, handle: true, image: true },
        },
        bubbler: {
          select: { id: true, name: true },
        },
      },
    })
    return { success: true, reviews }
  } catch (error) {
    console.error("[REVIEWS_GET]", error)
    return { success: false, error: "Failed to fetch reviews" }
  }
}

// CREATE a new review
export async function createReview(data: {
  bubblerId: number
  userId: string
  rating: number
  comment?: string
}) {
  try {
    const review = await prisma.review.create({ data })
    return { success: true, review }
  } catch (error) {
    console.error("[REVIEWS_CREATE]", error)
    return { success: false, error: "Failed to create review" }
  }
}

// DELETE a review
export async function deleteReview(id: number) {
  try {
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return { success: false, error: "Review not found" }

    await prisma.review.delete({ where: { id } })
    return { success: true, message: "Review deleted successfully" }
  } catch (error) {
    console.error("[REVIEWS_DELETE]", error)
    return { success: false, error: "Failed to delete review" }
  }
}

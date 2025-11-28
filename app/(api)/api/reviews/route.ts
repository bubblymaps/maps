import { NextRequest, NextResponse } from "next/server";
import { Reviews, ReviewData } from "@/lib/modules/reviews";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { awardXP } from "@/lib/xp";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const bubblerIdParam = url.searchParams.get("bubblerId");
    let reviews;

    if (userIdParam) {
      // Fetch reviews by user id (string)
      reviews = await Reviews.byUser(userIdParam);
    } else if (bubblerIdParam) {
      const bubblerId = Number(bubblerIdParam);
      reviews = await Reviews.byBubbler(bubblerId);
    } else {
      reviews = await Reviews.all();
    }

    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch reviews";
    console.error(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { bubblerId, rating, comment } = body;

    if (!bubblerId || !rating) return NextResponse.json({ error: "Missing bubblerId or rating" }, { status: 400 });

    const reviewData: ReviewData = { bubblerId, rating, comment, userId };
    const newReview = await Reviews.add(reviewData);

    // Award XP for adding a review
    await awardXP(userId, 'ADD_REVIEW');

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to add review";
    console.error(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const idParam = url.searchParams.get("id")
    const reviewId = Number(idParam)

    if (!reviewId) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 })
    }

    const review = await Reviews.getId(reviewId)
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    const apiTokenMatches = token && (token === process.env.API_KEY || token === process.env.API_TOKEN)
    if (apiTokenMatches) {
      const deletedReview = await Reviews.delete(reviewId)
      return NextResponse.json({ review: deletedReview })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow moderators to delete any review
    if (session.user.moderator) {
      const deletedReview = await Reviews.delete(reviewId)
      return NextResponse.json({ review: deletedReview })
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const deletedReview = await Reviews.delete(reviewId)
    return NextResponse.json({ review: deletedReview })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete review";
    console.error(err)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
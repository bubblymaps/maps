import { NextRequest, NextResponse } from "next/server";
import { getUserXP, getXPLeaderboard } from "@/lib/xp";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const userId = url.searchParams.get("userId");

    // Get leaderboard
    if (action === "leaderboard") {
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const leaderboard = await getXPLeaderboard(limit);
      return NextResponse.json({ leaderboard });
    }

    // Get specific user's XP
    if (userId) {
      const xp = await getUserXP(userId);
      return NextResponse.json({ userId, xp });
    }

    // Get current user's XP
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const xp = await getUserXP(session.user.id);
    return NextResponse.json({ userId: session.user.id, xp });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch XP data";
    console.error("[XP API]", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

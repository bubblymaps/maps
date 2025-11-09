import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const [totalWaypoints, totalVerifiedWaypoints, totalUsers, totalReviews, totalContributions] = await Promise.all([
			prisma.bubbler.count(),
			prisma.bubbler.count({ where: { verified: true } }),
			prisma.user.count(),
			prisma.review.count(),
			prisma.bubblerLog.count(),
		]);

		return NextResponse.json(
			{ totalWaypoints, totalVerifiedWaypoints, totalUsers, totalReviews, totalContributions },
			{ status: 200 }
		);
	} catch (err: any) {
		console.error("Failed to fetch stats:", err);
		return NextResponse.json({ error: err?.message || "Failed to fetch stats" }, { status: 500 });
	}
}

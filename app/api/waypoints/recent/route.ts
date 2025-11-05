import { NextResponse } from "next/server";
import { Waypoints } from "@/lib/modules/waypoints";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const limitParam = url.searchParams.get("limit");
		let limit = 10;
		if (limitParam) {
			const parsed = parseInt(limitParam, 10);
			if (!Number.isNaN(parsed) && parsed > 0) limit = Math.min(parsed, 100);
		}

		const recent = await Waypoints.recent(limit);

		return NextResponse.json({ waypoints: recent });
	} catch (err: any) {
		console.error("Failed to fetch recent waypoints:", err);
		return NextResponse.json({ error: err?.message || "Failed to fetch recent waypoints" }, { status: 500 });
	}
}


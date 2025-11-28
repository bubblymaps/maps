import { NextRequest, NextResponse } from "next/server";
import { ReportAbuse } from "@/lib/modules/reports"; // adjust import path
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (!type)
      return NextResponse.json({ error: "Missing type parameter" }, { status: 400 });

    const reports = await ReportAbuse.all();
    const filtered = reports.filter((r: { type: string }) => r.type === type);

    return NextResponse.json(filtered);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch reports";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const reporterId = session?.user?.id;

    if (!reporterId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, targetId, reason } = body;

    if (!type || !targetId || !reason)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const report = await ReportAbuse.create({
      type,
      reporterId,
      targetId,
      reason,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create report";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

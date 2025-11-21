import { NextResponse } from "next/server";
import { Waypoints, WaypointUpdateData } from "@/lib/modules/waypoints";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { awardXP, canEditWaypoint } from "@/lib/xp";
import { XP_REQUIRED } from "@/lib/xp-config";

export async function GET(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

    const waypoint = await Waypoints.byId(id);
    const waypointLogs = await Waypoints.fetchLogs(id);
    if (!waypoint) return NextResponse.json({ error: "Waypoint not found" }, { status: 404 });

    return NextResponse.json({ waypoint, logs: waypointLogs });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch waypoint";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

    const session = await getServerSession(authOptions);
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN || process.env.API_KEY;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

    if (!session && !hasApiToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json() as Partial<WaypointUpdateData>;

    const allowedFields = [
      "name", "latitude", "longitude", "description",
      "amenities", "image", "maintainer", "region"
    ];

    if (hasApiToken) allowedFields.push("approved", "verified", "addedByUserId");

    const filteredData: Partial<WaypointUpdateData> = {};
    for (const key of allowedFields) {
      if (key in data) filteredData[key as keyof WaypointUpdateData] = data[key as keyof WaypointUpdateData] as any;
    }

    // Get the userId from session, or use 'api' if authenticated via API token
    const userId = session?.user?.id || (hasApiToken ? 'api' : null);

    // Enforce XP requirement for editing a waypoint (for authenticated users)
    if (session?.user?.id) {
      const allowed = await canEditWaypoint(session.user.id);
      if (!allowed) {
        return NextResponse.json(
          { error: `Insufficient XP to edit this waypoint. Required: ${XP_REQUIRED.EDIT_WAYPOINT}` },
          { status: 403 }
        );
      }
    }

    const updatedWaypoint = await Waypoints.edit(id, filteredData as WaypointUpdateData, userId);
    
    // Award XP for editing a waypoint (only for authenticated users, not API)
    if (session?.user?.id) {
      await awardXP(session.user.id, 'EDIT_WAYPOINT');
    }
    
    return NextResponse.json(updatedWaypoint);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update waypoint";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN || process.env.API_KEY;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

    if (!hasApiToken) {
      return NextResponse.json({ error: "Unauthorized — valid API token required" }, { status: 401 });
    }

    const deletedWaypoint = await Waypoints.delete(id);
    return NextResponse.json(deletedWaypoint);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete waypoint";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

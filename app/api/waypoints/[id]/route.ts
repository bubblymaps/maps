import { NextResponse } from "next/server";
import { Waypoints, WaypointUpdateData } from "@/lib/modules/waypoints";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

    const session = await getServerSession(authOptions);
    const apiToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const hasApiToken = apiToken && apiToken === process.env.API_TOKEN;

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
    const updatedWaypoint = await Waypoints.edit(id, filteredData as WaypointUpdateData, userId);
    
    return NextResponse.json(updatedWaypoint);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

    const apiToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const hasApiToken = apiToken && apiToken === process.env.API_TOKEN;

    if (!hasApiToken) {
      return NextResponse.json({ error: "Unauthorized — API token required" }, { status: 401 });
    }

    const deletedWaypoint = await Waypoints.delete(id);
    return NextResponse.json(deletedWaypoint);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

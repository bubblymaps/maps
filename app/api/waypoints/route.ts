import { NextResponse } from "next/server";
import { Waypoints, WaypointData } from "@/lib/modules/waypoints";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// /api/waypoints → all waypoints (ordered by createdAt DESC)
// /api/waypoints?userId=linuskang → all waypoints by specific user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  try {
    const waypoints = await prisma.bubbler.findMany(
      {
        where: userId ? { addedByUserId: userId } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          addedBy: {
            select: { id: true, image: true, displayName: true, handle: true },
          },
          reviews: {
            include: {
              user: { select: { handle: true } }
            }
          }
        },
      }
    )
    return NextResponse.json(waypoints)
  } catch (error) {
    console.error("[WAYPOINTS_GET]", error)
    return NextResponse.json({ error: "Failed to fetch waypoints" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const apiToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const hasApiToken = apiToken && apiToken === process.env.API_KEY;

    if (!session && !hasApiToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const allowedFields = [
      "name",
      "latitude",
      "longitude",
      "description",
      "amenities",
      "image",
      "maintainer",
      "region",
    ];

    if (hasApiToken) {
      allowedFields.push("approved", "verified", "addedByUserId");
    }

    const filteredData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) filteredData[field] = data[field];
    }

    if (session?.user?.id) {
      filteredData.addedByUserId = session.user.id;
    } else if (hasApiToken) {
      filteredData.addedByUserId = data.addedByUserId ?? "api";
    }


    const requiredFields: (keyof WaypointData)[] = [
      "name",
      "latitude",
      "longitude",
      "addedByUserId",
    ];

    for (const field of requiredFields) {
      if (
        filteredData[field] === undefined ||
        filteredData[field] === null ||
        (typeof filteredData[field] === "string" && filteredData[field].trim() === "")
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newWaypoint = await Waypoints.add(filteredData as WaypointData);

    return NextResponse.json(newWaypoint, { status: 201 });
  } catch (err: any) {
    console.error("Error creating waypoint:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create waypoint" },
      { status: 400 }
    );
  }
}
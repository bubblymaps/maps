// WaypointsAPI
// Version: 2.0.0
// Licensed under CC BY-NC 4.0

import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"
import { DiscordWebhook } from "@/modules/discord"
import { log } from "@/lib/pino"

const env = process.env
const webhook = new DiscordWebhook(env.DISCORD_WEBHOOK_URL!);

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
          favorites: true,
          reviews: true,
        },
      }
    )
    return NextResponse.json(waypoints)
  } catch (error) {
    console.error("[WAYPOINTS_GET]", error)
    return NextResponse.json({ error: "Failed to fetch waypoints" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      name,
      latitude,
      longitude,
      description,
      amenities = [],
      image,
      maintainer,
      addedByUserId: overrideUserId,
      region,
      ignoreLog = false,
    } = body;

    const authHeader = req.headers.get("Authorization");
    const apiTokenValid = authHeader === `Bearer ${env.BUBBLY_API_TOKEN}`;
    const userId = session?.user?.id ?? (apiTokenValid ? overrideUserId : null);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in or provide a valid API token." },
        { status: 401 }
      );
    }

    const newBubbler = await prisma.bubbler.create({
      data: {
        name,
        latitude,
        longitude,
        description,
        amenities,
        image,
        maintainer,
        addedByUserId: userId,
        region,
      },
    });

    log.info({
      bubblerId: newBubbler.id,
      name,
      latitude,
      longitude,
      addedBy: userId,
      apiTokenUsed: apiTokenValid,
    }, "New waypoint created");

    if (ignoreLog) {
      log.info(newBubbler, 'Skipping ds log due to ignoreLog header set to true.')
    }

    if (!ignoreLog) {
      const embed = DiscordWebhook.createEmbed({
        title: "New Waypoint Created",
        description: `A new waypoint has been added by ${session?.user?.id ?? "API Token"}`,
        color: 0x55ff55,
        fields: [
          { name: "Waypoint ID", value: `\`${newBubbler.id}\``, inline: true },
          { name: "Name", value: name, inline: true },
          { name: "Latitude", value: latitude.toString(), inline: true },
          { name: "Longitude", value: longitude.toString(), inline: true },
          { name: "Description", value: description || "N/A", inline: false },
          { name: "Added By", value: userId, inline: true },
          { name: "Region", value: region || "N/A", inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Bubbly Maps Audit" },
      });
      await webhook.send(
        {
          content: `<@1222288252623650901> waypoint ${newBubbler.id} was created by ${session?.user?.id ?? "API Token"}`,
          embeds: [embed]
        }
      );
    }

    return NextResponse.json(newBubbler, { status: 201 });
  } catch (error) {
    log.error(error, "Failed to create waypoint");
    return NextResponse.json({ error: "Internal server error occurred. Please try again later." }, { status: 500 });
  }
}
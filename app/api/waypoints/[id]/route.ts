import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/pino";
import { DiscordWebhook } from "@/modules/discord";

const SERVER_API_TOKEN = process.env.BUBBLY_API_TOKEN;
const webhook_url = process.env.DISCORD_WEBHOOK_URL!;
const webhook = new DiscordWebhook(webhook_url);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid bubbler ID" }, { status: 400 });
  }

  try {
    const bubbler = await prisma.bubbler.findUnique({
      where: { id: numericId },
      include: {
        addedBy: {
          select: {
            id: true,
            image: true,
            displayName: true,
            handle: true,
          },
        },
        favorites: true,
        reviews: true,
      },
    });

    if (!bubbler) {
      return NextResponse.json({ error: "Bubbler not found" }, { status: 404 });
    }

    return NextResponse.json(bubbler);
  } catch (error) {
    console.error("[BUBBLER_GET]", error);
    return NextResponse.json({ error: "Failed to fetch bubbler" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid waypoint ID" }, { status: 400 });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${SERVER_API_TOKEN}`) {
      log.info({ attemptId: numericId, authHeader }, "Unauthorized attempt to delete waypoint");
      return NextResponse.json({ error: "Invalid API token" }, { status: 401 });
    }

    const waypoint = await prisma.bubbler.findUnique({ where: { id: numericId } });
    if (!waypoint) {
      return NextResponse.json({ error: "Waypoint not found" }, { status: 404 });
    }

    // Log deletion
    log.info({ waypointId: numericId, waypoint }, "Waypoint deleted via API token");

    // Discord embed
    const embed = DiscordWebhook.createEmbed({
      title: "Waypoint Deleted 🗑️",
      description: `Waypoint ID \`${numericId}\` has been deleted using API token`,
      color: 0xff5555,
      fields: [
        { name: "Waypoint Name", value: waypoint.name, inline: true },
        { name: "Latitude", value: waypoint.latitude.toString(), inline: true },
        { name: "Longitude", value: waypoint.longitude.toString(), inline: true },
        { name: "Added By", value: waypoint.addedByUserId || "N/A", inline: true },
        { name: "Verified", value: waypoint.verified.toString(), inline: true },
        { name: "Approved", value: waypoint.approved.toString(), inline: true },
        { name: "Region", value: waypoint.region || "N/A", inline: true },
        { name: "Description", value: waypoint.description || "N/A", inline: false },
      ],
      timestamp: new Date().toISOString(),
    });

    await webhook.send(
      { 
        content: `<@1222288252623650901> waypoint ID ${waypoint.id} was deleted by API token`,
        embeds: [embed] 
      }
    );

    await prisma.bubbler.delete({ where: { id: numericId } });

    return NextResponse.json({ message: "Waypoint deleted successfully" });
  } catch (error) {
    log.error(error, "[WAYPOINTS_DELETE] Failed to delete waypoint");
    return NextResponse.json({ error: "Failed to delete waypoint" }, { status: 500 });
  }
}
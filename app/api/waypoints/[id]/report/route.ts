// Waypoint report API.
// This route allows users to POST report a waypoint for a specific reason.
// The report is sent to your discord webhook specified inside env at DISCORD_WEBHOOK_URL.

import { NextRequest, NextResponse } from "next/server";
import { DiscordWebhook } from "@/modules/discord";
import { log } from "@/lib/pino";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const env = process.env;
const webhook = new DiscordWebhook(env.DISCORD_WEBHOOK_URL!);
const url = env.BUBBLY_URL;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const waypointId = id;

  try {
    const session = await getServerSession(authOptions);
    const reportedById = session?.user?.id;

    if (!reportedById) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to report waypoints." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, reason } = body;

    if (!type || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const waypoint = await prisma.bubbler.findUnique({
      where: { id: Number(waypointId) },
      include: { addedBy: true }
    });

    if (!waypoint) {
      return NextResponse.json(
        { success: false, error: "Waypoint not found" },
        { status: 404 }
      );
    }

    log.info({ waypoint, reason, reportedById, body }, "Waypoint report received");

    const embed = DiscordWebhook.createEmbed({
      title: `Waypoint Report: ${type}`,
      description: `${reason}\n[Take Action](${url}?bubbler=${waypointId})`,
      color: 0xff5555,
      fields: [
        { name: "Waypoint ID", value: `\`${waypoint.id}\``, inline: true },
        { name: "Name", value: waypoint.name, inline: true },
        { name: "Description", value: waypoint.description || "No description", inline: false },
        { name: "Latitude", value: waypoint.latitude.toString(), inline: true },
        { name: "Longitude", value: waypoint.longitude.toString(), inline: true },
        { name: "Image", value: waypoint.image ? `[Link](${waypoint.image})` : "No image", inline: false },
        { name: "Region", value: waypoint.region || "N/A", inline: true },
        { name: "Maintainer", value: waypoint.maintainer || "N/A", inline: true },
        { name: "Added By User ID", value: waypoint.addedByUserId || "N/A", inline: true },
        { name: "Amenities", value: waypoint.amenities.length ? waypoint.amenities.join(", ") : "None", inline: false },
        { name: "Verified", value: waypoint.verified ? "Yes" : "No", inline: true },
        { name: "Approved", value: waypoint.approved ? "Yes" : "No", inline: true },
        { name: "Created At", value: waypoint.createdAt.toISOString(), inline: false },
        { name: "Updated At", value: waypoint.updatedAt.toISOString(), inline: false },
        { name: "Reported By", value: `\`${reportedById}\``, inline: true },
      ],
      timestamp: new Date().toISOString(),
    });

    await webhook.send({
      content: `<@1222288252623650901> <@${reportedById}> reported waypoint ${waypointId}. View embed for full details.`,
      embeds: [embed],
    });

    return NextResponse.json({ success: true, message: "Report submitted successfully. Thanks for keeping Bubbly Maps safe!" });
  } catch (err) {
    log.error(err, "Failed to process waypoint report");
    return NextResponse.json({ success: false, error: "An error occurred and our team have been notified. Please try again later." }, { status: 500 });
  }
}

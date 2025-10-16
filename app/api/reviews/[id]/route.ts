import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiscordWebhook } from "@/modules/discord";
import { log } from "@/lib/pino";

const env = process.env
const api_token = env.BUBBLY_API_TOKEN;
const webhook_url = env.DISCORD_WEBHOOK_URL!;
const webhook = new DiscordWebhook(webhook_url);

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
  }

  try {
    const review = await prisma.review.findUnique({ where: { id: numericId } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const apiToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    const isAdminToken = apiToken === api_token;

    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;

    if (!isAdminToken && review.userId !== sessionUserId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot delete this review" },
        { status: 403 }
      );
    }

    log.info(
      {
        reviewId: numericId,
        review,
        deletedBy: isAdminToken ? "API Token" : sessionUserId
      }, "Review deleted");

    const embed = DiscordWebhook.createEmbed(
      {
        title: "Review Deleted",
        description: `A review was deleted by ${isAdminToken ? "API token" : sessionUserId}`,
        color: 0xff5555,
        fields: [
          { name: "Review ID", value: `\`${review.id}\``, inline: true },
          { name: "Waypoint ID", value: `\`${review.bubblerId}\``, inline: true },
          { name: "User ID", value: `\`${review.userId}\``, inline: true },
          { name: "Content", value: review.comment || "No content", inline: false },
          { name: "Rating", value: review.rating?.toString() || "N/A", inline: true },
        ],
        timestamp: new Date().toISOString()
      }
    );

    await webhook.send(
      {
        content: `<@1222288252623650901> Review ID ${review.id} was deleted by ${isAdminToken ? "API token" : sessionUserId}`,
        embeds: [embed]
      }
    );
    await prisma.review.delete(
      {
        where:
        {
          id: numericId
        }
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Review deleted successfully"
      }, { status: 200 }
    );

  } catch (error) {
    log.error(error, "Failed to delete review");
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete review"
      }, { status: 500 }
    );
  }
}


// Review report API.
// This route allows users to POST report a review for a specific reason.
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
    const reviewId = id;

    try {
        const session = await getServerSession(authOptions);
        const reportedById = session?.user?.id;

        if (!reportedById) {
            return NextResponse.json(
                { success: false, error: "Unauthorized. Please sign in to report reviews." },
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

        const review = await prisma.review.findUnique({
            where: { id: Number(reviewId) }
        });

        if (!review) {
            return NextResponse.json(
                { success: false, error: "Review not found" },
                { status: 404 }
            );
        }

        if (reportedById === review.userId) {
            return NextResponse.json(
                { success: false, error: "You cannot report yourself." },
                { status: 400 }
            );
        }

        log.info({ review, reason, reportedById, body }, "Review report received");

        const embed = DiscordWebhook.createEmbed({
            title: `Review Report: ${type}`,
            description: `${reason}\n[Take Action](${url}?bubbler=${review.bubblerId})`,
            color: 0xff5555,
            fields: [
                { name: "Review ID", value: `\`${review.id}\``, inline: true },
                { name: "Waypoint ID", value: `\`${review.bubblerId}\``, inline: true },
                { name: "Rating", value: review.rating?.toString() || "N/A", inline: false },
                { name: "Comment", value: (review.comment ?? "N/A").toString(), inline: true },
                { name: "Added By User ID", value: review.userId || "N/A", inline: true },
                { name: "Created At", value: review.createdAt.toISOString(), inline: false },
                { name: "Updated At", value: review.updatedAt.toISOString(), inline: false },
                { name: "Reported By", value: `\`${reportedById}\``, inline: true },
            ],
            timestamp: new Date().toISOString(),
        });

        await webhook.send({
            content: `<@1222288252623650901> <@${reportedById}> reported review ${reviewId} by ${review.userId}. View embed for full details.`,
            embeds: [embed],
        });

        return NextResponse.json({ success: true, message: "Report submitted successfully. Thanks for keeping Bubbly Maps safe!" });
    } catch (err) {
        log.error(err, "Failed to process waypoint report");
        return NextResponse.json({ success: false, error: "An error occurred and our team have been notified. Please try again later." }, { status: 500 });
    }
}

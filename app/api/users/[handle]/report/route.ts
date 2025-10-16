// User report API.
// This route allows users to POST report a user for a specific reason.
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
    context: { params: Promise<{ handle: string }> }
) {
    const { handle } = await context.params;
    const username = handle

    try {
        const session = await getServerSession(authOptions);
        const reportedById = session?.user?.id;

        if (!reportedById) {
            return NextResponse.json(
                { success: false, error: "Unauthorized. Please sign in to report a user." },
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
        
        if (!username) {
            return NextResponse.json(
                { success: false, error: "Invalid username" },
                { status: 400 }
            );
        }

        const reportedUser = await prisma.user.findUnique({
            where: { handle: username }
        });

        if (!reportedUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const { id: reportedUserId, displayName, handle, bio, image } = reportedUser;

        if (reportedUserId === reportedById) {
            return NextResponse.json(
                { success: false, error: "You cannot report yourself." },
                { status: 400 }
            );
        }

        log.info({ username, reportedUserId, reason, reportedById, body }, "User report received");

        const embed = DiscordWebhook.createEmbed({
            title: `User Report: ${type}`,
            description: `${reason}\n[Take Action](${url}/profile/${handle})`,
            color: 0xff5555,
            fields: [
                { name: "User ID", value: `\`${reportedById}\``, inline: true },
                { name: "Username", value: `\`${handle}\``, inline: true },
                { name: "Display Name", value: displayName || "N/A", inline: true },
                { name: "User Bio", value: bio || "No bio", inline: false },
                { name: "Reported By", value: `\`${reportedById}\``, inline: true },
                { name: "User Image", value: image ? `[Link](${image})` : "No image", inline: false },
            ],
            timestamp: new Date().toISOString(),
        });

        await webhook.send({
            content: `<@1222288252623650901> <@${reportedById}> reported user <@${handle}> (<@${reportedUserId}>) for ${type}. View embed for full details.`,
            embeds: [embed],
        });

        return NextResponse.json({
            success: true,
            message: "Report submitted successfully. Thanks for keeping Bubbly Maps safe!"
        });

    } catch (err) {
        log.error(err, "Failed to process user report");
        return NextResponse.json(
            { success: false, error: "An error occurred and our team has been notified. Please try again later." },
            { status: 500 }
        );
    }
}

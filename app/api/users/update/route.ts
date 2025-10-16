import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { log } from "@/lib/pino"
import { DiscordWebhook } from "@/modules/discord"

const env = process.env
const webhook = new DiscordWebhook(env.DISCORD_WEBHOOK_URL!)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { displayName, handle, bio, image } = body

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(displayName && { displayName }),
        ...(handle && { handle }),
        ...(bio && { bio }),
        ...(image && { image }),
      },
    })

    log.info({ userId: session.user.id, updatedFields: body }, "User profile updated")

    const embed = DiscordWebhook.createEmbed({
      title: "User Profile Updated",
      description: `User <@${session.user.handle}> (${session.user.id}) updated their profile`,
      color: 0x55aaff,
      fields: [
        ...(displayName ? [{ name: "Display Name", value: displayName, inline: true }] : []),
        ...(handle ? [{ name: "Handle", value: handle, inline: true }] : []),
        ...(bio ? [{ name: "Bio", value: bio, inline: false }] : []),
        ...(image ? [{ name: "Image URL", value: image, inline: false }] : []),
      ],
      timestamp: new Date().toISOString(),
    })

    await webhook.send(
      { 
        content: `<@1222288252623650901> <@${session.user.handle}> (${session.user.id}) updated their profile.`,
        embeds: [embed] 
      }
    )

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    log.error({error, body }, `Failed to update user profile for ${session.user.id}`)
    return NextResponse.json({ error: "Internal server error", msg: error }, { status: 500 })
  }
}

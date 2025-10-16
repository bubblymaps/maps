import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getReviews, createReview } from "@/lib/apis/reviews"
import { DiscordWebhook } from "@/modules/discord"
import { log } from "@/lib/pino"

const env = process.env
const api_token = env.BUBBLY_API_TOKEN
const webhook_url = env.DISCORD_WEBHOOK_URL!
const webhook = new DiscordWebhook(webhook_url)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bubblerId = searchParams.get("bubblerId")
  const userId = searchParams.get("userId")

  const result = await getReviews(
    {
      bubblerId: bubblerId ? Number(bubblerId) : undefined,
      userId: userId ?? undefined,
    }
  )

  if (!result.success)
    return NextResponse.json(
      { sucess: false, error: result.error },
      { status: 500 }
    )

  return NextResponse.json(result.reviews)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const authHeader = req.headers.get("Authorization")
    const apiTokenValid = authHeader === `Bearer ${api_token}`

    const userId = session?.user?.id ?? (apiTokenValid ? body.userId : null)
    if (!userId) {
      return NextResponse.json(
        { sucess: false, error: "You must be logged in to post reviews!" },
        { status: 401 }
      )
    }

    const { bubblerId, rating, comment } = body
    const result = await createReview({ bubblerId, rating, comment, userId })

    if (!result.success)
      return NextResponse.json(
        { sucess: false, error: result.error },
        { status: 500 }
      )

    const review = result.review
    if (!review) {
      log.error({ result }, "Review creation returned success but no review object")
      return NextResponse.json(
        { sucess: false, error: "An error occured whilst posting the review, and our team have been notified. Please try again later!" },
        { status: 500 }
      )
    }

    log.info({ reviewId: review.id, bubblerId, userId, rating, comment, postedBy: session?.user?.id ?? "API Token" }, "Review created")

    const embed = DiscordWebhook.createEmbed(
      {
        title: "Review Posted",
        description: `A new review was posted by ${session?.user?.id ?? "API Token"}`,
        color: 0x55ff55,
        fields: [
          { name: "Review ID", value: `\`${review.id}\``, inline: true },
          { name: "Waypoint ID", value: `\`${review.bubblerId}\``, inline: true },
          { name: "User ID", value: `\`${review.userId}\``, inline: true },
          { name: "Rating", value: review.rating?.toString() || "N/A", inline: true },
          { name: "Comment", value: review.comment || "No content", inline: false },
        ],
        timestamp: new Date().toISOString(),
      }
    )

    await webhook.send(
      {
        content: `<@1222288252623650901> ${review.userId} posted a new review on waypoint ${review.bubblerId}`,
        embeds: [embed]
      }
    )

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    log.error(error, "Failed to post review")
    return NextResponse.json(
      { sucess: false, error: "An error occured whilst posting the review, and our team have been notified. Please try again later!" },
      { status: 500 }
    )
  }
}

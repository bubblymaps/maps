import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/apis/s3"
import { log } from "@/lib/pino"

const env = process.env

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      log.info({ userId: session.user.id }, "No file uploaded")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `${env.PROFILE_IMAGES}/${session.user.id}-${Date.now()}-${file.name}`

    log.info({ userId: session.user.id, fileName: file.name, key }, "Uploading profile image")

    const result = await uploadFile(key, buffer, file.type)

    if (!result.success) {
      log.error({ userId: session.user.id, key }, "Failed to upload profile image")
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    log.info({ userId: session.user.id, url: result.url }, "Profile image uploaded successfully")

    return NextResponse.json({ url: result.url })
  } catch (error) {
    log.error(error, "Unexpected error uploading profile image")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

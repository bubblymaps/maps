import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/s3"

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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `profile_images/${session.user.id}-${Date.now()}-${file.name}`

    const result = await uploadFile(key, buffer, file.type)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
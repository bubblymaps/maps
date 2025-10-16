import { NextRequest, NextResponse } from "next/server"
const env = process.env

export async function GET(req: NextRequest) {
    return NextResponse.json(
        { 
            name: "Bubbly", 
            version: env.BUBBLY_APP_VERSION || "dev", 
            description: "Mapping the world's water fountains.",
            author: "Linus Kang",
            license: "CC BY-NC-SA 4.0",
            repo: "https://github.com/linuskangsoftware/bubbly"
        }
    )
}
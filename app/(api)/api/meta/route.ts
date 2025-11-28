import { NextResponse } from "next/server";
var env = process.env;

export async function GET() {
    return NextResponse.json(
        {
            name: "Bubbly Maps",
            version: env.APP_VERSION,
            license: "CC BY-NC 4.0",
            url: env.URL,
            support: `${env.URL}/support`
        }
    );
}
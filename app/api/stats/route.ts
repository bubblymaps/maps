import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.count();
    const bubblers = await prisma.bubbler.count();
    const reviews = await prisma.review.count();

    return new Response(
      JSON.stringify({ users, bubblers, reviews }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
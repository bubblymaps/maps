import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ error: "Unauthenticated. Please sign in to access this resource." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const isMod = session.user.moderator;

  if (!isMod) {
    return new Response(
      JSON.stringify({ error: "Access Denied: You do not have access to this resource" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const users = await prisma.user.count();
    const bubblers = await prisma.bubbler.count();
    const reviews = await prisma.review.count();
    const awaitingApproval = await prisma.bubbler.count({ where: { approved: false } });
    const verified = await prisma.bubbler.count({ where: { verified: true } });

    return new Response(
      JSON.stringify({ users, bubblers, reviews, awaitingApproval, verified }),
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

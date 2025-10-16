import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
      handle: true,
      bio: true,
      image: true,
      verified: true,
      moderator: true,
      xp: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users);
}
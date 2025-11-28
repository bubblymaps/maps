import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users } from "@/lib/modules/users";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { displayName, handle, bio, image } = body;

  try {
    const updatedUser = await Users.edit(session.user.id, {
      ...(displayName && { displayName }),
      ...(handle && { handle }),
      ...(bio && { bio }),
      ...(image && { image }),
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Internal server error", msg: errorMessage },
      { status: 500 }
    );
  }
}
  
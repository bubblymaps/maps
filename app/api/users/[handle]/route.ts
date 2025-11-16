import { NextRequest, NextResponse } from "next/server";
import { Users } from "@/lib/modules/users";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ handle: string }> }
) {
    try {
        const { handle } = await context.params;
        if (!handle) {
            return NextResponse.json({ error: "Missing handle" }, { status: 400 });
        }

        const user = await Users.getUserByUsername(handle);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userFiltered = {
            ...user,
            email: 0,
            emailVerified: 0,
        };
        
        return NextResponse.json(userFiltered, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

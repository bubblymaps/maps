import { NextResponse } from "next/server";
import { Users } from "@/lib/modules/users";

export async function GET() {
    try {
        const getUsers: Users[] = await Users.all();


        const users = getUsers.map((user) => ({
            ...user,
            email: 0,
            emailVerified: 0,
        }));


        return NextResponse.json(users, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { Users } from "@/lib/modules/users";
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function apiTokenMatches(req: Request) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    return !!token && (token === process.env.API_TOKEN || token === process.env.API_KEY)
}

export async function GET() {
        try {
                const getUsers: Users[] = await Users.all();

                const users = getUsers.map((user) => ({
                        ...user,
                        email: 0,
                        emailVerified: 0,
                }));

                return NextResponse.json(users, { status: 200 });
        } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
                return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const body = await req.json()
        const { id, data } = body
        if (!id || !data) return NextResponse.json({ error: 'Missing id or data' }, { status: 400 })

        // Allow moderators or the user themselves or API token
        if (!session?.user && !apiTokenMatches(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (session?.user?.id !== id && !session?.user?.moderator && !apiTokenMatches(req)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // If caller is a moderator or using API token, allow updating any user fields directly
        if (session?.user?.moderator || apiTokenMatches(req)) {
            const safeData = { ...data } as any
            delete safeData.id
            const updated = await prisma.user.update({ where: { id }, data: safeData })
            return NextResponse.json(updated)
        }

        const updated = await Users.edit(id, data)
        return NextResponse.json(updated)
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user && !apiTokenMatches(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (!session?.user?.moderator && !apiTokenMatches(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await req.json()
        const { action, userId } = body
        if (!action || !userId) return NextResponse.json({ error: 'Missing action or userId' }, { status: 400 })

        if (action === 'mod') {
            const res = await Users.mod(userId)
            return NextResponse.json(res)
        }
        if (action === 'unmod') {
            const res = await Users.unMod(userId)
            return NextResponse.json(res)
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

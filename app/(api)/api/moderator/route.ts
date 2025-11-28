import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Waypoints } from "@/lib/modules/waypoints";
import { Reviews } from "@/lib/modules/reviews";
import { Users } from "@/lib/modules/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function apiTokenMatches(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return !!token && (token === process.env.API_TOKEN || token === process.env.API_KEY)
}

function parseSearchTokens(q: string) {
  // supports tokens like: key:value or key:"multi word value"
  const re = /([a-zA-Z0-9_]+):"([^"]+)"|([a-zA-Z0-9_]+):'([^']+)'|([a-zA-Z0-9_]+):([^\s]+)/g
  const map: Record<string, string[]> = {}
  let m
  while ((m = re.exec(q)) !== null) {
    const key = (m[1] || m[3] || m[5]) as string
    const val = (m[2] || m[4] || m[6]) as string
    if (!map[key]) map[key] = []
    map[key].push(val)
  }
  return map
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'bubblers'
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '25')
    const q = url.searchParams.get('q') || ''

    // auth: only moderators or API token
    const session = await getServerSession(authOptions)
    if (!session?.user && !apiTokenMatches(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!session?.user?.moderator && !apiTokenMatches(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const offset = (Math.max(1, page) - 1) * Math.max(1, limit)

    switch (type) {
      case 'bubblers': {
        if (q) {
          const tokens = parseSearchTokens(q)
          const hasTokens = Object.keys(tokens).length > 0
          if (!hasTokens) {
            const items = await Waypoints.search(q)
            return NextResponse.json({ items })
          }

          const and: any[] = []
          if (tokens.id) and.push({ id: Number(tokens.id[0]) })
          if (tokens.name) and.push({ name: { contains: tokens.name[0] } })
          if (tokens.region) and.push({ region: { contains: tokens.region[0] } })
          if (tokens.maintainer) and.push({ maintainer: { contains: tokens.maintainer[0] } })
          if (tokens.addedBy) and.push({ addedBy: { handle: { contains: tokens.addedBy[0] } } })
          if (tokens.handle) and.push({ addedBy: { handle: { contains: tokens.handle[0] } } })
          if (tokens.approved) and.push({ approved: tokens.approved[0] === 'true' })
          if (tokens.verified) and.push({ verified: tokens.verified[0] === 'true' })

          const where = and.length ? { AND: and } : undefined
          const items = await prisma.bubbler.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { addedBy: { select: { id: true, displayName: true, handle: true } } } })
          const total = await prisma.bubbler.count({ where })
          return NextResponse.json({ items, total })
        }
        const items = await prisma.bubbler.findMany({ orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { addedBy: { select: { id: true, displayName: true, handle: true } } } })
        const total = await prisma.bubbler.count()
        return NextResponse.json({ items, total })
      }
      case 'reviews': {
        if (q) {
          const tokens = parseSearchTokens(q)
          const hasTokens = Object.keys(tokens).length > 0
          if (hasTokens) {
            const and: any[] = []
            if (tokens.id) and.push({ id: Number(tokens.id[0]) })
            if (tokens.bubblerId) and.push({ bubblerId: Number(tokens.bubblerId[0]) })
            if (tokens.userId) and.push({ userId: tokens.userId[0] })
            if (tokens.handle) and.push({ user: { handle: { contains: tokens.handle[0] } } })
            if (tokens.username) and.push({ user: { handle: { contains: tokens.username[0] } } })
            if (tokens.displayName) and.push({ user: { displayName: { contains: tokens.displayName[0] } } })
            if (tokens.bubbler) and.push({ bubbler: { name: { contains: tokens.bubbler[0] } } })
            if (tokens.comment) and.push({ comment: { contains: tokens.comment[0] } })
            if (tokens.rating) {
              const r = Number(tokens.rating[0])
              if (!isNaN(r)) and.push({ rating: r })
            }
            const where = and.length ? { AND: and } : undefined
            const items = await prisma.review.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { user: { select: { id: true, displayName: true, handle: true } }, bubbler: { select: { id: true, name: true } } } })
            const total = await prisma.review.count({ where })
            return NextResponse.json({ items, total })
          }
          // fallback: search comment text
          const where = { OR: [{ comment: { contains: q } }] }
          const items = await prisma.review.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { user: { select: { id: true, displayName: true, handle: true } }, bubbler: { select: { id: true, name: true } } } })
          const total = await prisma.review.count({ where })
          return NextResponse.json({ items, total })
        }

        const items = await prisma.review.findMany({ orderBy: { createdAt: 'desc' }, skip: offset, take: limit, include: { user: { select: { id: true, displayName: true, handle: true } }, bubbler: { select: { id: true, name: true } } } })
        const total = await prisma.review.count()
        return NextResponse.json({ items, total })
      }
      case 'users': {
        if (q) {
          const tokens = parseSearchTokens(q)
          const hasTokens = Object.keys(tokens).length > 0
          if (hasTokens) {
            const and: any[] = []
            if (tokens.id) and.push({ id: tokens.id[0] })
            if (tokens.handle) and.push({ handle: { contains: tokens.handle[0] } })
            if (tokens.displayName) and.push({ displayName: { contains: tokens.displayName[0] } })
            if (tokens.email) and.push({ email: { contains: tokens.email[0] } })
            if (tokens.moderator) and.push({ moderator: tokens.moderator[0] === 'true' })
            if (tokens.verified) and.push({ verified: tokens.verified[0] === 'true' })
            if (tokens.xp) {
              const x = Number(tokens.xp[0])
              if (!isNaN(x)) and.push({ xp: x })
            }
            const where = and.length ? { AND: and } : undefined
            const items = await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, select: { id: true, handle: true, displayName: true, moderator: true, verified: true, xp: true, email: true, bio: true, image: true, createdAt: true, updatedAt: true } })
            const total = await prisma.user.count({ where })
            return NextResponse.json({ items, total })
          }
          const where = { OR: [{ displayName: { contains: q } }, { handle: { contains: q } }, { email: { contains: q } }] }
          const items = await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit, select: { id: true, handle: true, displayName: true, moderator: true, verified: true, xp: true, email: true, bio: true, image: true, createdAt: true, updatedAt: true } })
          const total = await prisma.user.count({ where })
          return NextResponse.json({ items, total })
        }

        const items = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, skip: offset, take: limit, select: { id: true, handle: true, displayName: true, moderator: true, verified: true, xp: true, email: true, bio: true, image: true, createdAt: true, updatedAt: true } })
        const total = await prisma.user.count()
        return NextResponse.json({ items, total })
      }
      case 'logs': {
        const items = await prisma.bubblerLog.findMany({
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            user: { select: { id: true, displayName: true, handle: true } },
            bubbler: { select: { id: true, name: true, region: true, maintainer: true } }
          }
        })
        const total = await prisma.bubblerLog.count()
        return NextResponse.json({ items, total })
      }
      case 'recent': {
        // Return recent users, waypoints, reviews and edits (bubbler logs)
        const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: limit, select: { id: true, handle: true, displayName: true, email: true, xp: true, moderator: true, createdAt: true } })
        const recentWaypoints = await prisma.bubbler.findMany({ orderBy: { createdAt: 'desc' }, take: limit, select: { id: true, name: true, region: true, maintainer: true, createdAt: true, addedBy: { select: { id: true, handle: true, displayName: true } } } })
        const recentReviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: limit, include: { user: { select: { id: true, handle: true, displayName: true } }, bubbler: { select: { id: true, name: true } } } })
        const recentEdits = await prisma.bubblerLog.findMany({ where: { action: 'UPDATE' }, orderBy: { createdAt: 'desc' }, take: limit, include: { user: { select: { id: true, handle: true, displayName: true } }, bubbler: { select: { id: true, name: true } } } })

        return NextResponse.json({ users: recentUsers, waypoints: recentWaypoints, reviews: recentReviews, edits: recentEdits })
      }
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

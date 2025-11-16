import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

import Header from "@/components/header"

function initials(name?: string | null) {
  if (!name) return "?"
  const parts = name.split(" ").filter(Boolean)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}

function formatDate(d: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d)
  } catch {
    return d.toISOString().slice(0, 10)
  }
}

export default async function WaypointsPage() {
  // Fetch hub data in parallel
  const [recentBubblers, recentReviews, topRegions, contribData] =
    await Promise.all([
      prisma.bubbler.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          region: true,
          createdAt: true,
          verified: true,
          addedBy: {
            select: {
              id: true,
              name: true,
              displayName: true,
              handle: true,
              image: true,
              verified: true,
            },
          },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              handle: true,
              image: true,
              verified: true,
            },
          },
          bubbler: {
            select: { id: true, name: true, region: true },
          },
        },
      }),
      prisma.bubbler.groupBy({
        by: ["region"],
        where: { region: { not: null } },
        _count: { region: true },
        orderBy: { _count: { region: "desc" } },
        take: 5,
      }),
      (async () => {
        const [reviewGroups, bubblerGroups] = await Promise.all([
          prisma.review.groupBy({
            by: ["userId"],
            _count: { _all: true },
          }),
          prisma.bubbler.groupBy({
            by: ["addedByUserId"],
            where: { addedByUserId: { not: null } },
            _count: { _all: true },
          }),
        ])

        const totals = new Map<string, number>()
        for (const r of reviewGroups) {
          totals.set(r.userId, (totals.get(r.userId) || 0) + r._count._all)
        }
        for (const b of bubblerGroups) {
          const uid = b.addedByUserId as string
          totals.set(uid, (totals.get(uid) || 0) + b._count._all)
        }

        // Sort and take top 5 userIds
        const topIds = [...totals.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id)

        if (topIds.length === 0)
          return [] as {
            user: {
              id: string
              name: string | null
              displayName: string | null
              handle: string | null
              image: string | null
              verified: boolean
            }
            total: number
          }[]

        const users = await prisma.user.findMany({
          where: { id: { in: topIds } },
          select: {
            id: true,
            name: true,
            displayName: true,
            handle: true,
            image: true,
            verified: true,
          },
        })

        // Preserve order by totals
        const usersById = new Map(users.map((u) => [u.id, u]))
        return topIds
          .map((id) => ({ user: usersById.get(id)!, total: totals.get(id)! }))
          .filter((x) => !!x.user)
      })(),
    ])

  return (
    <div className="container mx-auto space-y-2">
      <Header />
      <header className="space-y-3 pb-2">
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
        {/* Recently added waypoints */}
        <Card>
          <CardHeader>
              <CardTitle>Recently added waypoints</CardTitle>
              <CardDescription>Newest submissions across the map</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waypoint</TableHead>
                    <TableHead>Region</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBubblers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No waypoints yet</EmptyTitle>
                          <EmptyDescription>
                            Be the first to add a waypoint and help the community grow.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentBubblers.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/waypoint/${b.id}`}
                            className="font-medium hover:underline truncate max-w-[20ch] inline-flex"
                          >
                            {b.name}
                          </Link>
                          {b.verified && <Badge>Verified</Badge>}
                        </div>
                        {b.addedBy && (
                          <div className="text-muted-foreground text-xs">
                            by {b.addedBy.displayName || b.addedBy.name || "User"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="truncate max-w-[16ch]">
                        {b.region ?? "—"}
                      </TableCell>
                      <TableCell>{b._count.reviews}</TableCell>
                      <TableCell>{formatDate(new Date(b.createdAt))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent reviews */}
        <Card>
          <CardHeader>
              <CardTitle>Recent reviews</CardTitle>
              <CardDescription>What the community is saying</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Waypoint</TableHead>
                    <TableHead>Rating</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No reviews yet</EmptyTitle>
                          <EmptyDescription>
                            Share your experience at a waypoint to kick things off.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentReviews.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={r.user?.image ?? undefined} />
                            <AvatarFallback>
                              {initials(r.user?.displayName || r.user?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Link
                              href={`/profile/${r.user?.handle ?? r.user?.id}`}
                              className="font-medium hover:underline"
                            >
                              {r.user?.displayName || r.user?.name || "User"}
                            </Link>
                            {r.user?.handle && (
                              <span className="text-muted-foreground text-xs">
                                @{r.user.handle}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/waypoint/${r.bubbler.id}`}
                          className="hover:underline truncate max-w-[24ch] inline-flex"
                        >
                          {r.bubbler.name}
                        </Link>
                        {r.bubbler.region && (
                          <div className="text-muted-foreground text-xs">
                            {r.bubbler.region}
                          </div>
                        )}
                      </TableCell>
                        <TableCell>{r.rating.toFixed(1)}</TableCell>
                      <TableCell>{formatDate(new Date(r.createdAt))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top contributors as list */}
          <Card>
            <CardHeader>
              <CardTitle>Top contributors</CardTitle>
              <CardDescription>Most combined waypoint submissions and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {contribData.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No contributions yet</EmptyTitle>
                    <EmptyDescription>
                      Submit a waypoint or write a review to appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ul className="flex flex-col divide-y">
                  {contribData.map(({ user, total }) => (
                    <li key={user.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar>
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {initials(user.displayName || user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <Link
                            href={`/profile/${user.handle ?? user.id}`}
                            className="font-medium hover:underline truncate max-w-[24ch]"
                          >
                            {user.displayName || user.name || "User"}
                          </Link>
                          {user.handle && (
                            <span className="text-muted-foreground text-xs truncate max-w-[24ch]">
                              @{user.handle}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-2">{total} additions</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Top regions as list */}
          <Card>
            <CardHeader>
              <CardTitle>Top waypoint regions</CardTitle>
              <CardDescription>Where most waypoints are located</CardDescription>
            </CardHeader>
            <CardContent>
              {topRegions.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No regions yet</EmptyTitle>
                    <EmptyDescription>
                      As waypoints are added, regions will appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ul className="flex flex-col divide-y">
                  {topRegions.map((r) => (
                    <li key={r.region ?? "__null__"} className="flex items-center justify-between py-2">
                      <span className="truncate max-w-[24ch]">{r.region ?? "Unknown"}</span>
                      <Badge variant="outline" className="ml-2">{r._count.region}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { prisma } from "@/lib/prisma"

export async function getWaypoints(userId?: string) {
  try {
    const waypoints = await prisma.bubbler.findMany({
      where: userId ? { addedByUserId: userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        addedBy: {
          select: { id: true, image: true, displayName: true, handle: true },
        },
        favorites: true,
        reviews: true,
      },
    })
    return { success: true, waypoints }
  } catch (error) {
    console.error("[WAYPOINTS_GET]", error)
    return { success: false, error: "Failed to fetch waypoints" }
  }
}

export async function createWaypoint(data: {
  name: string
  latitude: number
  longitude: number
  description?: string
  amenities?: string[]
  image?: string
  maintainer?: string
  addedByUserId: string
}) {
  try {
    const newWaypoint = await prisma.bubbler.create({
      data,
    })
    return { success: true, waypoint: newWaypoint }
  } catch (error) {
    console.error("[WAYPOINTS_CREATE]", error)
    return { success: false, error: "Failed to create waypoint" }
  }
}

export async function deleteWaypoint(id: number) {
  try {
    const waypoint = await prisma.bubbler.findUnique({ where: { id } })
    if (!waypoint) return { success: false, error: "Waypoint not found" }

    await prisma.bubbler.delete({ where: { id } })
    return { success: true, message: "Waypoint deleted successfully" }
  } catch (error) {
    console.error("[WAYPOINTS_DELETE]", error)
    return { success: false, error: "Failed to delete waypoint" }
  }
}
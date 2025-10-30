import type React from "react"
import type { Waypoint } from "@/types/waypoints"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, User } from "lucide-react"
import Link from "next/link"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import Image from "next/image"

interface Props {
  waypoint: Waypoint
}

export const WaypointPopup: React.FC<Props> = ({ waypoint }) => {
  const parsedAddedBy =
    typeof waypoint.addedBy === "string"
      ? JSON.parse(waypoint.addedBy)
      : waypoint.addedBy;

  return (
    <Card className="min-w-[270px] max-w-[320px] shadow-lg border border-gray-200 p-0 dark:border-zinc-800">
      {!waypoint.approved && (
        <div className="flex items-center rounded-t-xl gap-2 w-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-b border-amber-300/40 dark:border-b-amber-800 text-sm font-medium p-3">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>This bubbler hasn't been approved yet, it may be inaccurate.</span>
        </div>
      )}

      {waypoint.image && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={waypoint.image || "/placeholder.svg"}
            alt={`Bubbler ${waypoint.name}`}
            width={400}
            height={125}
            className="object-cover w-full h-32 hover:scale-105 transition-transform duration-300 rounded-t-xl"
          />
        </div>
      )}

      <CardHeader className="pt-3 pb-3 px-0">
        <div className="px-3">
          <CardTitle className="text-base font-semibold flex items-center gap-1.5 mb-2">
            {waypoint.name}
            {waypoint.verified && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge className="shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all duration-200 px-1.5 py-0.5">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="text-sm max-w-[220px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Officially verified bubbler from{" "}
                    <Link
                      href={`/profile/${waypoint.addedByUserId}`}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                    >
                      {waypoint.maintainer}
                    </Link>
                  </p>
                </HoverCardContent>
              </HoverCard>
            )}
          </CardTitle>

          {waypoint.description && (
            <div className="mt-2 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 mx-0">
              <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Description
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {waypoint.description.length > 100
                  ? waypoint.description.slice(0, 97) + "…"
                  : waypoint.description}
              </p>
            </div>
          )}
        </div>
      </CardHeader>


      <CardContent className="pt-0 pb-4 px-0 space-y-2">
        <Link
          href={`/profile/${parsedAddedBy?.handle}`}
          className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group w-fit"
        >
          <User className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium">@{parsedAddedBy?.handle}</span>
        </Link>

        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-zinc-800 font-mono">
          {waypoint.latitude.toFixed(5)}, {waypoint.longitude.toFixed(5)}
        </div>
      </CardContent>
    </Card>
  )
}

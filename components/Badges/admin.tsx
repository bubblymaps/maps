"use client"

import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

export function Admin() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          variant="destructive"
          className="p-1 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out  hover:from-red-600 hover:to-red-700 border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1L3 5v6c0 5.25 3.875 10.937 9 12 5.125-1.063 9-6.75 9-12V5l-9-4z" />
          </svg>
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm max-w-[220px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-700 dark:text-zinc-300">
          Official Platform Moderator
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

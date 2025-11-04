import { useState } from "react"
import { WaypointLog } from "@/types/waypoints"
import WaypointLogCard from "./logCard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WaypointLogsListProps {
  logs: WaypointLog[]
  emptyMessage?: string
  logsPerPage?: number
}

export default function WaypointLogsList({ 
  logs, 
  emptyMessage = "No changes yet",
  logsPerPage = 5
}: WaypointLogsListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  if (logs.length === 0) {
    return (
      <div className="text-center py-4 text-xs text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  // Sort logs by date, newest first
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage)
  const startIndex = (currentPage - 1) * logsPerPage
  const endIndex = startIndex + logsPerPage
  const paginatedLogs = sortedLogs.slice(startIndex, endIndex)

  return (
    <div className="space-y-3">
      <div className="relative">
        {paginatedLogs.map((log) => (
          <WaypointLogCard key={log.id} log={log} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, sortedLogs.length)} of {sortedLogs.length}
          </p>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center gap-0.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first, last, current, and pages around current
                const showPage = page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1

                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-xs text-muted-foreground">…</span>
                  }
                  return null
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-7 w-7 p-0 text-xs"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

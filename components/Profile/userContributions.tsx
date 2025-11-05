"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, MapPin } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

import { Badge } from "@/components/ui/badge"

interface Waypoint {
  id: string
  name: string
  location: string
  createdAt: string
}

export default function UserContributions({ userId }: { userId: string }) {
  const [bubblers, setBubblers] = useState<Waypoint[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const router = useRouter();

  const itemsPerPage = 10
  const totalPages = Math.ceil(bubblers.length / itemsPerPage)

  useEffect(() => {
    const fetchBubblers = async () => {
      try {
        const res = await fetch(`/api/waypoints?userId=${userId}`)
        const data: Waypoint[] = await res.json()
        setBubblers(data)
      } catch (error) {
        console.error("Failed to load bubblers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBubblers()
  }, [userId])

  const currentItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return bubblers.slice(start, start + itemsPerPage)
  }, [page, bubblers])

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))
  const goToPage = (p: number) => setPage(p)

  // Windowed pagination: show only a few pages around current
  const paginationWindow = 2
  const visiblePages = []
  const startPage = Math.max(1, page - paginationWindow)
  const endPage = Math.min(totalPages, page + paginationWindow)

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">User Contributions</h2>
        {!loading && bubblers.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {bubblers.length} entries
          </Badge>
        )}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" disabled>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
          </Button>
        </div>
      )}

      {!loading && bubblers.length === 0 && <p className="text-muted-foreground">No bubbler contributions yet.</p>}

      <div className="space-y-3">
        {currentItems.map((bubbler) => (
          <div key={bubbler.id} onClick={() => router.push(`/waypoint/${bubbler.id}`)} className="cursor-pointer flex items-center justify-between bg-muted/50 border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Added {bubbler.name}</p>
                <p className="text-sm text-muted-foreground">
                  {bubbler.location}{" "}
                  <Badge variant="secondary" className="font-mono text-xs">
                    id: {bubbler.id}
                  </Badge>
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{new Date(bubbler.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={page === 1 ? undefined : goPrev}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {visiblePages[0] > 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => goToPage(1)} className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {visiblePages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => goToPage(p)} isActive={p === page} className="cursor-pointer">
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {visiblePages[visiblePages.length - 1] < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => goToPage(totalPages)} className="cursor-pointer">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={page === totalPages ? undefined : goNext}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
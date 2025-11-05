"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, MapPin, Star } from "lucide-react"
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

// --- Define the review type to match your backend ---
interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  bubbler: {
    id: number
    name: string
  }
}

export default function UserContributions({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const router = useRouter()
  const itemsPerPage = 10
  const totalPages = Math.ceil(reviews.length / itemsPerPage)

  // --- Fetch reviews ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?userId=${userId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        // API returns { reviews: Review[] }
        setReviews(data?.reviews || [])
      } catch (error) {
        console.error("Failed to load reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchReviews()
  }, [userId])

  const currentItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return reviews.slice(start, start + itemsPerPage)
  }, [page, reviews])

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))
  const goToPage = (p: number) => setPage(p)

  const paginationWindow = 2
  const visiblePages = []
  const startPage = Math.max(1, page - paginationWindow)
  const endPage = Math.min(totalPages, page + paginationWindow)

  for (let i = startPage; i <= endPage; i++) visiblePages.push(i)

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">User’s Reviews</h2>
        {!loading && reviews.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {reviews.length} total
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

      {!loading && reviews.length === 0 && (
        <p className="text-muted-foreground">
          User has not reviewed any fountains yet.
        </p>
      )}

      {/* --- Review List --- */}
      <div className="space-y-3">
        {currentItems.map((review) => (
          <div
            key={review.id}
            onClick={() => router.push(`/waypoint/${review.bubbler.id}`)}
            className="cursor-pointer flex flex-col gap-2 bg-muted/50 border rounded-lg p-3 hover:bg-muted transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">{review.bubbler.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>

            {review.comment && (
              <p className="text-sm text-muted-foreground italic">
                “{review.comment}”
              </p>
            )}
          </div>
        ))}
      </div>

      {/* --- Pagination --- */}
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

            {startPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

            {visiblePages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => goToPage(p)}
                  isActive={p === page}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

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
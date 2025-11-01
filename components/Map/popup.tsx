import type React from "react"
import type { Waypoint } from "@/types/waypoints"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, User, MapPin, Globe, Navigation } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Verified } from "@/components/Badges/verified"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Star, StarHalf } from "lucide-react"
import { toast } from "sonner"

interface Props {
  waypoint: Waypoint
}

export const WaypointPopup: React.FC<Props> = ({ waypoint }) => {
  const [reviews, setReviews] = useState<{ rating: number }[]>([])
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?bubblerId=${waypoint.id}`)
        const data = await res.json()
        const bubblerReviews = data.reviews || []

        setReviews(bubblerReviews)

        if (bubblerReviews.length > 0) {
          const sum = bubblerReviews.reduce(
            (acc: number, r: { rating: number | string }) => acc + Number(r.rating), // <-- Convert to number
            0
          )
          setAvgRating(sum / bubblerReviews.length)

          console.log(sum)
        } else {
          setAvgRating(0)
        }
      } catch (err) {
        console.error(err)
        toast.error("There was an error getting reviews for this waypoint. Please try again later.")
        setAvgRating(0)
      }
    }
    fetchReviews()
  }, [waypoint.id])


  const parsedAddedBy = typeof waypoint.addedBy === "string" ? JSON.parse(waypoint.addedBy) : waypoint.addedBy
  const amenities: string[] = Array.isArray(waypoint.amenities)
    ? waypoint.amenities
    : typeof waypoint.amenities === "string"
      ? JSON.parse(waypoint.amenities)
      : []

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)
      else if (rating >= i - 0.5) stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-500" />)
      else stars.push(<Star key={i} className="h-4 w-4 text-yellow-500" />) // empty star
    }
    return stars
  }

  return (
    <Card className="min-w-[280px] max-w-[500px] shadow-xl border-border/60 p-0 overflow-hidden backdrop-blur-sm bg-card/95 gap-0">
      {!waypoint.approved && (
        <div className="flex items-start gap-2.5 w-full bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-b border-amber-200/60 dark:border-amber-800/60 text-sm font-medium px-4 py-3 mb-0">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">This bubbler hasn't been approved yet and may be inaccurate.</span>
        </div>
      )}

      {waypoint.image && (
        <div className="relative w-full h-36 overflow-hidden bg-muted mb-5">
          <Image
            src={waypoint.image}
            alt={`Bubbler ${waypoint.name}`}
            width={400}
            height={144}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      <CardHeader className={`pb-3 px-4 ${waypoint.image ? "pt-0" : "pt-4"}`}>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 mb-1 text-balance leading-tight">
          {waypoint.name}
          {waypoint.verified && (
            <Verified
              content={
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Officially verified bubbler from{" "}
                  <Link
                    href={`/profile/${waypoint.addedByUserId}`}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                  >
                    {waypoint.maintainer}
                  </Link>
                </p>
              }
            />
          )}
        </CardTitle>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {renderStars(avgRating)}
            <span className="text-sm font-medium text-foreground/80">({reviews.length})</span>
          </div>
        )}

        {waypoint.description && (
          <div className="mt-3 border border-border/60 bg-muted/30 rounded-lg p-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
              {waypoint.description.length > 120 ? waypoint.description.slice(0, 117) + "…" : waypoint.description}
            </p>
          </div>
        )}

        {amenities && amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 pb-4 px-4 space-y-3">
        <div className="space-y-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Details</h4>

          <div className="space-y-2.5">
            {waypoint.maintainer && (
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm text-foreground">{waypoint.maintainer}</span>
              </div>
            )}

            <Link
              href={`/profile/${parsedAddedBy?.handle}`}
              className="flex items-center gap-2.5 text-primary transition-colors group"
            >
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="font-medium text-sm">@{parsedAddedBy?.handle}</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs tabular-nums">
                {waypoint.latitude.toFixed(5)}, {waypoint.longitude.toFixed(5)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <Button asChild variant="outline" className="w-full text-sm font-medium">
            <Link href={`/waypoint/${waypoint.id}`}>View More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

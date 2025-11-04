"use client"

import { useState, useEffect } from "react"
import { useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, StarHalf, Sparkles, Pencil, Flag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import CoordinatePicker from "@/components/Map/coordinate-picker"
import { Verified } from "@/components/Badges/verified"
import { Waypoint, WaypointLog } from "@/types/waypoints"
import { useSession } from "next-auth/react"
import { Admin } from "@/components/Badges/admin"
import PointMap from "@/components/Map/point"
import Header from "@/components/header"
import { WaypointLogsList } from "@/components/Map/WaypointLog"
import AIReviewSummary from "@/components/Ai/summary.reviews"

interface Review {
    id: number
    rating: number
    comment?: string
    createdAt?: string | Date
    updatedAt?: string | Date
    user: {
        id: string
        displayName: string
        handle: string
        moderator: boolean
        verified: boolean
        image?: string
    }
}

export default function WaypointPage() {
    const { id } = useParams()
    const { data: session, status } = useSession()
    const [waypoint, setWaypoint] = useState<Waypoint | null>(null)
    const [waypointLogs, setWaypointLogs] = useState<WaypointLog[]>([])
    const [reviews, setReviews] = useState<Review[]>([])
    const [avgRating, setAvgRating] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [ratingInput, setRatingInput] = useState<number>(0)
    const [commentInput, setCommentInput] = useState<string>("")
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        description: "",
        maintainer: "",
        region: "",
        image: "",
        latitude: 0,
        longitude: 0,
        amenities: [] as string[],
    })
    const [updating, setUpdating] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [deleting, setDeleting] = useState(false)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [submittingReport, setSubmittingReport] = useState(false)
    const [reportSubmitted, setReportSubmitted] = useState(false)
    const reviewsPerPage = 5

    useEffect(() => {
        async function fetchWaypoint() {
            try {
                const res = await fetch(`/api/waypoints/${id}`)
                const data = await res.json()
                setWaypoint(data.waypoint)
                setWaypointLogs(data.logs || [])
                setReviews(data.waypoint?.reviews || [])
            } catch (err) {
                console.error("Failed to fetch waypoint", err)
            }
        }
        fetchWaypoint()
    }, [id])

    useEffect(() => {
  if (waypoint) {
    console.log("reviews:", waypoint.reviews)
  }
}, [waypoint])


    // Update edit data when waypoint changes
    useEffect(() => {
        if (waypoint) {
            setEditData({
                name: waypoint.name || "",
                description: waypoint.description || "",
                maintainer: waypoint.maintainer || "",
                region: waypoint.region || "",
                image: waypoint.image || "",
                latitude: waypoint.latitude || 0,
                longitude: waypoint.longitude || 0,
                amenities: Array.isArray(waypoint.amenities) ? waypoint.amenities :
                    typeof waypoint.amenities === "string" ? JSON.parse(waypoint.amenities) : [],
            })
        }
    }, [waypoint])

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch(`/api/reviews?bubblerId=${id}`)
                const data = await res.json()
                const bubblerReviews: Review[] = data.reviews || []
                setReviews(bubblerReviews)
            } catch (err) {
                console.error("Failed to fetch reviews", err)
            }
        }
        fetchReviews()
    }, [id])

    useEffect(() => {
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0)
            setAvgRating(sum / reviews.length)
        } else {
            setAvgRating(0)
        }
    }, [reviews])

    async function submitReview() {
        if (!id) return
        if (!ratingInput) return
        try {
            setSubmitting(true)
            const res = await fetch(`/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bubblerId: Number(id),
                    rating: ratingInput,
                    comment: commentInput?.trim() || undefined,
                }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e?.error || `Failed to submit review (${res.status})`)
            }
            const data = await res.json()
            const posted = data.review as Review
            const withUser: Review = posted?.user
                ? posted
                : {
                    ...posted,
                    user: {
                        id: session!.user.id,
                        displayName: session!.user.displayName || session!.user.name || "You",
                        handle: session!.user.handle || "you",
                        moderator: false,
                        verified: false,
                    },
                }
            setReviews(prev => [withUser, ...prev.filter(r => r.user.id !== withUser.user.id)])
            setRatingInput(0)
            setCommentInput("")
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    async function deleteMyReview() {
        try {
            setDeleting(true)
            const reviewId = myReview?.id
            if (!reviewId) return
            const res = await fetch(`/api/reviews?id=${reviewId}`, {
                method: "DELETE",
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e?.error || `Failed to delete review (${res.status})`)
            }
            setReviews(prev => prev.filter(r => r.id !== reviewId))
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    async function submitReport() {
        if (!reportReason.trim()) return
        try {
            setSubmittingReport(true)
            const res = await fetch(`/api/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "waypoint",
                    targetId: String(id),
                    reason: reportReason.trim(),
                }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e?.error || `Failed to submit report (${res.status})`)
            }
            setReportSubmitted(true)
            setReportReason("")
            setTimeout(() => {
                setReportDialogOpen(false)
                setReportSubmitted(false)
            }, 2000)
        } catch (err) {
            console.error(err)
            alert("Failed to submit report. Please try again.")
        } finally {
            setSubmittingReport(false)
        }
    }

    function handleSaveClick() {
        // Show confirmation dialog
        setShowConfirmDialog(true)
    }

    async function confirmUpdateWaypoint() {
        try {
            setUpdating(true)
            setShowConfirmDialog(false)
            const res = await fetch(`/api/waypoints/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editData.name,
                    description: editData.description,
                    maintainer: editData.maintainer,
                    region: editData.region,
                    image: editData.image,
                    latitude: editData.latitude,
                    longitude: editData.longitude,
                    amenities: editData.amenities,
                }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e?.error || `Failed to update waypoint (${res.status})`)
            }
            const updated = await res.json()
            setWaypoint(updated)
            setEditDialogOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setUpdating(false)
        }
    }

    // Pagination logic
    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA // Latest first
        })
    }, [reviews])

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * reviewsPerPage
        return sortedReviews.slice(startIndex, startIndex + reviewsPerPage)
    }, [sortedReviews, currentPage])

    // Reset to page 1 when reviews change
    useEffect(() => {
        setCurrentPage(1)
    }, [reviews.length])

    // Helper to get changes between original and edited data
    const getChanges = useMemo(() => {
        if (!waypoint) return []
        const changes: Array<{ field: string; old: string; new: string }> = []

        if (editData.name !== waypoint.name) {
            changes.push({ field: "Name", old: waypoint.name, new: editData.name })
        }
        if (editData.description !== (waypoint.description || "")) {
            changes.push({ field: "Description", old: waypoint.description || "(empty)", new: editData.description || "(empty)" })
        }
        if (editData.maintainer !== (waypoint.maintainer || "")) {
            changes.push({ field: "Maintainer", old: waypoint.maintainer || "(empty)", new: editData.maintainer || "(empty)" })
        }
        if (editData.region !== (waypoint.region || "")) {
            changes.push({ field: "Region", old: waypoint.region || "(empty)", new: editData.region || "(empty)" })
        }
        if (editData.image !== (waypoint.image || "")) {
            changes.push({ field: "Image URL", old: waypoint.image || "(empty)", new: editData.image || "(empty)" })
        }
        if (editData.latitude.toFixed(6) !== waypoint.latitude.toFixed(6)) {
            changes.push({ field: "Latitude", old: waypoint.latitude.toFixed(6), new: editData.latitude.toFixed(6) })
        }
        if (editData.longitude.toFixed(6) !== waypoint.longitude.toFixed(6)) {
            changes.push({ field: "Longitude", old: waypoint.longitude.toFixed(6), new: editData.longitude.toFixed(6) })
        }

        const originalAmenities = Array.isArray(waypoint.amenities) ? waypoint.amenities :
            typeof waypoint.amenities === "string" ? JSON.parse(waypoint.amenities) : []
        const amenitiesChanged = JSON.stringify(editData.amenities.sort()) !== JSON.stringify(originalAmenities.sort())
        if (amenitiesChanged) {
            changes.push({
                field: "Amenities",
                old: originalAmenities.join(", ") || "(none)",
                new: editData.amenities.join(", ") || "(none)"
            })
        }

        return changes
    }, [waypoint, editData])
    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push(<Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)
            else if (rating >= i - 0.5) stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-500" />)
            else stars.push(<Star key={i} className="h-5 w-5 text-yellow-500" />)
        }
        return stars
    }

    const myReview = useMemo(() => {
        const uid = session?.user?.id
        if (!uid) return null
        return reviews.find(r => r.user.id === uid) || null
    }, [reviews, session])

    if (!waypoint) return <p className="text-center mt-20">Loading...</p>

    const amenities: string[] = Array.isArray(waypoint.amenities)
        ? waypoint.amenities
        : typeof waypoint.amenities === "string"
            ? JSON.parse(waypoint.amenities)
            : []

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <Header />

            {waypoint.image && (
                <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-xl shadow-xl">
                    <Image
                        src={waypoint.image}
                        alt={waypoint.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-lg border-border/60">
                        <CardHeader className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl font-bold">
                                        {waypoint.name}
                                        {waypoint.verified && <Verified content={
                                            <p className="text-sm text-foreground/90 leading-relaxed">
                                                Officially verified bubbler from{" "}
                                                <Link
                                                    href={`/profile/${waypoint.addedByUserId}`}
                                                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                                                >
                                                    {waypoint.maintainer}
                                                </Link>
                                            </p>
                                        } />}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {renderStars(avgRating)}
                                        <span className="text-sm font-medium text-foreground/70">({reviews.length})</span>
                                    </div>
                                </div>

                                {waypoint.description && (
                                    <p className="text-base text-foreground/80 leading-relaxed">
                                        {waypoint.description}
                                    </p>
                                )}
                            </div>

                            {amenities && amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {amenities.map((amenity, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-medium px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800/50"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                    </Card>

                    <Card className="shadow-lg border-border/60">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Reviews & Ratings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-base font-semibold mb-3">Write a Review</h4>
                                {status === "loading" ? (
                                    <p className="text-sm text-foreground/70">Checking your session…</p>
                                ) : !session ? (
                                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
                                        <p className="text-sm text-foreground/80">Sign in to share your experience with this bubbler.</p>
                                        <Button asChild size="sm" variant="default">
                                            <Link href="/signin">Sign in</Link>
                                        </Button>
                                    </div>
                                ) : myReview ? (
                                    <div className="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl space-y-3">
                                        {/* Decorative corner */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>

                                        <div className="relative">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Your Review</span>
                                                        {myReview.createdAt && (
                                                            <span className="text-xs text-muted-foreground">
                                                                • {new Date(myReview.createdAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(myReview.rating)}
                                                        <span className="text-sm font-medium text-foreground/70">
                                                            {myReview.rating} {myReview.rating === 1 ? "star" : "stars"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={deleteMyReview}
                                                    disabled={deleting}
                                                >
                                                    {deleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                            {myReview.comment && (
                                                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                                                    <p className="text-sm text-foreground/90 leading-relaxed">{myReview.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 p-5">
                                        {/* Rating Selection */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-foreground">Rate your experience</label>
                                            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/40">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setRatingInput(i)}
                                                        className="group transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg p-1"
                                                        aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                                                    >
                                                        <Star
                                                            className={
                                                                "h-8 w-8 transition-all duration-200 " +
                                                                (ratingInput >= i
                                                                    ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                                                                    : "text-gray-300 dark:text-gray-600 group-hover:text-yellow-400 dark:group-hover:text-yellow-500")
                                                            }
                                                        />
                                                    </button>
                                                ))}
                                                {ratingInput > 0 && (
                                                    <div className="ml-3 flex items-center gap-2">
                                                        <span className="text-2xl font-bold text-foreground">{ratingInput}</span>
                                                        <span className="text-sm text-muted-foreground">/ 5</span>
                                                    </div>
                                                )}
                                            </div>
                                            {ratingInput > 0 && (
                                                <p className="text-xs text-muted-foreground pl-1">
                                                    {ratingInput === 5 ? "Excellent!" :
                                                        ratingInput === 4 ? "Very good" :
                                                            ratingInput === 3 ? "Good" :
                                                                ratingInput === 2 ? "Could be better" :
                                                                    "Needs improvement"}
                                                </p>
                                            )}
                                        </div>

                                        {/* Comment Section */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">
                                                Share your thoughts <span className="text-muted-foreground font-normal">(optional)</span>
                                            </label>
                                            <textarea
                                                value={commentInput}
                                                onChange={e => setCommentInput(e.target.value)}
                                                rows={4}
                                                placeholder="What did you like or dislike? How was the water quality, accessibility, or cleanliness?"
                                                className="w-full rounded-lg border border-border/60 bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
                                            />
                                            <p className="text-xs text-muted-foreground pl-1">
                                                {commentInput.length} characters
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex items-center justify-between pt-2">
                                            <p className="text-xs text-muted-foreground">
                                                Your review will be public
                                            </p>
                                            <Button
                                                size="default"
                                                disabled={!ratingInput || submitting}
                                                onClick={submitReview}
                                                className="min-w-[120px]"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <span className="animate-pulse">Posting</span>
                                                        <span className="ml-1">...</span>
                                                    </>
                                                ) : "Post Review"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-base font-semibold">
                                    Community Reviews {reviews.length > 0 && `(${reviews.length})`}
                                </h4>

                                {reviews.length >= 2 && (
                                    <div className="relative group">
                                       <AIReviewSummary reviews={reviews.filter(r => r.comment).map(r => ({ rating: r.rating, comment: r.comment! }))} />
                                    </div>
                                )}

                                {reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Showing {((currentPage - 1) * reviewsPerPage) + 1}-{Math.min(currentPage * reviewsPerPage, sortedReviews.length)} of {sortedReviews.length}
                                            </p>
                                            {totalPages > 1 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Page {currentPage} of {totalPages}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {paginatedReviews.map(r => {
                                                const isMyReview = session?.user?.id === r.user.id
                                                const reviewDate = r.createdAt ? new Date(r.createdAt) : null
                                                const now = new Date()
                                                let timeAgo = ""

                                                if (reviewDate) {
                                                    const diffMs = now.getTime() - reviewDate.getTime()
                                                    const diffMins = Math.floor(diffMs / 60000)
                                                    const diffHours = Math.floor(diffMs / 3600000)
                                                    const diffDays = Math.floor(diffMs / 86400000)
                                                    const diffMonths = Math.floor(diffDays / 30)
                                                    const diffYears = Math.floor(diffDays / 365)

                                                    if (diffMins < 1) timeAgo = "Just now"
                                                    else if (diffMins < 60) timeAgo = `${diffMins}m ago`
                                                    else if (diffHours < 24) timeAgo = `${diffHours}h ago`
                                                    else if (diffDays < 30) timeAgo = `${diffDays}d ago`
                                                    else if (diffMonths < 12) timeAgo = `${diffMonths}mo ago`
                                                    else timeAgo = `${diffYears}y ago`
                                                }

                                                return (
                                                    <div
                                                        key={r.id}
                                                        className={`group border rounded-xl p-5 transition-all duration-200 ${isMyReview
                                                            ? "bg-primary/5 border-primary/30 hover:border-primary/50 hover:shadow-lg"
                                                            : "bg-card border-border/60 hover:border-border hover:shadow-md"
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="relative">
                                                                {r.user.image ? (
                                                                    <img
                                                                        src={r.user.image}
                                                                        alt={r.user.handle}
                                                                        className="w-10 h-10 rounded-full border-2 border-border/40 flex-shrink-0 object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full border-2 border-border/40 flex-shrink-0 bg-muted flex items-center justify-center">
                                                                        <span className="text-sm font-semibold text-muted-foreground">
                                                                            {r.user.handle.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0 space-y-2">
                                                                {/* Header with user info and stars */}
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className="text-sm font-semibold text-foreground">
                                                                                @{r.user.handle}
                                                                            </span>
                                                                            {r.user.verified && <Verified
                                                                                content={
                                                                                    <p className="text-zinc-700 dark:text-zinc-300">
                                                                                        Official account of a government, organization, or recognized entity.{" "}
                                                                                        <Link
                                                                                            href="/help/verified"
                                                                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                                                                                        >
                                                                                            Learn more.
                                                                                        </Link>
                                                                                    </p>
                                                                                }
                                                                            />}
                                                                            {r.user.moderator && <Admin />}
                                                                            {isMyReview && (
                                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                                                                    You
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                            {timeAgo && (
                                                                                <>
                                                                                    <span>{timeAgo}</span>
                                                                                    {reviewDate && (
                                                                                        <>
                                                                                            <span>•</span>
                                                                                            <span className="hidden sm:inline" title={reviewDate.toLocaleString()}>
                                                                                                {reviewDate.toLocaleDateString()}
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Star rating */}
                                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                                        {renderStars(r.rating)}
                                                                    </div>
                                                                </div>

                                                                {/* Comment */}
                                                                {r.comment && (
                                                                    <p className="text-sm text-foreground/90 leading-relaxed pt-1">
                                                                        {r.comment}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/60">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="h-9"
                                                >
                                                    Previous
                                                </Button>

                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                                        // Show first page, last page, current page, and pages around current
                                                        const showPage = page === 1 ||
                                                            page === totalPages ||
                                                            Math.abs(page - currentPage) <= 1

                                                        if (!showPage) {
                                                            // Show ellipsis
                                                            if (page === currentPage - 2 || page === currentPage + 2) {
                                                                return <span key={page} className="px-2 text-muted-foreground">...</span>
                                                            }
                                                            return null
                                                        }

                                                        return (
                                                            <Button
                                                                key={page}
                                                                variant={currentPage === page ? "default" : "ghost"}
                                                                size="sm"
                                                                onClick={() => setCurrentPage(page)}
                                                                className="h-9 w-9 p-0"
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
                                                    className="h-9"
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground/60 text-center py-8 border border-dashed border-border/60 rounded-lg">
                                        No reviews yet. Be the first to review this bubbler!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {waypointLogs.length > 0 && (
                        <Card className="shadow-lg border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Change History</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <WaypointLogsList logs={waypointLogs} />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg border-border/60">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Details</CardTitle>
                                <div className="flex items-center gap-2">
                                    {session && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" variant="outline" className="h-8 gap-2">
                                                                <Flag className="h-3.5 w-3.5" />
                                                                Report
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Report an Issue</DialogTitle>
                                                            </DialogHeader>
                                                            {reportSubmitted ? (
                                                                <div className="py-8 text-center space-y-3">
                                                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                                                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                    <p className="text-sm font-medium">Report submitted successfully</p>
                                                                    <p className="text-xs text-muted-foreground">Thank you for helping keep our community safe</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="report-reason">What's the issue with this waypoint?</Label>
                                                                        <Textarea
                                                                            id="report-reason"
                                                                            value={reportReason}
                                                                            onChange={(e) => setReportReason(e.target.value)}
                                                                            placeholder="Describe the issue (e.g., incorrect location, inappropriate content, spam, etc.)"
                                                                            rows={5}
                                                                            className="resize-none"
                                                                        />
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {reportReason.length} characters
                                                                        </p>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => setReportDialogOpen(false)}
                                                                            disabled={submittingReport}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={submitReport}
                                                                            disabled={!reportReason.trim() || submittingReport}
                                                                        >
                                                                            {submittingReport ? "Submitting..." : "Submit Report"}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Report an issue with this waypoint</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                    {session && (
                                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="h-8 gap-2">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Waypoint Details</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Name</Label>
                                                        <Input
                                                            id="name"
                                                            value={editData.name}
                                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                            placeholder="Bubbler name"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea
                                                            id="description"
                                                            value={editData.description}
                                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                            placeholder="Describe this bubbler..."
                                                            rows={4}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="image">Image URL</Label>
                                                        <Input
                                                            id="image"
                                                            value={editData.image}
                                                            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                                                            placeholder="https://example.com/image.jpg"
                                                        />
                                                        <div className="mt-2">
                                                            {editData.image ? (
                                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/60 bg-muted/20">
                                                                    {/* Use plain img to avoid Next.js remotePatterns limits in preview */}
                                                                    <img
                                                                        src={editData.image}
                                                                        alt="Image preview"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-full h-24 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground flex items-center justify-center">
                                                                    Enter a URL to preview
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="maintainer">Maintainer</Label>
                                                            <Input
                                                                id="maintainer"
                                                                value={editData.maintainer}
                                                                onChange={(e) => setEditData({ ...editData, maintainer: e.target.value })}
                                                                placeholder="Maintainer name"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="region">Region</Label>
                                                            <Input
                                                                id="region"
                                                                value={editData.region}
                                                                onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                                                                placeholder="Region"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Location (Drag map to adjust)</Label>
                                                        <CoordinatePicker
                                                            longitude={editData.longitude}
                                                            latitude={editData.latitude}
                                                            zoom={16}
                                                            className="w-full h-80 rounded-lg border border-border/60"
                                                            onCoordinateChange={(lng, lat) => {
                                                                setEditData({ ...editData, longitude: lng, latitude: lat })
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="latitude">Latitude</Label>
                                                            <Input
                                                                id="latitude"
                                                                type="number"
                                                                step="0.000001"
                                                                value={editData.latitude.toFixed(6)}
                                                                onChange={(e) => setEditData({ ...editData, latitude: parseFloat(e.target.value) || 0 })}
                                                                placeholder="Latitude"
                                                                className="font-mono text-sm"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="longitude">Longitude</Label>
                                                            <Input
                                                                id="longitude"
                                                                type="number"
                                                                step="0.000001"
                                                                value={editData.longitude.toFixed(6)}
                                                                onChange={(e) => setEditData({ ...editData, longitude: parseFloat(e.target.value) || 0 })}
                                                                placeholder="Longitude"
                                                                className="font-mono text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                                                        <Input
                                                            id="amenities"
                                                            value={editData.amenities.join(", ")}
                                                            onChange={(e) => setEditData({
                                                                ...editData,
                                                                amenities: e.target.value.split(",").map(a => a.trim()).filter(Boolean)
                                                            })}
                                                            placeholder="e.g., Wheelchair accessible, Water fountain, Bottle refill"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                                                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                                                        By updating a waypoint, you agree to the platform terms and privacy policies.
                                                    </p>
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleSaveClick} disabled={updating}>
                                                            {updating ? "Saving..." : "Save Changes"}
                                                        </Button>
                                                    </div>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                {/* Confirmation Dialog */}
                                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                                    <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Please review the changes you're about to make to this waypoint.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <div className="py-4">
                                            {getChanges.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-4">
                                                    No changes detected.
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium">
                                                        {getChanges.length} {getChanges.length === 1 ? "field" : "fields"} will be updated:
                                                    </p>
                                                    <div className="space-y-2 border border-border/60 rounded-lg p-4 bg-muted/20">
                                                        {getChanges.map((change, idx) => (
                                                            <div key={idx} className="space-y-1 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                                                                <div className="text-sm font-semibold text-foreground">
                                                                    {change.field}
                                                                </div>
                                                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start text-xs">
                                                                    <div className="space-y-1">
                                                                        <span className="text-muted-foreground">Current:</span>
                                                                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded px-2 py-1.5 text-red-700 dark:text-red-400 break-words">
                                                                            {change.old}
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-6 text-muted-foreground">→</div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-muted-foreground">New:</span>
                                                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded px-2 py-1.5 text-green-700 dark:text-green-400 break-words">
                                                                            {change.new}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={updating}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={confirmUpdateWaypoint}
                                                disabled={updating || getChanges.length === 0}
                                            >
                                                {updating ? "Saving..." : "Confirm & Save"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm">
                                {waypoint.region && waypoint.region.trim() !== "" && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Maintainer</span>
                                        <span className="text-foreground/80">{waypoint.maintainer}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Added By</span>
                                    <span className="text-foreground/80 flex items-center gap-1.5">
                                        @{waypoint.addedBy?.handle}
                                        {waypoint.addedBy?.verified && (
                                            <Verified
                                                content={
                                                    <p className="text-zinc-700 dark:text-zinc-300">
                                                        Official account of a government, organization, or recognized entity.{" "}
                                                        <Link
                                                            href="/help/verified"
                                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                                                        >
                                                            Learn more.
                                                        </Link>
                                                    </p>
                                                }
                                            />
                                        )}
                                        {waypoint.addedBy?.moderator && <Admin />}
                                    </span>
                                </div>

                                {waypoint.region && waypoint.region.trim() !== "" && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Region</span>
                                        <span className="text-foreground/80">{waypoint.region}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coordinates</span>
                                    <span className="text-foreground/80 font-mono text-xs">
                                        {waypoint.latitude.toFixed(5)}, {waypoint.longitude.toFixed(5)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                                    <span className={`inline-flex items-center w-fit px-2 py-1 rounded-full text-xs font-medium ${waypoint.approved
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                        }`}>
                                        {waypoint.approved ? "Approved" : "Pending Approval"}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Created:</span>
                                        <span>{new Date(waypoint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Updated:</span>
                                        <span>{new Date(waypoint.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <PointMap
                                longitude={waypoint.longitude}
                                latitude={waypoint.latitude}
                                zoom={15}
                                className="w-full h-64 rounded-b-lg"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

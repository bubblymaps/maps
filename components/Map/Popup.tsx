"use client"
import type { Waypoint } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, MapPin, AlertTriangle, ChevronRight, Star } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import Link from "next/link"
import Image from "next/image"

interface BubblerPopupProps {
    wp: Waypoint
}

export function BubblerPopup({ wp }: BubblerPopupProps) {
    const reviewCount = wp.reviews?.length || 0
    const averageRating =
        reviewCount > 0
            ? ((wp.reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0) / reviewCount)
            : 0

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 min-w-[300px] max-w-[350px] backdrop-blur-sm ">
            {!wp.approved && (
                <div className="flex items-center rounded-t-xl gap-2 w-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-b border-amber-300/40 dark:border-b-amber-800 text-sm font-medium p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>This bubbler hasn't been approved yet, it may be inaccurate or fake.</span>
                </div>
            )}

            {wp.image && (
                <div className="relative w-full overflow-hidden">
                    <Image
                        src={wp.image}
                        alt={`Bubbler ${wp.name}`}
                        width={400}
                        height={150}
                        className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300 rounded-t-xl"
                    />
                </div>
            )}
            <div className="p-3 space-y-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white leading-tight text-balance">
                            {wp.name}
                        </h3>

                        {wp.verified && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Badge className="shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all duration-200 px-2 py-1">
                                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                                    </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-sm max-w-[220px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        Verified by{" "}
                                        <Link
                                            href={`/profile/${wp.addedBy.handle}`}
                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                                        >
                                            {wp.maintainer}
                                        </Link>
                                    </p>
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </div>

                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                            <span className="font-semibold">{averageRating.toFixed(1)}</span>
                            <span>({reviewCount})</span>
                        </div>
                    )}
                </div>

                {wp.description && (
                    <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 rounded-lg p-3">
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                            Description:
                        </p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">
                            {wp.description}
                        </p>
                    </div>
                )}

                {wp.amenities && wp.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {wp.amenities.map((a) => (
                            <Badge
                                key={a}
                                variant="secondary"
                                className="text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-150"
                            >
                                {a}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <Link
                            href={`/profile/${wp.addedBy.handle}`}
                            className="block w-full"
                        >
                            <span className="text-zinc-500 dark:text-zinc-500">
                                Added by{" "}
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                    @{wp.addedBy.handle}
                                </span>
                            </span>
                        </Link>
                        <span className="text-zinc-500 dark:text-zinc-500">
                            Maintained by{" "}
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                {wp.maintainer || "N/A"}
                            </span>
                        </span>
                    </div>
                </div>

                <Link href={`/bubbler/${wp.id}`} className="block">
                    <Button className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 group cursor-pointer">
                        View More
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

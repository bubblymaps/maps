"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { SearchBar } from "@/components/Map/search"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface StatsResp {
  totalWaypoints: number
  totalVerifiedWaypoints: number
  totalUsers: number
  totalReviews: number
  totalContributions: number
}

export default function HomePage() {
  const router = useRouter()
  const [stats, setStats] = useState<StatsResp | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (mounted) setStats(data)
      } catch (err: unknown) {
        console.error('Failed to load stats', err)
      } finally {
        if (mounted) setLoadingStats(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleAddressSearch = async (q: string) => {
    if (!q || !q.trim()) return
    try {
      // Use Nominatim (OpenStreetMap) for simple geocoding
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
      const res = await fetch(url, { headers: { "Accept-Language": "en-US" } })
      if (!res.ok) throw new Error(`Geocode HTTP ${res.status}`)
      const body = await res.json()
      if (!body || !body.length) {
        toast.error('Address not found')
        return
      }
      const place = body[0]
      const lat = parseFloat(place.lat)
      const lon = parseFloat(place.lon)
      // navigate to root with lat/lng
      router.push(`/?lat=${lat}&lng=${lon}&zoom=14`)
    } catch (err: unknown) {
      console.error('Geocode failed', err)
      toast.error('Failed to geocode address')
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="text-center py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold">The open-source bubbler map</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Find public water bubblers, refill stations and public taps contributed by the community.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="w-full sm:w-3/4 lg:w-1/2">
              <SearchBar placeholder="Search a street address or place..." onSearch={handleAddressSearch} />
            </div>

            <div className="mt-6 w-full sm:w-3/4 lg:w-1/2 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Waypoints</div>
                <div className="text-xl font-bold">{loadingStats ? '–' : stats?.totalWaypoints ?? '–'}</div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Verified</div>
                <div className="text-xl font-bold">{loadingStats ? '–' : stats?.totalVerifiedWaypoints ?? '–'}</div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Users</div>
                <div className="text-xl font-bold">{loadingStats ? '–' : stats?.totalUsers ?? '–'}</div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Reviews</div>
                <div className="text-xl font-bold">{loadingStats ? '–' : stats?.totalReviews ?? '–'}</div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Contributions</div>
                <div className="text-xl font-bold">{loadingStats ? '–' : stats?.totalContributions ?? '–'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* About section removed per request */}
      </main>
    </div>
  )
}

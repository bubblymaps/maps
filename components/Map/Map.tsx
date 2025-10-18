"use client"

// packages & libraries
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

// ui components
import { SearchBar } from "@/components/Map/Search"
import { MapScale } from "@/components/Map/Scale"
import { Attribution } from "@/components/Map/Attribution"
import { Watermark } from "@/components/Map/Watermark"
import { AvatarManager } from "@/components/Avatar"
import { SignInButton } from "@/components/Map/SignIn"
import { ZoomControl } from "@/components/Map/Zoom"
import ThemeToggle from "@/components/ThemeToggle"
import { Spinner } from "@/components/ui/spinner"

import { BubblerPopup } from "@/components/Map/Popup"
import { createRoot } from "react-dom/client"

// util scripts
import { loadMap, addWaypoints } from "@/utils/MapUtils"
import { useTheme } from "@/lib/theme"

// types
import type { Waypoint } from "@/types/types"

export function Map() {
    //theme
    const { theme } = useTheme()
    //nextauth
    const { data: session } = useSession()
    // map
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null)
    // search
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState<Waypoint[]>([])
    // waypoints
    const [waypoints, setWaypoints] = useState<Waypoint[]>([])
    const popupRef = useRef<maplibregl.Popup | null>(null) // <- new


    // initialize map
    useEffect(() => {
        let effectiveTheme = theme
        if (theme === "system") {
            effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }

        loadMap(mapRef, mapContainerRef, effectiveTheme)

        if (mapRef.current && mapRef.current !== mapInstance) {
            setMapInstance(mapRef.current)
        }

        mapRef.current!.on("load", () => {
            addWaypoints(mapRef.current!, waypoints)
        })

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
                setMapInstance(null)
            }
        }
    }, [theme])

    // fetch waypoints
    useEffect(() => {
        fetch("/api/waypoints")
            .then((res) => res.json())
            .then((data: Waypoint[]) => {
                setWaypoints(data)
                if (mapRef.current?.isStyleLoaded()) addWaypoints(mapRef.current, data)
                else mapRef.current?.once("load", () => addWaypoints(mapRef.current!, data))
            })
    }, [])

    // search helpers
    useEffect(() => {
        if (!searchValue) {
            setSearchResults([])
            return
        }
        const results = waypoints.filter((wp) => wp.name.toLowerCase().includes(searchValue.toLowerCase()))
        setSearchResults(results)
    }, [searchValue, waypoints])

    return (
        <div className="relative w-full h-screen">
            <div ref={mapContainerRef} className="w-full h-full" />

            <div className="absolute top-5 left-5 z-10">
                <SearchBar
                    placeholder="Search water fountains..."
                    className="w-72 md:w-96"
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={() => {
                        if (!mapInstance) return

                        const selected = waypoints.find(
                            (wp) => wp.name.toLowerCase() === searchValue.toLowerCase()
                        )
                        if (!selected) return

                        // Remove previous popup
                        popupRef.current?.remove()

                        mapInstance.flyTo({ center: [selected.longitude, selected.latitude], zoom: 14 })

                        const container = document.createElement("div")
                        const root = createRoot(container)
                        root.render(<BubblerPopup wp={selected} />)

                        const newPopup = new maplibregl.Popup({ offset: 10, closeButton: true, maxWidth: "none" })
                            .setLngLat([selected.longitude, selected.latitude])
                            .setDOMContent(container)
                            .addTo(mapInstance)

                        popupRef.current = newPopup // save reference

                        setSearchResults([])
                    }}

                />
            </div>

            {searchResults.length > 0 && (
                <div
                    className="absolute top-[70px] left-5 w-72 md:w-96 max-h-64 overflow-y-auto
                  scrollbar-hide
                  bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                  rounded-xl shadow z-20"
                >
                    {searchResults.map((wp) => (
                        <div
                            key={wp.id}
                            className="px-4 py-2 cursor-pointer 
                   bg-white dark:bg-zinc-900 
                   hover:bg-gray-900 hover:text-white
                   transition-colors duration-200"
                            onClick={() => {
                                if (!mapInstance) return

                                // Remove previous popup
                                popupRef.current?.remove()

                                mapInstance.flyTo({ center: [wp.longitude, wp.latitude], zoom: 14 })

                                const container = document.createElement("div")
                                const root = createRoot(container)
                                root.render(<BubblerPopup wp={wp} />)

                                const newPopup = new maplibregl.Popup({ offset: 10, closeButton: true, maxWidth: "none" })
                                    .setLngLat([wp.longitude, wp.latitude])
                                    .setDOMContent(container)
                                    .addTo(mapInstance)

                                popupRef.current = newPopup // save reference

                                setSearchResults([])
                                setSearchValue(wp.name)
                            }}

                        >
                            {wp.name}
                        </div>
                    ))}
                </div>
            )}

            <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
                {session ? (
                    <AvatarManager />
                ) : (
                    <>
                        <SignInButton />
                        <ThemeToggle />
                    </>
                )}
            </div>

            <div className="absolute left-2 z-10">{mapInstance && <MapScale map={mapInstance} maxWidth={120} />}</div>

            {waypoints.length === 0 && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/50">
                    <Spinner />
                </div>
            )}

            <Attribution />
            <Watermark />
            <ZoomControl map={mapInstance} />
        </div>
    )
}

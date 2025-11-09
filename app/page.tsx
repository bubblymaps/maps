"use client"

import "maplibre-gl/dist/maplibre-gl.css"
import type { GeoJSON } from "geojson"
import maplibregl from "maplibre-gl"

import { useState } from "react"
import { useTheme } from "next-themes"
import type { Map } from "maplibre-gl"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

import MapBox from "@/components/Map/map"
import Login from "@/components/login"

import ReactDOM from "react-dom/client"
import { WaypointPopup } from "@/components/Map/popup"

import { ThemeToggle } from "@/components/themeToggle"
import { LoginBtn } from "@/components/loginBtn"
import { Watermark } from "@/components/Map/watermark"
import { Attribution } from "@/components/Map/attribution"
import { MapScale } from "@/components/Map/scale"
import { ZoomControl } from "@/components/Map/zoom"
import { SearchBar, WaypointSearch } from "@/components/Map/search"
import { AvatarManager } from "@/components/account"

interface Waypoint {
  id: number
  name: string
  latitude: number
  longitude: number
  verified: boolean
  approved: boolean
  amenities: string[] // or the correct type if different
  createdAt: string // or Date, depending on your backend
  updatedAt: string // or Date, depending on your backend
}

export default function Page() {
  const { theme } = useTheme()
  const [map, setMap] = useState<Map | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [currentPopup, setCurrentPopup] = useState<maplibregl.Popup | null>(null)

  const { data: session, status } = useSession()

  const latParam = Number.parseFloat(searchParams.get("lat") || "0")
  const lngParam = Number.parseFloat(searchParams.get("lng") || "0")
  const zoomParam = Number.parseFloat(searchParams.get("zoom") || "0")
  const idParam = searchParams.get("id")

  const initialCenter: [number, number] = latParam && lngParam ? [lngParam, latParam] : [-7, 0]
  const initialZoom: number = zoomParam || 1

  const styleURL =
    theme === "dark"
      ? "https://tiles.linus.id.au/styles/dark/style.json"
      : "https://tiles.linus.id.au/styles/light/style.json"

  const handleSearch = (val: string) => {
    if (!val) return
    console.log("Searching:", val)
    toast(`Searching for "${val}"`)
  }

  const handleMapMove = (map: Map) => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    const params = new URLSearchParams(window.location.search)
    params.set("lat", center.lat.toFixed(5))
    params.set("lng", center.lng.toFixed(5))
    params.set("zoom", zoom.toFixed(2))
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false })
  }

  const handleSelectWaypoint = (item: Waypoint) => {
    if (!map) return
    ;(async () => {
      // close previous popup if present
      if (currentPopup) {
        try {
          currentPopup.remove()
        } catch (e) {
          // ignore
        }
        setCurrentPopup(null)
      }

      // Fetch full waypoint details from API to ensure popup shows same data as clicking a point
      let full: any = item
      try {
        const res = await fetch(`/api/waypoints/${item.id}`)
        if (res.ok) {
          const body = await res.json()
          if (body && body.waypoint) full = body.waypoint
        }
      } catch (e) {
        // ignore and fall back to provided item
      }

      const coords: [number, number] = [full.longitude ?? item.longitude, full.latitude ?? item.latitude]
      map.easeTo({ center: coords, zoom: 14, duration: 700 })

      const popupNode = document.createElement("div")
      ReactDOM.createRoot(popupNode).render(<WaypointPopup waypoint={full} />)

      const popup = new maplibregl.Popup({
        offset: 10,
        closeOnClick: true,
      })
        .setLngLat(coords)
        .setDOMContent(popupNode)
        .addTo(map)

      const handleClose = () => {
        setCurrentPopup(null)
      }

      popup.on("close", handleClose)
      ;(popup as any)._closeHandler = handleClose

      setCurrentPopup(popup)
    })()
  }

  useEffect(() => {
    if (!map) return

    const loadWaypoints = async () => {
      console.log("Loading waypoints...")
      try {
        const res = await fetch("/api/waypoints")
        if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`)

        const data: Waypoint[] = await res.json()

        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.map((wp) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [wp.longitude, wp.latitude] },
            properties: wp,
          })),
        }
          ;["clusters", "cluster-count", "unclustered-point"].forEach((id) => {
            if (map.getLayer(id)) map.removeLayer(id)
          })
        if (map.getSource("waypoints")) map.removeSource("waypoints")

        map.addSource("waypoints", {
          type: "geojson",
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "waypoints",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#4A90E2", 10, "#357ABD", 50, "#1F4C8B"],
            "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 30],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        })

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "waypoints",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        })

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "waypoints",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#1E90FF",
            "circle-radius": 8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        })

        const source = map.getSource("waypoints") as maplibregl.GeoJSONSource

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] })
          const clusterId = features[0].properties.cluster_id

          source
            .getClusterExpansionZoom(clusterId)
            .then((zoom: number) => {
              map.easeTo({
                center: (features[0].geometry as any).coordinates as [number, number],
                zoom,
                duration: 500,
              })
            })
            .catch((err: Error) => console.error(err))
        })

        map.on("click", "unclustered-point", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] })
          if (!features.length) return

          const coordinates = (features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number]
          const properties = features[0].properties as Waypoint

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }

          const popupNode = document.createElement("div")
          ReactDOM.createRoot(popupNode).render(<WaypointPopup waypoint={properties} />)

          const popup = new maplibregl.Popup({
            offset: 10,
            closeOnClick: true,
          })
            .setLngLat(coordinates)
            .setDOMContent(popupNode)
            .addTo(map)

          const handleClose = () => {
            setCurrentPopup(null)
          }

          popup.on("close", handleClose)
            ; (popup as any)._closeHandler = handleClose

          setCurrentPopup(popup)
        })

        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = ""
        })

        map.on("mouseenter", "unclustered-point", () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = ""
        })

        console.log("Waypoints loaded.")

      } catch (err: any) {
        console.error(err)
        toast.error(`Failed to load waypoints: ${err.message}`)
      }
    }

    const handleStyleLoad = () => loadWaypoints()

    if (map.isStyleLoaded()) loadWaypoints()
    else map.once("style.load", handleStyleLoad)

    return () => {
      map.off("style.load", handleStyleLoad)
    }
  }, [map, styleURL])

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <MapBox
        styleURL={styleURL}
        center={initialCenter}
        zoom={initialZoom}
        showControls={false}
        className="w-full h-full"
        onMapLoad={(mapInstance) => {
          setMap(mapInstance)
          mapInstance.on("moveend", () => handleMapMove(mapInstance))
        }}
      />

      <div className="fixed top-4 left-4 right-4 z-50 flex flex-row items-center gap-2">
        <div className="flex-1 min-w-0 sm:max-w-md">
          <WaypointSearch placeholder="Search waypoints..." onSelect={handleSelectWaypoint} />
        </div>

        <div className="flex flex-row gap-2 shrink-0 ml-auto">
          {status === "authenticated" ? <AvatarManager /> : <LoginBtn onClick={() => setShowLogin(true)} />}
          <ThemeToggle />
        </div>
      </div>

      <Watermark />
      <Attribution />

      {map && <MapScale map={map} maxWidth={120} />}
      {map && <ZoomControl map={map} />}

      {showLogin && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fadeIn transition-opacity"
            onClick={() => setShowLogin(false)}
          />
          {/* Login modal */}
          <Login onClose={() => setShowLogin(false)} />
        </>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import type maplibregl from "maplibre-gl"

interface MapScaleProps {
  map?: maplibregl.Map | null
  maxWidth?: number
}

export function MapScale({ map, maxWidth = 100 }: MapScaleProps) {
  const [scaleWidth, setScaleWidth] = useState(0)
  const [scaleLabel, setScaleLabel] = useState("0 m")

  useEffect(() => {
    if (!map) return

    const updateScale = () => {
      const centerLat = map.getCenter().lat
      const metersPerPixel = (156543.03392 * Math.cos((centerLat * Math.PI) / 180)) / Math.pow(2, map.getZoom())

      const maxMeters = metersPerPixel * maxWidth

      const niceScale = (() => {
        if (maxMeters >= 1000) return Math.round(maxMeters / 1000) * 1000
        if (maxMeters >= 500) return 500
        if (maxMeters >= 200) return 200
        if (maxMeters >= 100) return 100
        if (maxMeters >= 50) return 50
        return 10
      })()

      const widthPx = (niceScale / maxMeters) * maxWidth

      setScaleWidth(widthPx)
      setScaleLabel(niceScale >= 1000 ? `${niceScale / 1000} km` : `${niceScale} m`)
    }

    map.on("move", updateScale)
    updateScale()

    return () => {
      map.off("move", updateScale)
    }
  }, [map, maxWidth])

  if (!map) return null

  return (
    <div className="absolute bottom-5 left-5 z-10 flex flex-nowrap items-center gap-2 text-xs font-medium text-foreground select-none">
      <div className="relative h-2 bg-muted rounded-full overflow-hidden" style={{ width: `${maxWidth}px` }}>
        <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: `${scaleWidth}px` }} />
      </div>
      <span className="whitespace-nowrap">{scaleLabel}</span>
    </div>
  )
}

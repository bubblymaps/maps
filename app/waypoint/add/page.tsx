"use client"

import { useEffect, useRef, useState } from "react"
import Header from "@/components/header"
import { useTheme } from "next-themes"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function AddWaypointPage() {
  const { theme } = useTheme()
  const { data: session, status } = useSession()

  const [step, setStep] = useState(1)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState("")
  const [region, setRegion] = useState("")
  const [maintainer, setMaintainer] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const previewMapContainer = useRef<HTMLDivElement | null>(null)
  const previewMapInstance = useRef<maplibregl.Map | null>(null)
  const [usingFallbackTiles, setUsingFallbackTiles] = useState(false)

  // default coords (Brisbane) if geolocation not available or delayed
  const DEFAULT = { lat: -27.62609, lng: 153.04549 }

  useEffect(() => {
    // Only initialize map when we're on step 2 (location step)
    if (step !== 2) return
    // initialize the map as soon as container is ready; use default center until geolocation arrives
    if (!mapContainer.current || mapInstance.current) return

    const initLat = lat ?? DEFAULT.lat
    const initLng = lng ?? DEFAULT.lng

    const primaryStyle = theme === "dark"
      ? "https://tiles.linus.id.au/styles/dark/style.json"
      : "https://tiles.linus.id.au/styles/light/style.json"
    const fallbackStyle = "https://demotiles.maplibre.org/style.json"

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: primaryStyle,
      center: [initLng, initLat],
      zoom: 16,
      attributionControl: false,
    })

    // if tiles/style fail to load, switch to a public fallback so the map is visible
    const onError = (err: any) => {
      // don't loop if fallback already applied
      if ((mapInstance.current as any)?.__bubbly_fallback) return
      console.warn("Map load error, switching to fallback style:", err)
      try {
        setUsingFallbackTiles(true)
        ;(mapInstance.current as any).__bubbly_fallback = true
        mapInstance.current?.setStyle(fallbackStyle)
      } catch (e) {
        console.error("Failed to set fallback style:", e)
      }
    }

    mapInstance.current.on("error", onError)


    // update coords on moveend (we'll use a centered crosshair overlay — users pan the map)
    // Using moveend instead of move to avoid constant re-renders during drag
    const onMoveEnd = () => {
      const c = mapInstance.current!.getCenter()
      setLat(c.lat)
      setLng(c.lng)
    }

    mapInstance.current.on("moveend", onMoveEnd)

    // Ensure map resizes properly when container becomes visible
    setTimeout(() => {
      mapInstance.current?.resize()
    }, 100)

    // attempt geolocation once and pan the map if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const pLat = pos.coords.latitude
          const pLng = pos.coords.longitude
          setLat(pLat)
          setLng(pLng)
          mapInstance.current?.easeTo({ center: [pLng, pLat], duration: 500 })
        },
        () => {
          // ignore errors, we'll stay on default
        },
      )
    }

    return () => {
      mapInstance.current?.off("moveend", onMoveEnd)
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [step, theme]) // Add step and theme as dependencies

  // when lat/lng change externally, also update marker/map center (but don't reinit map)
  useEffect(() => {
    if (!mapInstance.current) return
    if (lat == null || lng == null) return
    const center = mapInstance.current.getCenter()
    // only ease if center differs significantly
    if (Math.abs(center.lat - lat) > 0.000001 || Math.abs(center.lng - lng) > 0.000001) {
      mapInstance.current.easeTo({ center: [lng, lat], duration: 300 })
    }
  // no marker to sync — the crosshair sits at the viewport center
  }, [lat, lng])

  // Initialize preview map on step 3
  useEffect(() => {
    if (step !== 3 || !previewMapContainer.current || !lat || !lng) return
    if (previewMapInstance.current) return // already initialized

    const previewStyle = theme === "dark"
      ? "https://tiles.linus.id.au/styles/dark/style.json"
      : "https://tiles.linus.id.au/styles/light/style.json"

    previewMapInstance.current = new maplibregl.Map({
      container: previewMapContainer.current,
      style: previewStyle,
      center: [lng, lat],
      zoom: 15,
      interactive: false, // disable user interaction
      attributionControl: false,
    })

    // Add a marker at the location
    new maplibregl.Marker({ color: '#3b82f6' })
      .setLngLat([lng, lat])
      .addTo(previewMapInstance.current)

    return () => {
      previewMapInstance.current?.remove()
      previewMapInstance.current = null
    }
  }, [step, lat, lng, theme])

  const next = () => {
    if (step === 1 && !name) {
      toast.error("Please enter a name for the bubbler")
      return
    }
    if (step === 2 && (lat == null || lng == null)) {
      toast.error("Please set a location on the map")
      return
    }
    setStep((s) => Math.min(3, s + 1))
  }
  
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    if (!name || lat == null || lng == null) {
      toast.error("Please provide a name and position on the map")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: any = {
        name,
        latitude: lat,
        longitude: lng,
        description,
        amenities: amenities ? amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
        region,
      }

      // Add optional fields if provided
      if (maintainer) payload.maintainer = maintainer
      if (imageUrl) payload.image = imageUrl

      const res = await fetch(`/api/waypoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `HTTP ${res.status}`)
      }

      const result = await res.json()
      toast.success("Bubbler submitted successfully! Redirecting...")
      
      // reset
      setName(""); setDescription(""); setAmenities(""); setRegion("")
      setMaintainer(""); setImageUrl("")
      setStep(1)
      
      // Redirect to the new waypoint after a short delay
      setTimeout(() => {
        window.location.href = `/waypoint/${result.id}`
      }, 1500)
    } catch (err: any) {
      console.error(err)
      toast.error(`Failed to submit: ${err.message || err}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4">Add a bubbler</h1>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className={step === 1 ? "px-3 py-1 bg-primary text-primary-foreground rounded font-medium" : "px-3 py-1 border rounded text-muted-foreground"}>1</div>
              <div className="flex-1">
                <div className="font-semibold">Details</div>
                <div className="text-xs text-muted-foreground">Name, description and amenities</div>
              </div>
              <div className={step === 2 ? "px-3 py-1 bg-primary text-primary-foreground rounded font-medium" : "px-3 py-1 border rounded text-muted-foreground"}>2</div>
              <div className="flex-1">
                <div className="font-semibold">Location</div>
                <div className="text-xs text-muted-foreground">Pan map to the exact spot</div>
              </div>
              <div className={step === 3 ? "px-3 py-1 bg-primary text-primary-foreground rounded font-medium" : "px-3 py-1 border rounded text-muted-foreground"}>3</div>
              <div className="flex-1">
                <div className="font-semibold">Review</div>
                <div className="text-xs text-muted-foreground">Confirm and submit</div>
              </div>
            </div>
          </div>

          <div>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <label className="block">
                      <div className="text-sm font-medium mb-1">
                        Name <span className="text-red-500">*</span>
                      </div>
                      <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="e.g., Central Park Fountain"
                        className="w-full p-2.5 border rounded-lg bg-background transition" 
                        required
                      />
                    </label>

                    <label className="block">
                      <div className="text-sm font-medium mb-1">Description</div>
                      <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Describe the water fountain location and any helpful details..."
                        className="w-full p-2.5 border rounded-lg bg-background transition" 
                        rows={4} 
                      />
                      <div className="text-xs text-muted-foreground mt-1">Optional but helpful for others</div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
                  <div className="space-y-3">
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Amenities</div>
                      <input 
                        value={amenities} 
                        onChange={(e) => setAmenities(e.target.value)} 
                        placeholder="e.g., wheelchair accessible, bottle filler, cold water"
                        className="w-full p-2.5 border rounded-lg bg-background transition" 
                      />
                      <div className="text-xs text-muted-foreground mt-1">Separate multiple amenities with commas</div>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label>
                        <div className="text-sm font-medium mb-1">Region</div>
                        <input 
                          value={region} 
                          onChange={(e) => setRegion(e.target.value)} 
                          placeholder="e.g., Brisbane CBD"
                          className="w-full p-2.5 border rounded-lg bg-background transition" 
                        />
                      </label>

                      <label>
                        <div className="text-sm font-medium mb-1">Maintainer</div>
                        <input 
                          value={maintainer} 
                          onChange={(e) => setMaintainer(e.target.value)} 
                          placeholder="e.g., City Council"
                          className="w-full p-2.5 border rounded-lg bg-background transition" 
                        />
                      </label>
                    </div>

                    <label className="block">
                      <div className="text-sm font-medium mb-1">Image URL</div>
                      <input 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        className="w-full p-2.5 border rounded-lg bg-background transition" 
                      />
                      <div className="text-xs text-muted-foreground mt-1">Optional: Direct link to an image of the bubbler</div>
                    </label>

                    {imageUrl && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full max-w-sm h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pin the Location</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Drag the map to position the blue crosshair exactly over the bubbler. 
                    Zoom in for precision!
                  </p>
                </div>

                <div className="w-full h-96 rounded-lg overflow-hidden border relative shadow-sm">
                  <div ref={mapContainer} className="w-full h-full" />
                  {/* Centered crosshair overlay */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" className="text-primary" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" className="text-primary" />
                      <path d="M12 0v6M12 24v-6M0 12h6M24 12h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
                    </svg>
                  </div>
                  
                  {/* Coordinate display overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border rounded-lg px-4 py-2 text-xs font-mono shadow-lg">
                    <div className="flex gap-4">
                      <span>Lat: {lat?.toFixed(6) ?? "—"}</span>
                      <span>Lng: {lng?.toFixed(6) ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label>
                      <div className="text-xs text-muted-foreground mb-1">Latitude</div>
                      <input 
                        value={lat ?? ""} 
                        onChange={(e) => setLat(parseFloat(e.target.value) || null)} 
                        placeholder="-27.626090"
                        type="number"
                        step="any"
                        className="w-full p-2 border rounded-lg bg-background font-mono text-sm transition" 
                      />
                    </label>
                    <label>
                      <div className="text-xs text-muted-foreground mb-1">Longitude</div>
                      <input 
                        value={lng ?? ""} 
                        onChange={(e) => setLng(parseFloat(e.target.value) || null)} 
                        placeholder="153.045490"
                        type="number"
                        step="any"
                        className="w-full p-2 border rounded-lg bg-background font-mono text-sm transition" 
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Review Your Submission</h3>
                  <p className="text-sm text-muted-foreground">
                    Please review all details before submitting. You can go back to edit if needed.
                  </p>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  {/* Main Info */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold">{name}</h4>
                    {description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={imageUrl} 
                        alt={name}
                        className="w-full max-h-64 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {amenities && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">AMENITIES</div>
                        <div className="text-sm">
                          {amenities.split(',').map((a, i) => (
                            <span key={i} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs mr-1 mb-1">
                              {a.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {region && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">REGION</div>
                        <div className="text-sm">{region}</div>
                      </div>
                    )}

                    {maintainer && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">MAINTAINER</div>
                        <div className="text-sm">{maintainer}</div>
                      </div>
                    )}

                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">COORDINATES</div>
                      <div className="text-xs font-mono">
                        {lat?.toFixed(6) ?? '—'}, {lng?.toFixed(6) ?? '—'}
                      </div>
                    </div>
                  </div>

                  {/* Map Preview */}
                  {lat && lng && (
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">LOCATION PREVIEW</div>
                      <div ref={previewMapContainer} className="w-full h-128 rounded-lg overflow-hidden border bg-muted"></div>
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 border rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium">Submission Guidelines</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        • Ensure the location is accurate and precise<br/>
                        • The bubbler will be reviewed before appearing on the map<br/>
                        • You'll be redirected to the bubbler page after submission
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center border-t pt-6">
            <div>
              {step > 1 && (
                <button 
                  className="px-5 py-2.5 border rounded-lg font-medium hover:bg-accent transition-colors flex items-center gap-2" 
                  onClick={back}
                >
                  <span>←</span> Back
                </button>
              )}
            </div>
            <div className="flex gap-3 items-center">
              {step < 3 && (
                <>
                  <span className="text-sm text-muted-foreground">Step {step} of 3</span>
                  <button 
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={next}
                    disabled={step === 1 && !name}
                  >
                    Next <span>→</span>
                  </button>
                </>
              )}
              {step === 3 && (
                <button 
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleSubmit}
                  disabled={!name || lat == null || lng == null || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Bubbler
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

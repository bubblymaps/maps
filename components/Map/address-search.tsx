"use client"

import React, { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Suggestion {
  display_name: string
  lat: string
  lon: string
  type?: string
}

interface AddressSearchProps {
  className?: string
  placeholder?: string
  onSelect?: (lat: number, lon: number, raw: Suggestion) => void
}

export default function AddressSearch({ className, placeholder = "Search address or place...", onSelect }: AddressSearchProps) {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const debounceRef = useRef<number | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!q) {
      setResults([])
      setOpen(false)
      return
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const body = await res.json()
        setResults(body || [])
        setOpen(true)
        setActive(-1)
      } catch (err) {
        console.error(err)
        setResults([])
        setOpen(false)
      }
    }, 200)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [q])

  const handleChoose = (s: Suggestion) => {
    setQ(s.display_name)
    setOpen(false)
    const lat = parseFloat(s.lat)
    const lon = parseFloat(s.lon)
    if (onSelect) onSelect(lat, lon, s)
    else router.push(`/?lat=${lat}&lng=${lon}&zoom=14`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (active >= 0 && results[active]) handleChoose(results[active])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center bg-white dark:bg-zinc-900 border border-input rounded-full shadow-md px-3 py-2">
        <Search className="h-5 w-5 text-muted-foreground mr-2" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
          aria-label="Search address"
        />
        <button
          onClick={() => { setQ(""); setResults([]); setOpen(false); inputRef.current?.focus() }}
          aria-label="Clear search"
          className={cn("ml-2 text-muted-foreground", q ? "opacity-100" : "opacity-0 pointer-events-none")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-input rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lon}-${i}`}
              onMouseDown={(e) => { e.preventDefault(); handleChoose(r) }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800",
                i === active ? "bg-slate-50 dark:bg-zinc-800" : ""
              )}
            >
              <div className="truncate font-medium">{r.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

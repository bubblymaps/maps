"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
// This component no longer manipulates the map or popups directly.
// Selection is forwarded to the parent via onSelect so the page can
// create/close popups consistently.

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
}

export function SearchBar({
  placeholder = "Search...",
  value: initialValue = "",
  onChange,
  onSearch,
  className,
}: SearchBarProps) {
  const [input, setInput] = useState(initialValue)

  const handleInputChange = (val: string) => {
    setInput(val)
    onChange?.(val)
  }

  const handleClear = () => {
    setInput("")
    onChange?.("")
  }

  const handleSearch = () => {
    onSearch?.(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-full border border-input shadow-md focus-within:ring-2 focus-within:ring-ring transition bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm",
        className,
      )}
    >
      {/* Search icon */}
      <button
        onClick={handleSearch}
        type="button"
        className="ml-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground truncate"
      />

      {/* Clear button */}
      <button
        onClick={handleClear}
        type="button"
        aria-label="Clear search"
        className={cn(
          "mr-3 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer",
          input ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface WaypointSearchProps {
  onSelect?: (item: any) => void
  placeholder?: string
}

export function WaypointSearch({ onSelect, placeholder = "Search waypoints..." }: WaypointSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<any>>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      setOpen(false)
      return
    }

    // debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac

      try {
        const res = await fetch(`/api/waypoints?q=${encodeURIComponent(query)}`, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setResults(data || [])
        setOpen(true)
        setActiveIndex(-1)
      } catch (err) {
        if ((err as any).name === 'AbortError') return
        console.error(err)
        setResults([])
        setOpen(false)
      }
    }, 250)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleSelect = (item: any) => {
    setQuery(item.name)
    setOpen(false)
    onSelect?.(item)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) handleSelect(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <SearchBar placeholder={placeholder} value={query} onChange={(v) => setQuery(v)} onSearch={() => {}} />

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-input rounded-md shadow-lg z-50 max-h-72 overflow-auto">
          {results.map((r, idx) => (
            <button
              key={r.id}
              onMouseDown={(e) => {
                // use onMouseDown so input blur doesn't remove the list before click
                e.preventDefault()
                handleSelect(r)
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800",
                idx === activeIndex ? "bg-slate-100 dark:bg-zinc-800" : "",
              )}
            >
              <div className="truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

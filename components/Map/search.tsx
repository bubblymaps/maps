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
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef?: React.RefObject<HTMLInputElement>
  className?: string
}

interface WaypointSearchResult {
  id: number
  name: string
  latitude: number
  longitude: number
  verified: boolean
  approved: boolean
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  onKeyDown,
  inputRef,
  className,
}: SearchBarProps) {
  // Support both controlled and uncontrolled usage.
  const [internal, setInternal] = useState(value ?? "")

  // Sync internal state with controlled value using useRef to avoid cascading updates
  const prevValueRef = useRef(value)
  useEffect(() => {
    // Only update if value changed externally (not from our own input)
    if (value !== undefined && value !== prevValueRef.current) {
      setInternal(value)
      prevValueRef.current = value
    }
  }, [value])

  const handleInputChange = (val: string) => {
    if (value === undefined) setInternal(val)
    onChange?.(val)
  }

  const handleClear = () => {
    if (value === undefined) setInternal("")
    onChange?.("")
  }

  const handleSearch = () => {
    onSearch?.(value ?? internal)
  }

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (!e.defaultPrevented && e.key === "Enter") handleSearch()
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
        value={value ?? internal}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleLocalKeyDown}
        ref={inputRef}
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground truncate"
      />

      {/* Clear button */}
      <button
        onClick={handleClear}
        type="button"
        aria-label="Clear search"
        className={cn(
          "mr-3 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer",
          (value ?? internal) ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface WaypointSearchProps {
  onSelect?: (item: WaypointSearchResult) => void
  placeholder?: string
}

export function WaypointSearch({ onSelect, placeholder = "Search waypoints..." }: WaypointSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<WaypointSearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputEl = useRef<HTMLInputElement>(null!);
  const suppressRef = useRef(false)

  useEffect(() => {
    if (suppressRef.current) {
      // After selecting an item, keep the dropdown closed until user types again
      setOpen(false)
      return
    }
    if (!query) {
      setResults([])
      setOpen(false)
      setLoading(false)
      setError(null)
      return
    }

    if (query.trim().length < 2) {
      // Require at least 2 chars to avoid noisy results
      setResults([])
      setOpen(true)
      setLoading(false)
      setError(null)
      return
    }

    // debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/waypoints?q=${encodeURIComponent(query)}`, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
        setOpen(true)
        setActiveIndex(-1)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error(err)
        setResults([])
        setOpen(true)
        setError('Failed to search')
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleSelect = (item: WaypointSearchResult) => {
    // Fill input with selection but suppress re-query opening
    setQuery(item.name)
    setOpen(false)
    setResults([])
    suppressRef.current = true
    // Blur to provide a clear "selection committed" cue
    inputEl.current?.blur()
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

  // Close on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const highlight = (name: string) => {
    const q = query.trim()
    if (!q) return name
    const idx = name.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return name
    return (
      <>
        {name.slice(0, idx)}
        <span className="font-semibold underline underline-offset-2">{name.slice(idx, idx + q.length)}</span>
        {name.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div className="relative" ref={rootRef}>
      <SearchBar
        placeholder={placeholder}
        value={query}
        onChange={(v) => {
          // Any user change re-enables search dropdown behavior
          suppressRef.current = false
          setQuery(v)
        }}
        onSearch={() => {/* no-op; live search */}}
        onKeyDown={handleKeyDown}
        inputRef={inputEl}
      />

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-input rounded-md shadow-lg z-50 max-h-72 overflow-auto"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center">
                {/* lightweight spinner without importing extra css */}
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </span>
              Searching…
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">Type at least 2 characters to search</div>
          )}

          {!loading && error && (
            <div className="px-3 py-2 text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No waypoints found</div>
          )}

          {!loading && !error && results.length > 0 && (
            <div>
              {results.map((r, idx) => (
                <button
                  key={r.id}
                  role="option"
                  aria-selected={idx === activeIndex}
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
                  <div className="truncate flex items-center gap-2">
                    {highlight(r.name)}
                    {r.verified && <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Verified</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
